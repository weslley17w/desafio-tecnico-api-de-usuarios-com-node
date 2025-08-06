import { AuthService } from '../services/authService.js';
import { AuthRepository } from '../repositories/authRepository.js';
import { UserRepository } from '../repositories/userRepository.js';
import { authSchema } from '../validadators/authSchema.js';
import { createUserDTO } from '../validadators/userSchema.js';

let authRepositoryMock: jest.Mocked<Partial<AuthRepository>>;
let userRepositoryMock: jest.Mocked<Partial<UserRepository>>;
let userMock: createUserDTO;

beforeEach(() => {
  userMock = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'TestPassword123@',
  };

  userRepositoryMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    getAllUsersPaginated: jest.fn(),
    deleteUser: jest.fn(),
  };

  authRepositoryMock = {
    create: jest.fn(),
    deleteUserCreateId: jest.fn(),
    findByToken: jest.fn(),
  };
});

describe('authService', () => {
  describe('Login', () => {
    it('should throw an error with', async () => {
      const authService = new AuthService(authRepositoryMock as AuthRepository, userRepositoryMock as UserRepository);
      authSchema.parse = jest.fn().mockImplementation(() => {
        throw new Error('Generic error');
      });
      userRepositoryMock.findByEmail = jest.fn().mockResolvedValue(userMock);

      await expect(authService.create(userMock)).rejects.toThrow();
    });
  });
});
