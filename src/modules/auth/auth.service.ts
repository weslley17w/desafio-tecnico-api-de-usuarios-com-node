import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../../shared/database.js';
import { HttpException } from '../../shared/erros/HttpExeption.js';

export class AuthService {
  async login(email: string, password: string): Promise<string> {
    const user = getUserByEmail(email);

    if (!user) {
      throw new HttpException(404, 'Usuário ou senha inválidos.');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(404, 'Usuário ou senha inválidos.');
    }

    if (!process.env.AUTH_CONFIG_SECRET) {
      throw new HttpException(500, 'Erro interno do servidor.');
    }

    const token = jwt.sign({ id: user.id }, process.env.AUTH_CONFIG_SECRET, {
      expiresIn: '24h',
    });

    return token;
  }
}
