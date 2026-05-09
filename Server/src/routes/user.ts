import express from 'express';
import {
  getUserDashboard,
  getOrganizerDashboard,
  getOrganizerParticipants,
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getUserDashboard);
router.get('/organizer/dashboard', authorize('organizer', 'admin'), getOrganizerDashboard);
router.get('/organizer/participants', authorize('organizer', 'admin'), getOrganizerParticipants);

export default router;
