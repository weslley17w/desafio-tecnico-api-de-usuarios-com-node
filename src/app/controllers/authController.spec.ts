import request from 'supertest';
import app from '../../app.js';
import { User } from '../../database/models/index.js';
import { redisClient } from '../../shared/db/redis.js';

describe('Auth test', () => {
  let mockUser: object;

  beforeEach(async () => {
    await User.truncate({ cascade: true });
    await redisClient.flushAll();
  });

  beforeAll(async () => {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    mockUser = {
      name: 'Login',
      email: 'login@exemple.com',
      password: 'Pass@123',
    };
  });

  afterAll(async () => {
    await redisClient.quit();
    await User.truncate({ cascade: true });
  });

  describe('Create Token', () => {
    it('should authenticate a user with valid credentials and return tokens', async () => {
      await request(app).post(`/users`).send(mockUser);
      const response = await request(app).post(`/auth`).send(mockUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accesToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(typeof response.body.accesToken).toBe('string');
      expect(typeof response.body.refreshToken).toBe('string');
    });

    it('should authenticate a user with valid credentials and return tokens', async () => {
      await request(app).post(`/users`).send(mockUser);
      const response = await request(app).post(`/auth`).send({
        email: 'login2@exemple.com',
        password: 'Pass@123',
      });

      const response2 = await request(app).post(`/auth`).send({
        email: 'login@exemple.com',
        password: 'Pass@1232',
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Usuário ou senha inválidos.');

      expect(response2.status).toBe(404);
      expect(response2.body.message).toBe('Usuário ou senha inválidos.');
    });

    it('should not authenticate with invalid input data', async () => {
      const response = await request(app).post('/auth').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining([
          {
            field: 'email',
            message: 'Invalid input: expected string, received undefined',
          },
          {
            field: 'password',
            message: 'Invalid input: expected string, received undefined',
          },
        ]),
      );
    });

    it('should successfully refresh tokens with a valid refresh token', async () => {
      await request(app).post(`/users`).send(mockUser);
      const user = await request(app).post(`/auth`).send(mockUser);
      const originalRefreshToken = user.body.refreshToken;
      const refreshResponse = await request(app).post('/auth/refresh-token').send({ token: originalRefreshToken });

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body).toHaveProperty('accesToken');
      expect(refreshResponse.body).toHaveProperty('refreshToken');
      expect(refreshResponse.body.refreshToken).not.toBe(originalRefreshToken);
    });
  });
});
