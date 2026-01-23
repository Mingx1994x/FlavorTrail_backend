import jwt from 'jsonwebtoken';
import { configManager } from '../config/index.js';
import { appError } from './handleError.js';

import type { SignOptions } from 'jsonwebtoken';
import type { TUserJWTPayload } from '../types/users.js';

const JWT_EXPIRES_IN = configManager.jwt.expiresDay;
const JWT_SECRET = configManager.jwt.secret;

export const generateJwt = (payload: TUserJWTPayload) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);

export const verifyJwt = (token: string): TUserJWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'id' in decoded &&
      'role' in decoded &&
      typeof decoded.id === 'string' &&
      (decoded.role === 'USER' || decoded.role === 'ADMIN')
    ) {
      return decoded as TUserJWTPayload;
    }

    throw new appError(401, 'Token payload 格式錯誤');
  } catch (error) {
    if (error instanceof Error) {
      switch (error.name) {
        case 'TokenExpiredError':
          throw new appError(401, 'Token 已過期');
        case 'JsonWebTokenError':
          throw new appError(401, '無效的 token');
        default:
          throw error;
      }
    }
    throw new appError(401, 'Token 驗證失敗');
  }
};
