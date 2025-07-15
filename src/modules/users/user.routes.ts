import { Router } from 'express';
import { UserController } from './user.controller.js';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/', userController.createUser);

export { userRoutes };
