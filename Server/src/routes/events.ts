import express from 'express';
import {
  getEvents,
  getFeaturedEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
  getPendingEvents,
  registerForEvent,
  cancelRegistration,
  getMyEvents,
  getOrganizerEvents,
  getEventParticipants,
  getCategories,
} from '../controllers/eventController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/categories/list', getCategories);
router.get('/featured', getFeaturedEvents);
router.get('/pending/list', protect, authorize('admin'), getPendingEvents);
router.get('/my/events', protect, getMyEvents);
router.get('/organizer/events', protect, authorize('organizer', 'admin'), getOrganizerEvents);

router.get('/', getEvents);
router.post('/', protect, authorize('organizer', 'admin'), createEvent);

router.get('/:id', getEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

router.put('/:id/approve', protect, authorize('admin'), approveEvent);
router.put('/:id/reject', protect, authorize('admin'), rejectEvent);

router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);

router.get('/:id/participants', protect, authorize('organizer', 'admin'), getEventParticipants);

export default router;
