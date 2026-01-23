import type { Request, Response, NextFunction } from 'express';
import { appError, handleErrorAsync } from '../utils/handleError.js';
import { verifyJwt } from '../utils/handleJWTAuth.js';
import { findExistUserById } from '../service/usersSheet.js';

export const isUser = handleErrorAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer')) {
      return next(new appError(401, '你尚未登入'));
    }

    // 驗證 token
    const token = authorization.split(' ')[1];

    if (!token) {
      return next(new appError(401, '無效的 token'));
    }

    const decoded = await verifyJwt(token);

    // 在資料庫尋找對應 id 的使用者
    const currentUser = await findExistUserById(decoded.id);

    if (!currentUser) {
      return next(new appError(401, '無效的 token'));
    }

    // 在 req 物件加入 user 欄位
    req.user = currentUser;

    next();
  },
);
