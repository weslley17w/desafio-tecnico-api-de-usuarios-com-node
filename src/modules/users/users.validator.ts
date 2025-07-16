import { CreateUserDto } from './user.dto.js';
import { HttpException } from '../../shared/erros/HttpExeption.js';

export function validateCreateUserDto(data: CreateUserDto): void {
  if (!data) {
    throw new HttpException(400, 'Dados inválidos.');
  }

  if (typeof data.name !== 'string' || data.name.trim() === '') {
    throw new HttpException(400, 'O campo nome é obrigatório.');
  }

  if (typeof data.email !== 'string' || !data.email.includes('@')) {
    throw new HttpException(400, 'O campo email é invalido.');
  }

  if (typeof data.password !== 'string' || data.name.trim() === '') {
    throw new HttpException(400, 'O campo senha é obrigatório.');
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  if (!passwordRegex.test(data.password)) {
    throw new HttpException(
      400,
      'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caractere especial.',
    );
  }
}

export function validateUpdateUserDto(data: Partial<CreateUserDto>): void {
  if (!data) {
    throw new HttpException(400, 'Dados inválidos.');
  }

  if (data.name && (typeof data.name !== 'string' || data.name.trim() === '')) {
    throw new HttpException(400, 'O campo nome é obrigatório.');
  }

  if (
    data.email &&
    (typeof data.email !== 'string' || !data.email.includes('@'))
  ) {
    throw new HttpException(400, 'O campo email é invalido.');
  }

  if (
    Object.hasOwnProperty.call(data, 'password') &&
    (typeof data.password !== 'string' || data.password.trim() === '')
  ) {
    throw new HttpException(
      400,
      'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caractere especial.',
    );
  }

  if (
    data.password &&
    data.password.trim() === '' &&
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      data.password,
    )
  ) {
    throw new HttpException(
      400,
      'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caractere especial.',
    );
  }
}
