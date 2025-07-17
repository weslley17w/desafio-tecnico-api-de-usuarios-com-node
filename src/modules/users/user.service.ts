import {
  User,
  getUserByEmail,
  getUser,
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../../shared/database.js';
import { CreateUserDto, paginatedUsers, UserResponseDto } from './user.dto.js';
import { HttpException } from '../../shared/erros/HttpExeption.js';
import { hash } from 'bcrypt';

export class UserService {
  async createUser(userData: CreateUserDto): Promise<User> {
    if (getUserByEmail(userData.email)) {
      throw new HttpException(400, 'O campo email já está em uso.');
    }

    const hashedPassword = await hash(userData.password, 10);

    const newUser: User = {
      id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    };

    addUser(newUser);

    return newUser;
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<paginatedUsers> {
    const users = getAllUsers();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = users.slice(startIndex, endIndex);

    return {
      page,
      limit,
      total: users.length,
      data: data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    };
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    const user = getUser(id);
    if (!user) {
      throw new HttpException(404, 'Usuário não encontrado.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async updateUser(
    id: string,
    updatedData: Partial<CreateUserDto>,
  ): Promise<UserResponseDto | null> {
    const user = getUser(id);
    if (!user) {
      throw new HttpException(404, 'Usuário não encontrado.');
    }

    if (updatedData.email && getUserByEmail(updatedData.email)) {
      throw new HttpException(400, 'O campo email já está em uso.');
    }

    if (updatedData.password) {
      updatedData.password = await hash(updatedData.password, 10);
    }

    const updatedUser: Partial<User> = {
      ...user,
      ...updatedData,
    };

    const data = updateUser(id, updatedUser) as User;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
    };
  }

  async deleteUser(id: string): Promise<void> {
    const user = getUser(id);
    if (!user) {
      throw new HttpException(404, 'Usuário não encontrado.');
    }

    deleteUser(id);
  }
}
