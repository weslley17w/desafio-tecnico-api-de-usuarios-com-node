import { User } from '../../shared/database.js';

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
};

export type UserResponseDto = Omit<User, 'password'>;

export type paginatedUsers = {
  page: number;
  limit: number;
  total: number;
  data: UserResponseDto[];
};

export type UpdateUserDto = {
  name?: string;
  email?: string;
  password?: string;
};
