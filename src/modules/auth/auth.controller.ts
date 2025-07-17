import { HttpException } from '../../shared/erros/HttpExeption.js';
import { validateLoginDto } from './auth.validator.js';
import { AuthService } from './auth.service.js';
import { Request, Response } from 'express';

export class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      validateLoginDto(req.body);
      const { email, password } = req.body;
      const authService = new AuthService();
      const token = await authService.login(email, password);

      return res.status(200).json({ token });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
