import type { UUIDTypes } from 'uuid';
import type { TUser } from './user';

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
      auth?: {
        userId: UUIDTypes;
      };
    }
  }
}

export {};
