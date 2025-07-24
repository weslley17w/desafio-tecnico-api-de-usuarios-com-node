import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';

export class AuthController {
  private readonly authService: AuthService;

  constructor(userService: AuthService) {
    this.authService = userService;
  }

  public auth = async (req: Request, res: Response): Promise<Response> => {
    const token = await this.authService.create(req.body);
    return res.status(200).json(token);
  };

  public refresh = async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.body;
    const data = await this.authService.refreshToken(token);
    return res.status(200).json(data);
  };
}
