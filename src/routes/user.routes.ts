import express from 'express';

import { getUserById } from '../controllers/user.js';
import { handleErrorAsync } from '../utils/handleError.js';
import { isUser } from '../middlewares/isUser.js';

const router = express.Router();

// 取得使用者資料
router.get('/:id', isUser, handleErrorAsync(getUserById));

export default router;
