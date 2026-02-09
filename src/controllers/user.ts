import { getUserRows, updateUserProfileRow } from '../service/usersSheet.js';

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

// 更新使用者資料
const allowedFields = [
  'nickname',
  'name',
  'phone',
  'liveCity',
  'liveDistrict',
  'introduce',
] as const;

type TUserUpdateUserProfileField = Partial<
  Pick<TUser, (typeof allowedFields)[number]>
>;

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload: TUserUpdateUserProfileField = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      payload[key] = req.body[key] === '' ? null : req.body[key];
    }
  }

  const { id } = req.user;
  await updateUserProfileRow(id, payload);

  res.status(201).json({
    status: 'success',
    message: '使用者資料更新成功',
  });
};
