import express from 'express';
import { generalRateLimit } from './shared/middleware/rateLimit.middleware.js';
import { userRoutes } from './modules/users/user.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';

const app = express();

app.use(express.json());
app.use(generalRateLimit);
app.use('/users', userRoutes);
app.use('/auth', authRouter);

export default app;
