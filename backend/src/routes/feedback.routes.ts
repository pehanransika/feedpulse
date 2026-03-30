import { Router } from 'express';
import {
  submitFeedback, getAllFeedback,
  getFeedbackById, updateFeedbackStatus, deleteFeedback
} from '../controllers/feedback.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post  ('/',     submitFeedback);           // public
router.get   ('/',     protect, getAllFeedback);   // admin
router.get   ('/:id',  protect, getFeedbackById);  // admin
router.patch ('/:id',  protect, updateFeedbackStatus); // admin
router.delete('/:id',  protect, deleteFeedback);  // admin

export default router;