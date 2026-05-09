import { Request, Response } from 'express';
import Event from '../models/Event';
import Registration from '../models/Registration';
import User from '../models/User';
import { mockDb } from '../mockDb';

const useMockDb = () => process.env.USE_MOCK_DB === 'true';

// @desc    Get user dashboard stats
// @route   GET /api/user/dashboard
// @access  Private
export const getUserDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    // Get upcoming events count
    const upcomingEvents = await Registration.countDocuments({
      user: userId,
      status: 'registered',
    });

    // Get events attended count
    const eventsAttended = await Registration.countDocuments({
      user: userId,
      status: 'attended',
    });

    // Get unique categories the user has registered for (simulating communities)
    const userRegistrations = await Registration.find({ user: userId }).populate('event');
    const uniqueCategories = new Set(userRegistrations.map((reg: any) => reg.event?.category).filter(Boolean));
    const communities = uniqueCategories.size || Math.floor(Math.random() * 5) + 1;

    // Get connections (simulated based on event registrations)
    const connections = userRegistrations.length * 3 + Math.floor(Math.random() * 20);

    // Get recommended events (events not registered for)
    const registeredEventIds = userRegistrations.map((reg: any) => reg.event?._id.toString());
    const recommendedEvents = await Event.find({
      _id: { $nin: registeredEventIds },
      status: 'approved',
      date: { $gte: new Date() },
    })
      .populate('organizer', 'name avatar')
      .limit(3);

    // Get nearby events (simulated - in real app would use geolocation)
    const nearbyEvents = await Event.find({
      _id: { $nin: registeredEventIds },
      status: 'approved',
      date: { $gte: new Date() },
    })
      .populate('organizer', 'name avatar')
      .skip(3)
      .limit(6);

    res.json({
      success: true,
      stats: {
        upcomingEvents,
        eventsAttended,
        communities,
        connections,
      },
      recommendedEvents,
      nearbyEvents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get organizer dashboard stats
// @route   GET /api/user/organizer/dashboard
// @access  Private (Organizer)
export const getOrganizerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizerId = (req as any).user.id;

    if (useMockDb()) {
      // Get organizer's events
      const organizerEvents = mockDb.events.filter(e => e.organizer === organizerId);
      const totalEvents = organizerEvents.length;

      // Events this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const eventsThisMonth = organizerEvents.filter(e => new Date(e.createdAt) >= startOfMonth).length;

      // Get total registrations
      const eventIds = organizerEvents.map(e => e._id);
      const registrations = mockDb.registrations.filter(
        r => eventIds.includes(r.event) && (r.status === 'registered' || r.status === 'attended')
      );
      const totalRegistrations = registrations.length;

      // Registrations this month
      const registrationsThisMonth = registrations.filter(
        r => new Date(r.registeredAt) >= startOfMonth
      ).length;

      // Calculate average attendance
      const totalAttendees = organizerEvents.reduce((sum, event) => sum + event.attendees, 0);
      const avgAttendance = totalEvents > 0 ? Math.min(Math.round((totalAttendees / (totalEvents * 10)) * 100), 100) : 0;

      // Monthly registration trends
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const monthlyRegistrations = months.map((month, i) => ({
        _id: month,
        registrations: Math.floor(Math.random() * 50) + 10 + i * 5,
      }));

      // Recent events with organizer info
      const recentEvents = organizerEvents
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .map(e => {
          const organizer = mockDb.users.find(u => u._id === e.organizer);
          return { ...e, organizer: organizer ? { name: organizer.name, avatar: organizer.avatar } : undefined };
        });

      res.json({
        success: true,
        stats: {
          totalEvents,
          eventsThisMonth,
          totalRegistrations,
          registrationsThisMonth,
          avgAttendance,
        },
        monthlyRegistrations,
        recentEvents,
      });
      return;
    }

    // Get total events
    const totalEvents = await Event.countDocuments({ organizer: organizerId });

    // Get events created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const eventsThisMonth = await Event.countDocuments({
      organizer: organizerId,
      createdAt: { $gte: startOfMonth },
    });

    // Get total registrations for organizer's events
    const organizerEvents = await Event.find({ organizer: organizerId });
    const eventIds = organizerEvents.map((event) => event._id);
    const totalRegistrations = await Registration.countDocuments({
      event: { $in: eventIds },
      status: { $in: ['registered', 'attended'] },
    });

    // Get registrations this month
    const registrationsThisMonth = await Registration.countDocuments({
      event: { $in: eventIds },
      registeredAt: { $gte: startOfMonth },
      status: { $in: ['registered', 'attended'] },
    });

    // Calculate average attendance
    const totalAttendees = organizerEvents.reduce((sum, event) => sum + event.attendees, 0);
    const avgAttendance = totalEvents > 0 ? Math.round((totalAttendees / (totalEvents * 10)) * 100) : 0;

    // Get monthly registration trends
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRegistrations = await Registration.aggregate([
      {
        $match: {
          event: { $in: eventIds },
          registeredAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%b', date: '$registeredAt' } },
          registrations: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get recent events
    const recentEvents = await Event.find({ organizer: organizerId })
      .populate('organizer', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      success: true,
      stats: {
        totalEvents,
        eventsThisMonth,
        totalRegistrations,
        registrationsThisMonth,
        avgAttendance,
      },
      monthlyRegistrations,
      recentEvents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all participants for organizer
// @route   GET /api/user/organizer/participants
// @access  Private (Organizer)
export const getOrganizerParticipants = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizerId = (req as any).user.id;

    if (useMockDb()) {
      // Get all events by this organizer
      const events = mockDb.events.filter(e => e.organizer === organizerId);
      const eventIds = events.map(e => e._id);

      // Get all registrations for these events
      const registrations = mockDb.registrations.filter(
        r => eventIds.includes(r.event) && (r.status === 'registered' || r.status === 'attended')
      );

      const participants = registrations.map(reg => {
        const user = mockDb.users.find(u => u._id === reg.user);
        const event = mockDb.events.find(e => e._id === reg.event);
        return {
          _id: reg._id,
          name: user?.name || 'Unknown',
          email: user?.email || '',
          avatar: user?.avatar,
          event: event?.title || 'Unknown Event',
          date: reg.registeredAt,
          status: reg.status,
        };
      });

      res.json({ success: true, count: participants.length, participants });
      return;
    }

    // Get all events by this organizer
    const events = await Event.find({ organizer: organizerId });
    const eventIds = events.map((event) => event._id);

    // Get all registrations for these events
    const registrations = await Registration.find({
      event: { $in: eventIds },
      status: { $in: ['registered', 'attended'] },
    })
      .populate('user', 'name email avatar')
      .populate('event', 'title');

    const participants = registrations.map((reg: any) => ({
      name: reg.user?.name,
      email: reg.user?.email,
      event: reg.event?.title,
      date: reg.registeredAt,
      status: reg.status,
    }));

    res.json({ success: true, count: participants.length, participants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
