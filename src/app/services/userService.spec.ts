import { ZodError } from 'zod';
import { CacheService } from '../../shared/sevices/cacheService.js';
import { UserRepository } from '../repositories/userRepository.js';
import {
  createUserDTO,
  userFindByIdSchema,
  userDeleteSchema,
  userUpdateDTO,
  userUpdateSchema,
  userCreationSchema,
} from '../validadators/userSchema.js';
import { UserService } from './userService.js';

let userRepositoryMock: jest.Mocked<Partial<UserRepository>>;
let cacheServiceMock: jest.Mocked<Partial<CacheService>>;
let userMock: createUserDTO;
let updateMock: userUpdateDTO;
beforeEach(() => {
  userMock = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'TestPassword123@',
  };

  updateMock = { name: 'updatedName', email: 'updatedEmail@example.com', password: 'TestPassword123@' };

  userRepositoryMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    getAllUsersPaginated: jest.fn(),
    deleteUser: jest.fn(),
  };

  cacheServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };
});

describe('Create User', () => {
  it('should throw an error with invalid data', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);
    userCreationSchema.parse = jest.fn().mockImplementation(() => {
      throw new ZodError([
        {
          path: ['id'],
          message: 'Invalid ID format',
          code: 'custom',
          input: 'invalid-id',
        },
      ]);
    });
    userRepositoryMock.findByEmail = jest.fn().mockResolvedValue(userMock);

    await expect(userService.create(userMock)).rejects.toThrow('Erro de validação de dados.');
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });
  it('should throw an error if email already exists', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);
    userCreationSchema.parse = jest.fn();
    userRepositoryMock.findByEmail = jest.fn().mockResolvedValue(userMock);

    await expect(userService.create(userMock)).rejects.toThrow('Email já está em uso');
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });
});

describe('Find All Users', () => {
  it('should find paginated filtered users', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);

    const page = 1;
    const limit = 10;
    const filters = {};
    const usersData = { users: [], total: 0 };

    cacheServiceMock.get = jest.fn().mockResolvedValue(null);
    userRepositoryMock.getAllUsersPaginated = jest.fn().mockResolvedValue(usersData);
    cacheServiceMock.set = jest.fn();

    const result = await userService.findPaginatedFiltered(page, limit, filters);
    expect(result).toEqual(usersData);
    expect(cacheServiceMock.get).toHaveBeenCalledWith(`users:page:${page}:limit:${limit}`);
    expect(userRepositoryMock.getAllUsersPaginated).toHaveBeenCalledWith(page, limit, filters);
    expect(cacheServiceMock.set).toHaveBeenCalledWith(`users:page:${page}:limit:${limit}`, usersData, 120);
  });

  it('should return cached users if available', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);

    const page = 1;
    const limit = 10;
    const filters = {};
    const cachedUsersData = { users: [], total: 0 };

    cacheServiceMock.get = jest.fn().mockResolvedValue(cachedUsersData);

    const result = await userService.findPaginatedFiltered(page, limit, filters);
    expect(result).toEqual(cachedUsersData);
    expect(cacheServiceMock.get).toHaveBeenCalledWith(`users:page:${page}:limit:${limit}`);
    expect(userRepositoryMock.getAllUsersPaginated).not.toHaveBeenCalled();
  });
});

describe('Find User By Id', () => {
  it('should find user by ID', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);

    const userId = '9d4b0cad-13d3-44b0-b52f-218f417dedf2';

    cacheServiceMock.get = jest.fn().mockResolvedValue(null);
    userRepositoryMock.findById = jest.fn().mockResolvedValue(userMock);
    cacheServiceMock.set = jest.fn();

    const result = await userService.findById({ id: userId });
    expect(result).toEqual(userMock);
  });

  it('should find user by ID', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);

    const userId = '9d4b0cad-13d3-44b0-b52f-218f417dedf2';

    cacheServiceMock.get = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    await expect(userService.findById({ id: userId })).rejects.toThrow();
  });

  it('should not find user by ID', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);

    const userId = '123';

    cacheServiceMock.get = jest.fn().mockResolvedValue(null);
    userRepositoryMock.findById = jest.fn().mockResolvedValue(null);
    cacheServiceMock.set = jest.fn();

    await expect(userService.findById({ id: userId })).rejects.toThrow();
  });

  it('should return cached user if available', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);

    const userId = '9d4b0cad-13d3-44b0-b52f-218f417dedf2';

    cacheServiceMock.get = jest.fn().mockResolvedValue(userMock);
    const result = await userService.findById({ id: userId });
    expect(result).toEqual(userMock);
  });

  it('should return zod error in findById', async () => {
    const invalidId = 'invalid-id';
    userFindByIdSchema.parse = jest.fn().mockImplementation(() => {
      throw new ZodError([
        {
          path: ['id'],
          message: 'Invalid ID format',
          code: 'custom',
          input: invalidId,
        },
      ]);
    });
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);
    await expect(userService.findById({ id: invalidId })).rejects.toThrow('Erro de validação de dados.');
  });

  it('should return generic error in findById', async () => {
    const invalidId = 'invalid-id';
    userFindByIdSchema.parse = jest.fn().mockImplementation(() => {
      throw new Error('Generic error');
    });
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);
    await expect(userService.findById({ id: invalidId })).rejects.toThrow('Generic error');
  });
});

describe('Delete User By Id', () => {
  it('should delete user by ID', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);

    const userId = '33349eb9-4a21-4782-b939-3cfe7dcedd40';
    userRepositoryMock.findById = jest.fn().mockResolvedValue({ id: userId });
    userRepositoryMock.deleteUser = jest.fn();
    cacheServiceMock.del = jest.fn();

    await userService.delete({ id: userId });
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
  });

  it('should throw an error if user to delete does not exist', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);

    const userId = '33349eb9-4a21-4782-b939-3cfe7dcedd40';
    userRepositoryMock.findById = jest.fn().mockResolvedValue(null);

    await expect(userService.delete({ id: userId })).rejects.toThrow('Usuário não encontrado.');
    expect(userRepositoryMock.deleteUser).not.toHaveBeenCalled();
  });

  it('should throw a validation error when deleting user with invalid ID', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);
    const invalidId = 'invalid-id';

    userDeleteSchema.parse = jest.fn().mockImplementation(() => {
      throw new ZodError([
        {
          path: ['id'],
          message: 'Invalid ID format',
          code: 'custom',
          input: invalidId,
        },
      ]);
    });
    await expect(userService.delete({ id: invalidId })).rejects.toThrow('Erro de validação de dados.');
    expect(userRepositoryMock.deleteUser).not.toHaveBeenCalled();
  });
});

describe('Update User By Id', () => {
  it('should update user not find user', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);
    userDeleteSchema.parse = jest.fn();
    userRepositoryMock.update = jest.fn().mockResolvedValue(null);

    await expect(userService.update({ id: 'id-123' }, updateMock)).rejects.toThrow('Usuário não encontrado.');
  });

  it('should update user with invalid data', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);
    userDeleteSchema.parse = jest.fn();
    userUpdateSchema.parse = jest.fn().mockImplementation(() => {
      throw new ZodError([
        {
          path: ['id'],
          message: 'Invalid ID format',
          code: 'custom',
          input: 'invalid data',
        },
      ]);
    });
    const userId = '123';
    const updateData: userUpdateDTO = {
      name: 'updatedName',
      email: 'updatedEmail@example.com',
      password: 'newPassword',
    };
    userRepositoryMock.findById = jest.fn().mockResolvedValue({ id: userId, ...updateData });
    userRepositoryMock.update = jest.fn().mockResolvedValue({ id: userId, ...updateData });
    cacheServiceMock.set = jest.fn();
    await expect(userService.update({ id: userId }, updateData)).rejects.toThrow('Erro de validação de dados.');
  });

  it('should update user with return generic error', async () => {
    const userService = new UserService(userRepositoryMock as UserRepository, cacheServiceMock as CacheService);
    userDeleteSchema.parse = jest.fn();
    userUpdateSchema.parse = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    const userId = '123';
    const updateData: userUpdateDTO = {
      name: 'updatedName',
      email: 'updatedEmail@example.com',
      password: 'newPassword',
    };
    userRepositoryMock.findById = jest.fn().mockResolvedValue({ id: userId, ...updateData });
    userRepositoryMock.update = jest.fn().mockResolvedValue({ id: userId, ...updateData });
    cacheServiceMock.set = jest.fn();
    await expect(userService.update({ id: userId }, updateData)).rejects.toThrow();
  });
});
