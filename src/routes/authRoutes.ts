import { Router } from 'express';
import { authController } from '../container.js';

const authRoutes = Router();

authRoutes.post('/', authController.auth);
authRoutes.post('/refresh-token', authController.refresh);

export { authRoutes };
