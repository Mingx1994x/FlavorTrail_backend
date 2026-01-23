import type { Request, Response, NextFunction } from 'express';

export class appError extends Error {
  status: number;
  isOperational: boolean;
  constructor(statusCode: number, message: string) {
    super(message);
    this.status = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

type TErrorAsyncFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
export const handleErrorAsync = (func: TErrorAsyncFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((error) => {
      next(error);
    });
  };
};
