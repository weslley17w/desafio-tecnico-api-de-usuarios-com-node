import { User, getUserByEmail, addUser } from '../../shared/database.js';
import { CreateUserDto } from './user.dto.js';
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
}
