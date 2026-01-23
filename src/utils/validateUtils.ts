import { body } from 'express-validator';
import type { ValidationChain } from 'express-validator';

export const requiredValidator = (
  field: string,
  label: string,
): ValidationChain => {
  return body(field).trim().notEmpty().withMessage(`${label}必填`);
};
