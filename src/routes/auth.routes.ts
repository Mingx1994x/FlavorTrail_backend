import express from 'express';

import { handleErrorAsync } from '../utils/handleError.js';
import {
  loginValidator,
  signupValidator,
} from '../validators/user.validator.js';
import { handleValidation } from '../middlewares/validateMiddleware.js';
import { login, checkout, signup } from '../controllers/auth.js';

const router = express.Router();

// 登入
router.post(
  '/login',
  loginValidator,
  handleValidation,
  handleErrorAsync(login),
);

// 登入驗證
router.get('/check', handleErrorAsync(checkout));

// 註冊
router.post(
  '/signup',
  signupValidator,
  handleValidation,
  handleErrorAsync(signup),
);

export default router;
