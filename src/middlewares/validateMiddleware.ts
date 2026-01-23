import { validationResult } from 'express-validator';

import type { Request, Response, NextFunction } from 'express';
import { appError } from '../utils/handleError.js';

export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validateErrors = validationResult(req);

  if (!validateErrors.isEmpty()) {
    const errorMessages = validateErrors
      .array()
      .map((err) => err.msg)
      .join(', ');
    return next(new appError(400, `${errorMessages}`));
  }

  next();
};
