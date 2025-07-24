import express from 'express';
import { userRoutes } from './routes/userRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { errorMiddlewares } from './shared/middlewares/errorMiddleware.js';
const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use(errorMiddlewares);

export default app;
