import { NextFunction, Request, Response } from 'express';

interface IRequest extends Request {
  userId: string;
}

import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers['authorization'];

    if (!authorization) return res.status(401).json({ message: 'Token inválido.' });

    const [, token] = authorization.split(' ');
    const decodedToken = jwt.verify(token, env.AUTH_CONFIG_SECRET) as { id: string };
    (req as IRequest).userId = decodedToken.id;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};
