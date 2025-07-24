import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AuthRepository } from '../repositories/authRepository.js';
import { authLoginSchemaDTO, authLoginSchema, tokenDTO } from '../validadators/authSchema.js';
import { HttpException } from '../../shared/erros/HttpExeption.js';
import { ZodError } from 'zod';
import { UserRepository } from '../repositories/userRepository.js';

export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository, userRepository: UserRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }

  public async create(data: authLoginSchemaDTO): Promise<tokenDTO> {
    try {
      authLoginSchema.parse(data);

      const user = await this.userRepository.findByEmai(data.email);

      if (!user) throw new HttpException(404, 'Usuário ou senha inválidos.');
      const isPasswordValid = await compare(data.password, user.password);
      if (!isPasswordValid) throw new HttpException(404, 'Usuário ou senha inválidos.');
      const accesToken = jwt.sign({ id: user.id }, env.AUTH_CONFIG_SECRET, {
        expiresIn: '24h',
      });

      await this.authRepository.deleteUserCreateId(user.id);
      const refreshTokenValue = randomUUID();
      const expires_at = dayjs().add(7, 'day').toDate();
      const refreshToken = await this.authRepository.create({
        created_by: user.id,
        token: refreshTokenValue,
        expires_at,
      });

      const token: tokenDTO = {
        accesToken,
        refreshToken: refreshToken.token,
      };

      return token;
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

  public async refreshToken(token: string): Promise<tokenDTO> {
    const refreshToken = await this.authRepository.findByToken(token);
    if (!refreshToken) throw new HttpException(400, 'Refresh Token invalido!');
    const isExpired = dayjs(dayjs()).isAfter(refreshToken.expires_at);
    if (isExpired) {
      await refreshToken.destroy();
      throw new HttpException(400, 'Refresh Token expirado!');
    }

    const accesToken = jwt.sign({ id: refreshToken.creator.id }, env.AUTH_CONFIG_SECRET, {
      expiresIn: '24h',
    });

    await this.authRepository.deleteUserCreateId(refreshToken.creator.id);
    const refreshTokenValue = randomUUID();
    const expires_at = dayjs().add(7, 'day').toDate();

    const newRefreshToken = await this.authRepository.create({
      created_by: refreshToken.creator.id,
      token: refreshTokenValue,
      expires_at,
    });

    return {
      accesToken,
      refreshToken: newRefreshToken.token,
    };
  }
}
