import { getUserRows } from '../service/usersSheet.js';

import type { Request, Response, NextFunction } from 'express';

// 取得使用者列表
export const getUserList = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const resData = await getUserRows();
  res.status(200).json({
    status: 'success',
    data: resData,
  });
};
