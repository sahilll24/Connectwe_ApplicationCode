import express from 'express';
import {
  getDashboardStats,
  getUsers,
  getOrganizers,
  suspendUser,
  activateUser,
  deleteUser,
  getReports,
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/organizers', getOrganizers);
router.get('/reports', getReports);

router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/activate', activateUser);
router.delete('/users/:id', deleteUser);

export default router;
