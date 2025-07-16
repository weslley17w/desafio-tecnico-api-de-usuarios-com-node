import { Request, Response } from 'express';
import {
  validateCreateUserDto,
  validateUpdateUserDto,
} from './users.validator.js';
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

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await userService.getAllUsers(page, limit);
      return res.status(200).json(users);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      const userId = req.params.id;

      const user = await userService.getUserById(userId);

      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      validateUpdateUserDto(updatedData);
      const userService = new UserService();
      const updatedUser = await userService.updateUser(userId, updatedData);

      return res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
