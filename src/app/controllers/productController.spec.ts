import request from 'supertest';
import app from '../../app.js';
import { User, Product } from '../../database/models/index.js';
import { redisClient } from '../../shared/db/redis.js';
import { Op } from 'sequelize';

let mockUser: object;
let mockProduct: object;
let bearer: { id: string; email: string; token: string };

let mockProducts = async () => {
  const products = [];
  for (let i = 1; i <= 15; i++) {
    const productData = {
      title: `Title ${i}`,
      price: Number(i),
      description: `Description ${i}`,
      created_by: bearer.id,
    };
    products.push(productData);
  }

  await Product.bulkCreate(products);
};

beforeEach(async () => {
  await Product.truncate({ cascade: true });
  await User.destroy({
    where: {
      email: {
        [Op.ne]: 'login@exemple.com',
      },
    },
  });
  await redisClient.flushAll();
});

beforeAll(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  mockUser = {
    name: 'test',
    email: 'test@test.com',
    password: 'Test@123',
  };

  const user = await request(app).post(`/users`).send({
    name: 'Login',
    email: 'login@exemple.com',
    password: 'Pass@123',
  });

  const login = await request(app).post(`/auth`).send({
    email: 'login@exemple.com',
    password: 'Pass@123',
  });

  bearer = { token: login.body.accesToken, id: user.body.id, email: user.body.email };

  mockProduct = {
    title: 'Test',
    price: 23,
    description: 'description',
  };
});

afterAll(async () => {
  await redisClient.quit();
  await Product.truncate({ cascade: true });
  await User.truncate({ cascade: true });
});

describe('Create Product', () => {
  it('should create a product with valid data', async () => {
    const response = await request(app)
      .post(`/products`)
      .set('Authorization', 'bearer ' + bearer.token)
      .send(mockProduct);

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(mockProduct);
  });

  it('should create a product with invalid data', async () => {
    const response = await request(app)
      .post(`/products`)
      .set('Authorization', 'bearer ' + bearer.token)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Erro de validação de dados.');
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        {
          field: 'title',
          message: 'Invalid input: expected string, received undefined',
        },
        {
          field: 'price',
          message: 'Invalid input: expected number, received undefined',
        },
        {
          field: 'description',
          message: 'Invalid input: expected string, received undefined',
        },
      ]),
    );
  });
});

describe('Update Product', () => {
  it('should successfully update an existing product', async () => {
    const productToUpdate = await request(app)
      .post('/products')
      .set('Authorization', 'bearer ' + bearer.token)
      .send(mockProduct);

    const productId = productToUpdate.body.id;

    const updatePayload = {
      title: 'Updated Product Title',
      price: 150.99,
    };

    const response = await request(app)
      .put(`/products/${productId}`)
      .set('Authorization', 'bearer ' + bearer.token)
      .send(updatePayload);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatePayload.title);
    expect(response.body.price).toBe(updatePayload.price);
  });

  it('should not allow a user to update a product they did not create', async () => {
    await request(app).post(`/users`).send({
      name: 'Login',
      email: 'login2@exemple.com',
      password: 'Pass@123',
    });

    const login2 = await request(app).post(`/auth`).send({
      email: 'login2@exemple.com',
      password: 'Pass@123',
    });

    const product = await request(app)
      .post('/products')
      .set('Authorization', 'bearer ' + bearer.token)
      .send(mockProduct);

    const productId = product.body.id;
    const response = await request(app)
      .put(`/products/${productId}`)
      .set('Authorization', 'bearer ' + login2.body.accesToken)
      .send({ title: 'Updated Product Title' });

    expect(response.status).toBe(403);
    expect(response.body.message).toEqual('Você não tem permissão para atualizar este produto.');
  });

  it('should return a 404 error when trying to update a non-existing product', async () => {
    const nonExistingId = '123e4567-e89b-12d3-a456-426614174000';

    const response = await request(app)
      .put(`/products/${nonExistingId}`)
      .set('Authorization', 'bearer ' + bearer.token)
      .send({ title: 'Updated Product Title' });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Produto não encontrado.');
  });

  it('should return a 400 error when trying to update a product with invalid data', async () => {
    const product = await request(app)
      .post('/products')
      .set('Authorization', 'bearer ' + bearer.token)
      .send(mockProduct);

    const productId = product.body.id;

    const response = await request(app)
      .put(`/products/${productId}`)
      .set('Authorization', 'bearer ' + bearer.token)
      .send({ price: -5 });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Erro de validação de dados.');
    expect(response.body.error).toEqual(
      expect.arrayContaining([{ field: 'price', message: 'Preço deve ser um número positivo' }]),
    );
  });
});

describe('List Products', () => {
  it('should return a paginated list of products', async () => {
    mockProducts();

    const response = await request(app)
      .get('/products')
      .set('Authorization', 'bearer ' + bearer.token);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(15);
    expect(response.body.products.length).toBe(10);
  });

  it('should return a paginated list of products cache', async () => {
    mockProducts();

    await request(app)
      .get('/products')
      .set('Authorization', 'bearer ' + bearer.token);

    const response = await request(app)
      .get('/products')
      .set('Authorization', 'bearer ' + bearer.token);
    expect(response.status).toBe(200);
    expect(response.body.total).toBe(15);
    expect(response.body.products.length).toBe(10);
  });

  it('should return the correct page of products with limit and page parametes', async () => {
    await mockProducts();
    const response = await request(app)
      .get('/products?page=2&limit=5')
      .set('Authorization', 'bearer ' + bearer.token);

    expect(response.body.total).toBe(15);
    expect(response.body.products).toHaveLength(5);
    expect(response.body.products[0].title).toEqual('Title 6');
    expect(response.body.products[4].title).toEqual('Title 10');
  });
});

describe('List Product by Id', () => {
  it('should return a single product by ID', async () => {
    const product = await request(app)
      .post(`/products`)
      .set('Authorization', 'bearer ' + bearer.token)
      .send(mockProduct);

    const productId = product.body.id;
    const response = await request(app)
      .get(`/products/${productId}`)
      .set('Authorization', 'bearer ' + bearer.token);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body).toMatchObject(mockProduct);
  });

  it('should return a single product cache by ID', async () => {
    const product = await request(app)
      .post(`/products`)
      .set('Authorization', 'bearer ' + bearer.token)
      .send(mockProduct);

    const productId = product.body.id;
    const response = await request(app)
      .get(`/products/${productId}`)
      .set('Authorization', 'bearer ' + bearer.token);

    const response2 = await request(app)
      .get(`/products/${productId}`)
      .set('Authorization', 'bearer ' + bearer.token);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body).toMatchObject(mockProduct);
    expect(response2.status).toBe(200);
    expect(response2.body.id).toBe(productId);
    expect(response2.body).toMatchObject(mockProduct);
  });

  it('should return a 404 error if the product does not exist', async () => {
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const response = await request(app)
      .get(`/products/${nonExistentId}`)
      .set('Authorization', 'bearer ' + bearer.token);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Produto não encontrado.');
  });
});

describe('Delete Product', () => {
  it('should successfully delete a product', async () => {
    const product = await request(app)
      .post(`/products`)
      .set('Authorization', 'bearer ' + bearer.token)
      .send(mockProduct);
    const productId = product.body.id;
    const deleteResponse = await request(app)
      .delete(`/products/${productId}`)
      .set('Authorization', 'bearer ' + bearer.token);

    expect(deleteResponse.status).toBe(204);
  });

  it('should return a 404 error when trying to delete a non-existing product', async () => {
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const response = await request(app)
      .delete(`/products/${nonExistentId}`)
      .set('Authorization', 'bearer ' + bearer.token);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Produto não encontrado.');
  });

  it('should return a 400 error when trying to delete a invalid id', async () => {
    const nonExistentId = 'invalid-id';
    const response = await request(app)
      .delete(`/products/${nonExistentId}`)
      .set('Authorization', 'bearer ' + bearer.token);

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        {
          field: 'id',
          message: 'Invalid UUID',
        },
      ]),
    );
  });

  it('should not allow a user to delete a product they do not own', async () => {
    const product = await request(app)
      .post(`/products`)
      .set('Authorization', 'bearer ' + bearer.token)
      .send(mockProduct);
    const productId = product.body.id;

    await request(app).post(`/users`).send({
      name: 'Login',
      email: 'login2@exemple.com',
      password: 'Pass@123',
    });

    const login2 = await request(app).post(`/auth`).send({
      email: 'login2@exemple.com',
      password: 'Pass@123',
    });

    const response = await request(app)
      .delete(`/products/${productId}`)
      .set('Authorization', 'bearer ' + login2.body.accesToken);

    expect(response.status).toBe(403);
    expect(response.body.message).toEqual('Você não tem permissão para excluir este produto.');
  });
});
