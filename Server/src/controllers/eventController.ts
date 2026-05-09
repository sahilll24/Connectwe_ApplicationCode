import { Request, Response } from 'express';
import Event from '../models/Event';
import Registration from '../models/Registration';
import User from '../models/User';
import { mockDb } from '../mockDb';

const useMockDb = () => process.env.USE_MOCK_DB === 'true';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, status = 'approved' } = req.query;
    
    if (useMockDb()) {
      let events = await mockDb.findAllEvents({ status: status as string });
      
      if (category && category !== 'All') {
        events = events.filter(e => e.category === category);
      }
      
      // Add organizer info
      const eventsWithOrganizer = events.map(e => {
        const organizer = mockDb.users.find(u => u._id === e.organizer);
        return { ...e, organizer: organizer ? { name: organizer.name, avatar: organizer.avatar } : undefined };
      });
      
      res.json({ success: true, count: eventsWithOrganizer.length, events: eventsWithOrganizer });
      return;
    }
    
    let query: any = { status };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search as string };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name avatar')
      .sort({ date: 1 });

    res.json({ success: true, count: events.length, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
export const getFeaturedEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      let events = mockDb.events.filter(e => e.isFeatured && e.status === 'approved');
      
      // Add organizer info
      const eventsWithOrganizer = events.map(e => {
        const organizer = mockDb.users.find(u => u._id === e.organizer);
        return { ...e, organizer: organizer ? { name: organizer.name, avatar: organizer.avatar } : undefined };
      });
      
      res.json({ success: true, events: eventsWithOrganizer });
      return;
    }
    
    const events = await Event.find({ isFeatured: true, status: 'approved' })
      .populate('organizer', 'name avatar')
      .limit(6);

    res.json({ success: true, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      const event = await mockDb.findEventById(req.params.id);
      
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return;
      }
      
      const organizer = mockDb.users.find(u => u._id === event.organizer);
      const eventWithOrganizer = { ...event, organizer: organizer ? { name: organizer.name, avatar: organizer.avatar } : undefined };
      
      res.json({ success: true, event: eventWithOrganizer });
      return;
    }
    
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name avatar');

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    res.json({ success: true, event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, date, time, location, maxAttendees, image } = req.body;
    
    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      maxAttendees,
      image,
      organizer: (req as any).user.id,
      status: (req as any).user.role === 'admin' ? 'approved' : 'pending',
    });

    await event.populate('organizer', 'name avatar');

    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin)
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    // Check if user is organizer of this event or admin
    if (event.organizer.toString() !== (req as any).user.id && (req as any).user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to update this event' });
      return;
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('organizer', 'name avatar');

    res.json({ success: true, event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    // Check if user is organizer of this event or admin
    if (event.organizer.toString() !== (req as any).user.id && (req as any).user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
      return;
    }

    await event.deleteOne();
    await Registration.deleteMany({ event: req.params.id });

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Approve event
// @route   PUT /api/events/:id/approve
// @access  Private (Admin)
export const approveEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      const event = await mockDb.updateEvent(req.params.id, { status: 'approved' });
      
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return;
      }

      const organizer = mockDb.users.find(u => u._id === event.organizer);
      res.json({ 
        success: true, 
        event: { ...event, organizer: organizer ? { name: organizer.name, avatar: organizer.avatar } : undefined }
      });
      return;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('organizer', 'name avatar');

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    res.json({ success: true, event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Reject event
// @route   PUT /api/events/:id/reject
// @access  Private (Admin)
export const rejectEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      const event = await mockDb.updateEvent(req.params.id, { status: 'rejected' });
      
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found' });
        return;
      }

      const organizer = mockDb.users.find(u => u._id === event.organizer);
      res.json({ 
        success: true, 
        event: { ...event, organizer: organizer ? { name: organizer.name, avatar: organizer.avatar } : undefined }
      });
      return;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('organizer', 'name avatar');

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    res.json({ success: true, event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get pending events
// @route   GET /api/events/pending/list
// @access  Private (Admin)
export const getPendingEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      const events = mockDb.events
        .filter(e => e.status === 'pending')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Add organizer info
      const eventsWithOrganizer = events.map(e => {
        const organizer = mockDb.users.find(u => u._id === e.organizer);
        return { 
          ...e, 
          organizer: organizer ? { name: organizer.name, avatar: organizer.avatar, email: organizer.email } : undefined 
        };
      });
      
      res.json({ success: true, count: eventsWithOrganizer.length, events: eventsWithOrganizer });
      return;
    }

    const events = await Event.find({ status: 'pending' })
      .populate('organizer', 'name avatar email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: events.length, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    if (event.status !== 'approved') {
      res.status(400).json({ success: false, message: 'Event is not open for registration' });
      return;
    }

    if (event.attendees >= event.maxAttendees) {
      res.status(400).json({ success: false, message: 'Event is full' });
      return;
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: (req as any).user.id,
      event: req.params.id,
    });

    if (existingRegistration) {
      res.status(400).json({ success: false, message: 'Already registered for this event' });
      return;
    }

    const registration = await Registration.create({
      user: (req as any).user.id,
      event: req.params.id,
    });

    // Update event attendees count
    event.attendees += 1;
    await event.save();

    await registration.populate('event');
    await registration.populate('user', 'name email avatar');

    res.status(201).json({ success: true, registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/events/:id/register
// @access  Private
export const cancelRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const registration = await Registration.findOne({
      user: (req as any).user.id,
      event: req.params.id,
    });

    if (!registration) {
      res.status(404).json({ success: false, message: 'Registration not found' });
      return;
    }

    registration.status = 'cancelled';
    await registration.save();

    // Update event attendees count
    const event = await Event.findById(req.params.id);
    if (event && event.attendees > 0) {
      event.attendees -= 1;
      await event.save();
    }

    res.json({ success: true, message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get my events (for users)
// @route   GET /api/events/my/events
// @access  Private
export const getMyEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const registrations = await Registration.find({
      user: (req as any).user.id,
      status: { $in: ['registered', 'attended'] },
    }).populate({
      path: 'event',
      populate: { path: 'organizer', select: 'name avatar' },
    });

    const events = registrations.map((reg) => reg.event);

    res.json({ success: true, count: events.length, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get organizer events
// @route   GET /api/events/organizer/events
// @access  Private (Organizer)
export const getOrganizerEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find({ organizer: (req as any).user.id })
      .populate('organizer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: events.length, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get event participants
// @route   GET /api/events/:id/participants
// @access  Private (Organizer/Admin)
export const getEventParticipants = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    // Check if user is organizer of this event or admin
    if (event.organizer.toString() !== (req as any).user.id && (req as any).user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to view participants' });
      return;
    }

    const registrations = await Registration.find({
      event: req.params.id,
      status: { $in: ['registered', 'attended'] },
    }).populate('user', 'name email avatar');

    const participants = registrations.map((reg) => ({
      ...reg.user,
      registeredAt: reg.registeredAt,
      status: reg.status,
    }));

    res.json({ success: true, count: participants.length, participants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get categories with counts
// @route   GET /api/events/categories/list
// @access  Public
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Event.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]);

    // Add icons based on category names
    const categoryIcons: { [key: string]: string } = {
      'Tech': '💻',
      'Music': '🎵',
      'Workshops': '🛠️',
      'Sports': '⚽',
      'Networking': '🤝',
      'Art': '🎨',
    };

    const categoriesWithIcons = categories.map((cat) => ({
      ...cat,
      icon: categoryIcons[cat.name] || '📌',
    }));

    res.json({ success: true, categories: categoriesWithIcons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
