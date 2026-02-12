import bcrypt from 'bcryptjs';
import { appError } from '../utils/handleError.js';
import { generateJwt, verifyJwt } from '../utils/handleJWTAuth.js';
import {
  createUser,
  findExistUserById,
  findExistUserByMail,
} from '../service/usersSheet.js';
import { hashPassword, verifyPassword } from '../utils/handlePasswordUtils.js';

import type { Request, Response, NextFunction } from 'express';
import type { TCreateUserData } from '../types/users.js';

// 使用者登入功能 API
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  // 資料庫查找用戶是否存在
  const findUser = await findExistUserByMail(email);
  if (!findUser) {
    return next(new appError(400, '使用者不存在或密碼輸入錯誤'));
  }

  if (!findUser.passwordHash) {
    return next(new appError(400, '此帳號無法使用密碼登入'));
  }

  const isMatch = await verifyPassword(password, findUser.passwordHash);
  if (!isMatch) {
    return next(new appError(400, '使用者不存在或密碼輸入錯誤'));
  }

  //JWT
  const token = generateJwt({
    id: findUser.id,
    role: findUser.role,
  });

  res.status(200).json({
    status: 'success',
    data: {
      token,
      user: {
        nickname: findUser.nickname,
        role: findUser.role,
      },
    },
  });
};

// 驗證使用者登入狀態功能 API
export const checkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Authorization: Bearer xxxxxxx.yyyyyyy.zzzzzzz
  // 確認 token 是否存在並取出 token
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

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: currentUser.id,
        nickname: currentUser.nickname,
      },
    },
  });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password, nickname } = req.body;
  const passwordHash = await hashPassword(password);
  const userData: TCreateUserData = {
    email,
    nickname,
    passwordHash,
  };

  await createUser(userData);

  res.status(201).json({
    status: 'success',
    message: '用戶註冊成功',
    data: {
      user: {
        nickname: userData.nickname,
      },
    },
  });
};
