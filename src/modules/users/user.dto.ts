import { User } from '../../shared/database.js';

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
};

export type paginatedUsers = {
  page: number;
  limit: number;
  total: number;
  data: User[];
};

export type UpdateUserDto = {
  name?: string;
  email?: string;
  password?: string;
};
