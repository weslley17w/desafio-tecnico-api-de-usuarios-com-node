import { HttpException } from '../../shared/erros/HttpExeption.js';
import { LoginDto } from './auth.dto.js';

export function validateLoginDto(data: LoginDto): void {
  if (!data) {
    throw new HttpException(400, 'Dados inválidos.');
  }

  if (!data.email || typeof data.email !== 'string') {
    throw new HttpException(400, 'Email é obrigatório e deve ser uma string.');
  }

  if (!data.password || typeof data.password !== 'string') {
    throw new HttpException(400, 'Senha é obrigatória e deve ser uma string.');
  }
}
