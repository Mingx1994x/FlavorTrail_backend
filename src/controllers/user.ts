import {
  findUserRowById,
  updateUserPasswordRow,
  updateUserProfileRow,
} from '../service/usersSheet.js';

import type { Request, Response, NextFunction } from 'express';
import type { TUser, TUserUpdatePayload } from '../types/users.js';
import { appError } from '../utils/handleError.js';
import { hashPassword, verifyPassword } from '../utils/handlePasswordUtils.js';

// 取得使用者資料
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.user;
  const userData = await findUserRowById(id);

  if (!userData) {
    return next(new appError(404, '使用者不存在'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      email: userData.item.email,
      name: userData.item?.name,
      nickname: userData.item.nickname,
      phone: userData.item?.phone,
      avatarUr: userData.item?.avatarUrl,
      liveCity: userData.item?.liveCity,
      liveDistrict: userData.item?.liveDistrict,
      introduce: userData.item?.introduce,
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

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 過濾 request payload
  const payload: TUserUpdatePayload = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      payload[key] = req.body[key] === '' ? null : req.body[key];
    }
  }

  const { id } = req.user;
  const userRow = await findUserRowById(id);

  if (!userRow) {
    return next(new appError(404, '使用者不存在'));
  }

  await updateUserProfileRow(userRow, payload);

  res.status(200).json({
    status: 'success',
    message: '使用者資料更新成功',
  });
};

export const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.user;
  const userRow = await findUserRowById(id);

  if (!userRow) {
    return next(new appError(404, '使用者不存在'));
  }

  const { originPassword, password } = req.body;
  if (!userRow.item.passwordHash) {
    return next(new appError(400, '此帳號無法使用密碼變更功能'));
  }

  const isMatch = await verifyPassword(
    originPassword,
    userRow.item.passwordHash,
  );

  if (!isMatch) {
    return next(new appError(400, '使用者密碼輸入有誤'));
  }

  const isSamePassword = await verifyPassword(
    password,
    userRow.item.passwordHash,
  );

  if (isSamePassword) {
    return next(new appError(400, '新密碼不可與舊密碼相同'));
  }

  const newPasswordHash = await hashPassword(password);
  await updateUserPasswordRow(userRow, newPasswordHash);

  res.status(200).json({
    status: 'success',
    message: '使用者密碼更新成功',
  });
};
