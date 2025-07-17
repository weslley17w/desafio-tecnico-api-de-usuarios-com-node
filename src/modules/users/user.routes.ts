import { Router } from 'express';
import { UserController } from './user.controller.js';
import { authMiddleware } from '../../shared/middleware/auth.middleware.js';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/', authMiddleware, userController.createUser);
userRoutes.get('/', authMiddleware, userController.getAllUsers);
userRoutes.get('/:id', authMiddleware, userController.getUserById);
userRoutes.put('/:id', authMiddleware, userController.updateUser);
userRoutes.delete('/:id', authMiddleware, userController.deleteUser);

export { userRoutes };
