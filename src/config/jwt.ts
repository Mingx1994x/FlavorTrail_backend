import { requireEnv } from '../utils/handleEnv.js';

const jwtSecret = requireEnv('JWT_SECRET');

export const jwt = {
  secret: jwtSecret,
  expiresDay: process.env.JWT_EXPIRES_DAY || '7d',
} as const;
