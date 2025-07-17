import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  const authorization = req.headers['authorization'];

  if (!process.env.AUTH_CONFIG_SECRET) {
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }

  if (!authorization || typeof authorization !== 'string') {
    console.error('Token não fornecido.');
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const tokenParts = authorization.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  const [bearer, token] = tokenParts;

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  try {
    jwt.verify(token, process.env.AUTH_CONFIG_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}
