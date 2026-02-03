import express from 'express';
import { handleErrorAsync } from '../utils/handleError.js';
import { getFeedbackList } from '../controllers/feedback.js';

const router = express.Router();

router.get('/', handleErrorAsync(getFeedbackList));

export default router;
