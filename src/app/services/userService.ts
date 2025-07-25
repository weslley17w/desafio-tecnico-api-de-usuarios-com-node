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
export class UserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async create(data: createUserDTO): Promise<User> {
    try {
      const validData = userCreationSchema.parse(data);
      const hashedPassword = await hash(data.password, 10);
      const emailExists = await this.userRepository.findByEmai(data.email);

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
        throw new HttpException(400, 'Erro de validação de dados. ', zodError);
      }
      throw error;
    }
  }

  public async findAll(): Promise<User[] | []> {
    return await this.userRepository.getAllUsers();
  }

  public async findById({ id }: userFindByIdDTO): Promise<User | null> {
    try {
      userFindByIdSchema.parse({ id });
      const user = await this.userRepository.findById(id);
      if (user === null) throw new HttpException(404, 'Usuário não encontrado.');

      return user;
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new HttpException(400, 'Erro de validação de dados. ', zodError);
      }
      throw error;
    }
  }

  public async delete({ id }: userDeleteDTO): Promise<void> {
    try {
      userDeleteSchema.parse({ id });
      const userExists = await this.userRepository.findById(id);
      if (userExists === null) throw new HttpException(404, 'Usuário não encontrado.');

      return await this.userRepository.deleteUser(id);
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new HttpException(400, 'Erro de validação de dados. ', zodError);
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
      return user;
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new HttpException(400, 'Erro de validação de dados. ', zodError);
      }
      throw error;
    }
  }
}
