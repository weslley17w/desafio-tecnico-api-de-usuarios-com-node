import request from 'supertest';
import app from '../../app.js';
import { User } from '../../database/models/index.js';
import { redisClient } from '../../shared/db/redis.js';

let mockUser: object;

let mockUsers = async () => {
  const users = [];
  for (let i = 1; i <= 15; i++) {
    const userData = {
      name: `Test ${i}`,
      email: `test-${i}@test.com`,
      password: 'Test@123',
    };
    users.push(userData);
  }
  await User.bulkCreate(users);
};

beforeEach(async () => {
  await User.truncate({ cascade: true });
  await redisClient.flushAll();
  mockUser = {
    name: 'test',
    email: 'test@test.com',
    password: 'Test@123',
  };
});

beforeAll(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
});

afterAll(async () => {
  await redisClient.quit();
});

describe('Create User', () => {
  it('should create a user with valid data', async () => {
    const response = await request(app).post('/users').send(mockUser);
    expect(response.statusCode).toEqual(201);
  });

  it('should create a user with invalid email', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...mockUser,
        email: 'invalid-mail',
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('Erro de validação de dados.');
    expect(response.body.error[0].message).toEqual('Email invalido');
    expect(response.body.error[0].field).toEqual('email');
  });

  it('should create a user with email already registered', async () => {
    await request(app)
      .post('/users')
      .send({
        ...mockUser,
      });

    const response2 = await request(app)
      .post('/users')
      .send({
        ...mockUser,
      });

    expect(response2.statusCode).toEqual(400);
    expect(response2.body.message).toEqual('Email já está em uso');
  });

  it('should create a user with empty data', async () => {
    const response = await request(app).post('/users').send({
      name: '',
      email: '',
      password: '',
    });

    expect(response.body.message).toEqual('Erro de validação de dados.');
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        { field: 'name', message: 'Nome é obrigatório' },
        { field: 'email', message: 'Email é obrigatório' },
        { field: 'email', message: 'Email invalido' },
        { field: 'password', message: 'Senha é obrigatório' },
        {
          field: 'password',
          message:
            'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caractere especial.',
        },
      ]),
    );
  });
});

describe('List User', () => {
  it('should return an empty when there are no user', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ users: [], total: 0 });
  });

  it('should return the correct page of users with limit and page parametes', async () => {
    await mockUsers();
    const response = await request(app).get('/users?page=2&limit=5');
    expect(response.body.total).toBe(15);
    expect(response.body.users).toHaveLength(5);
    expect(response.body.users[0].name).toEqual('Test 6');
    expect(response.body.users[4].name).toEqual('Test 10');
    expect(response.body.users[0].name).not.toHaveProperty('password');
  });
});

describe('List User By ID', () => {
  it('should return the correct user', async () => {
    const response = await request(app).post('/users').send(mockUser);
    const userId = response.body.id;
    const response2 = await request(app).get(`/users/${userId}`);
    expect(response2.body).toMatchObject(response.body);
  });

  it('should return the correct user cached', async () => {
    const response = await request(app).post('/users').send(mockUser);
    const userId = response.body.id;
    await request(app).get(`/users/${userId}`);
    const response3 = await request(app).get(`/users/${userId}`);
    expect(response3.body).toMatchObject(response.body);
  });

  it('shoul return 400 error for an invalid user id', async () => {
    const response = await request(app).get(`/users/1`);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Erro de validação de dados.');
    expect(response.body.error[0].message).toBe('Invalid UUID');
  });
});

describe('Update User', () => {
  it('should update a user and return the updated data without the password', async () => {
    const data = await request(app).post('/users').send(mockUser);
    const userId = data.body.id;
    const newName = { name: 'Test 1' };
    const response = await request(app).put(`/users/${userId}`).send(newName);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      id: userId,
      name: response.body.name,
      email: response.body.email,
    });
  });

  it('should update a user and return the updated data with password', async () => {
    const data = await request(app).post('/users').send(mockUser);
    const userId = data.body.id;
    const newName = { name: 'Test 1', password: 'Pass@123' };
    const response = await request(app).put(`/users/${userId}`).send(newName);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      id: userId,
      name: response.body.name,
      email: response.body.email,
    });
  });

  it('should return 404 error when trying to update a non-existent user', async () => {
    const response = await request(app).put(`/users/9d4b0cad-13d3-44b0-b52f-218f417dedf2`).send({ name: 'Test 1' });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Usuário não encontrado.');
  });

  it('should return 400 error when trying to update with a invalid email format', async () => {
    const data = await request(app).post('/users').send(mockUser);
    const userId = data.body.id;
    const newName = { email: 'invalid-mail' };
    const response = await request(app).put(`/users/${userId}`).send(newName);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Erro de validação de dados.');
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        { field: 'email', message: 'Email invalido' },
        { field: 'name.email.password', message: 'Pelo menos um campo(nome, email ou senha) deve ser fornecido' },
      ]),
    );
  });
});

describe('Delete User', () => {
  it('should be able to delete a user', async () => {
    const response = await request(app).post('/users').send(mockUser);
    const userId = response.body.id;
    const response2 = await request(app).delete(`/users/${userId}`);

    expect(response.statusCode).toEqual(201);
    expect(response2.statusCode).toEqual(204);
  });

  it('should be able to delete a user', async () => {
    const response = await request(app).post('/users').send(mockUser);
    const userId = response.body.id;
    const response2 = await request(app).delete(`/users/${userId}`);

    expect(response.statusCode).toEqual(201);
    expect(response2.statusCode).toEqual(204);
  });

  it('should be able ', async () => {
    const response = await request(app).post('/users').send(mockUser);
    const userId = response.body.id;
    const response2 = await request(app).delete(`/users/${userId}`);

    expect(response.statusCode).toEqual(201);
    expect(response2.statusCode).toEqual(204);
  });

  it('should return 404 error when trying to delete non-existing user ', async () => {
    const response = await request(app).delete(`/users/33349eb9-4a21-4782-b939-3cfe7dcedd40`);

    expect(response.statusCode).toEqual(404);
  });

  it('should not be able to delete a user with an invalid id', async () => {
    const response = await request(app).delete(`/users/invalid-id`);
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('Erro de validação de dados.');
  });
});
