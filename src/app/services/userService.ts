import { hash } from 'bcrypt';
import { UserRepository } from '../repositories/userRepository.js';
import { User } from '../../database/models/index.js';
import {
  createUserDTO,
  userCreationSchema,
  userDeleteSchema,
  userDeleteDTO,
  userFindByIdSchema,
  userFindByIdDTO,
  userUpdateIdParamDTO,
  userUpdateSchema,
  userUpdateDTO,
} from '../validadators/userSchema.js';
import { HttpException } from '../../shared/erros/HttpExeption.js';
import { ZodError } from 'zod';
import { CacheService } from '../../shared/sevices/cacheService.js';

const cacheKeyPrefix = {
  user: (id: string) => `user:${id}`,
  listUsers: (page: number, limit: number) => `users:page:${page}:limit:${limit}`,
};

export class UserService {
  private readonly userRepository: UserRepository;
  private readonly cacheService: CacheService;

  constructor(userRepository: UserRepository, cacheService: CacheService) {
    this.userRepository = userRepository;
    this.cacheService = cacheService;
  }

  public async create(data: createUserDTO): Promise<User> {
    try {
      const validData = userCreationSchema.parse(data);
      const hashedPassword = await hash(data.password, 10);
      const emailExists = await this.userRepository.findByEmail(data.email);

      if (emailExists) throw new HttpException(400, 'Email já está em uso');

      return this.userRepository.create({
        ...validData,
        password: hashedPassword,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new HttpException(400, 'Erro de validação de dados.', zodError);
      }
      throw error;
    }
  }

  public async findPaginatedFiltered(
    page: number,
    limit: number,
    filters: Partial<userUpdateDTO>,
  ): Promise<{ users: User[]; total: number }> {
    const cacheKey = cacheKeyPrefix.listUsers(page, limit);
    const cachedUsers = await this.cacheService.get<{ users: User[]; total: number }>(cacheKey);
    if (cachedUsers) return cachedUsers;

    const users = await this.userRepository.getAllUsersPaginated(page, limit, filters);
    await this.cacheService.set(cacheKey, users, 120);
    return users;
  }

  public async findById({ id }: userFindByIdDTO): Promise<User | null> {
    try {
      userFindByIdSchema.parse({ id });
      const cacheId = cacheKeyPrefix.user(id);
      const cachedUser = await this.userRepository.findByIdCached(cacheId);

      if (cachedUser) {
        return cachedUser;
      }

      const user = await this.userRepository.findById(id);
      if (user === null) throw new HttpException(404, 'Usuário não encontrado.');

      await this.cacheService.set(cacheId, user, 86400);

      return user;
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new HttpException(400, 'Erro de validação de dados.', zodError);
      }
      throw error;
    }
  }

  public async delete({ id }: userDeleteDTO): Promise<void> {
    try {
      userDeleteSchema.parse({ id });
      const userExists = await this.userRepository.findById(id);
      if (userExists === null) throw new HttpException(404, 'Usuário não encontrado.');

      await this.userRepository.deleteUser(id);
      await this.cacheService.del(cacheKeyPrefix.user(id));
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new HttpException(400, 'Erro de validação de dados.', zodError);
      }
      throw error;
    }
  }

  public async update({ id }: userUpdateIdParamDTO, data: userUpdateDTO): Promise<User> {
    try {
      userDeleteSchema.parse({ id });
      userUpdateSchema.parse(data);
      let dataHashed;
      if (data.password) {
        const hashedPassword = await hash(data.password, 10);
        dataHashed = {
          ...data,
          password: hashedPassword,
        };
      } else {
        dataHashed = data;
      }

      const user = await this.userRepository.update(id, dataHashed);
      if (!user) throw new HttpException(404, 'Usuário não encontrado.');
      await this.cacheService.set(cacheKeyPrefix.user(id), user, 86400);
      return user;
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new HttpException(400, 'Erro de validação de dados.', zodError);
      }
      throw error;
    }
  }
}
