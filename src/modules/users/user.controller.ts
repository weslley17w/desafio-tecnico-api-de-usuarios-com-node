import { Request, Response } from 'express';
import { validateCreateUserDto } from './users.validator.js';
import { HttpException } from '../../shared/erros/HttpExeption.js';
import { UserService } from './user.service.js';

export class UserController {
  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      validateCreateUserDto(req.body);
      const data = await userService.createUser(req.body);

      return res.status(201).json(data);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
