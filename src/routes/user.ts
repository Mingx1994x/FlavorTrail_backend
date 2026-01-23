import express from 'express';

import { getUserList } from '../controllers/user.js';
import { handleErrorAsync } from '../utils/handleError.js';
import { isUser } from '../middlewares/isUser.js';

const router = express.Router();

/* GET users listing. 測試用(待調整) */
router.get('/user-list', isUser, handleErrorAsync(getUserList));

export default router;
