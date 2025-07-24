import { Router } from 'express';
import { userController } from '../container.js';

const userRoutes = Router();

userRoutes.post('/', userController.create);
userRoutes.get('/', userController.findAll);
userRoutes.get('/:id', userController.findById);
userRoutes.delete('/:id', userController.delete);
userRoutes.put('/:id', userController.update);

export { userRoutes };
