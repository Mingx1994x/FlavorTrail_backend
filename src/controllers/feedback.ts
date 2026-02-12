import type { Request, Response, NextFunction } from 'express';
import { getFeedbackRows } from '../service/feedbackSheet.js';

export const getFeedbackList = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const resData = await getFeedbackRows();
  res.status(200).json({
    status: 'success',
    data: resData,
  });
};
