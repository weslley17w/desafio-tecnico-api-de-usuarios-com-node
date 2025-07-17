import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { loginRateLimit } from '../../shared/middleware/rateLimit.middleware.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/', loginRateLimit, authController.login);

export { authRouter };
