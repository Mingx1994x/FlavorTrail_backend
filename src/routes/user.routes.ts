import express from 'express';

import {
  getUserById,
  updateUserPassword,
  updateUserProfile,
} from '../controllers/user.js';
import { handleErrorAsync } from '../utils/handleError.js';
import { isUser } from '../middlewares/isUser.js';
import {
  updateUserPasswordValidator,
  updateUserProfileValidator,
} from '../validators/user.validator.js';
import { handleValidation } from '../middlewares/validateMiddleware.js';

const router = express.Router();

// 取得使用者資料
router.get('/profile', isUser, handleErrorAsync(getUserById));

// 更新使用者資料
router.patch(
  '/profile',
  isUser,
  updateUserProfileValidator,
  handleValidation,
  handleErrorAsync(updateUserProfile),
);

// 更新使用者密碼
router.patch(
  '/password',
  isUser,
  updateUserPasswordValidator,
  handleValidation,
  handleErrorAsync(updateUserPassword),
);

export default router;
