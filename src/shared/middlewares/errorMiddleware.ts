/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../erros/HttpExeption.js';

export const errorMiddlewares = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpException) {
    return res.status(error.status).json({ message: error.message, error: error.erros });
  }
  return res.status(500).json({ message: 'Internal Server Error' });
};
