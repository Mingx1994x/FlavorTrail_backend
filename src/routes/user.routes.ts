import express from 'express';

import { getUserById, updateUserProfile } from '../controllers/user.js';
import { handleErrorAsync } from '../utils/handleError.js';
import { isUser } from '../middlewares/isUser.js';
import { updateUserProfileValidator } from '../validators/user.validator.js';

const router = express.Router();

// 取得使用者資料
router.get('/:id', isUser, handleErrorAsync(getUserById));

// 更新使用者資料
router.patch(
  '/profile',
  isUser,
  updateUserProfileValidator,
  handleErrorAsync(updateUserProfile),
);

export default router;
