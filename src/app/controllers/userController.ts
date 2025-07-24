import { Request, Response } from 'express';
import { UserService } from '../services/userService.js';

export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.userService.create(req.body);
    return res.status(201).json(user);
  };

  public findAll = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.userService.findAll();
    return res.status(200).json(user);
  };

  public findById = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    const user = await this.userService.findById({ id });
    return res.status(200).send(user);
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    await this.userService.delete({ id });
    return res.status(204).send();
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    const data = req.body;
    const updatedUser = await this.userService.update({ id }, data);
    return res.status(200).json(updatedUser);
  };
}
