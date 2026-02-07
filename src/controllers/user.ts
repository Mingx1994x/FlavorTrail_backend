import { getUserRows } from '../service/usersSheet.js';

import type { Request, Response, NextFunction } from 'express';
import type { TUser } from '../types/users.js';
import { appError } from '../utils/handleError.js';

// 取得使用者資料
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const resData = await getUserRows();
  const userData = resData.find((data) => data.id === id);

  if (!userData) {
    return next(new appError(401, '使用者不存在'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      email: userData.email,
      name: userData?.name,
      nickname: userData.nickname,
      phone: userData?.phone,
      avatarUr: userData?.avatarUrl,
      liveCity: userData?.liveCity,
      liveDistrict: userData?.liveDistrict,
      introduce: userData?.introduce,
    },
  });
};
