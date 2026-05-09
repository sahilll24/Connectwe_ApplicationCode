import { Request, Response } from 'express';
import User from '../models/User';
import Event from '../models/Event';
import Registration from '../models/Registration';
import { mockDb } from '../mockDb';

const useMockDb = () => process.env.USE_MOCK_DB === 'true';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalEvents = await Event.countDocuments();
    const pendingApprovals = await Event.countDocuments({ status: 'pending' });
    const totalRegistrations = await Registration.countDocuments({ status: { $in: ['registered', 'attended'] } });

    // Get monthly growth data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyUsers = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyEvents = await Event.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get events by category
    const eventsByCategory = await Event.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrganizers,
        totalEvents,
        pendingApprovals,
        totalRegistrations,
      },
      monthlyGrowth: {
        users: monthlyUsers,
        events: monthlyEvents,
      },
      eventsByCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      const users = mockDb.users
        .filter(u => u.role === 'user')
        .map(u => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar,
          status: u.status,
          joinDate: u.joinDate,
          createdAt: u.createdAt,
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ success: true, count: users.length, users });
      return;
    }

    const users = await User.find({ role: { $in: ['user', 'organizer'] } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all organizers
// @route   GET /api/admin/organizers
// @access  Private (Admin)
export const getOrganizers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      const organizers = mockDb.users
        .filter(u => u.role === 'organizer')
        .map(u => {
          const eventCount = mockDb.events.filter(e => e.organizer === u._id).length;
          return {
            _id: u._id,
            name: u.name,
            email: u.email,
            avatar: u.avatar,
            status: u.status,
            joinDate: u.joinDate,
            eventCount,
          };
        })
        .sort((a, b) => (b.eventCount || 0) - (a.eventCount || 0));
      res.json({ success: true, count: organizers.length, organizers });
      return;
    }

    const organizers = await User.aggregate([
      { $match: { role: 'organizer' } },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'organizer',
          as: 'events',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          avatar: 1,
          status: 1,
          joinDate: 1,
          eventCount: { $size: '$events' },
        },
      },
    ]);

    res.json({ success: true, count: organizers.length, organizers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Suspend user
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin)
export const suspendUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      const user = await mockDb.updateUser(req.params.id, { status: 'suspended' });
      
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status } });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'suspended' },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Activate user
// @route   PUT /api/admin/users/:id/activate
// @access  Private (Admin)
export const activateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      const user = await mockDb.updateUser(req.params.id, { status: 'active' });
      
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status } });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      const user = await mockDb.findUserById(req.params.id);

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      // Delete user's events
      mockDb.events = mockDb.events.filter(e => e.organizer !== req.params.id);
      
      // Delete user's registrations
      mockDb.registrations = mockDb.registrations.filter(r => r.user !== req.params.id);
      
      // Delete user
      mockDb.users = mockDb.users.filter(u => u._id !== req.params.id);

      res.json({ success: true, message: 'User deleted successfully' });
      return;
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Delete user's events
    await Event.deleteMany({ organizer: req.params.id });
    
    // Delete user's registrations
    await Registration.deleteMany({ user: req.params.id });
    
    // Delete user
    await user.deleteOne();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get reports and analytics
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useMockDb()) {
      // Generate monthly data for the last 5 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const userEngagement = months.map((month, i) => ({
        _id: month,
        new: Math.floor(Math.random() * 200) + 50 + i * 30,
      }));

      const activeUsers = months.map((month, i) => ({
        _id: month,
        count: Math.floor(Math.random() * 500) + 300 + i * 100,
      }));

      // Get popular events from mockDb
      const eventRegistrations: { [key: string]: number } = {};
      mockDb.registrations.forEach(r => {
        if (r.status === 'registered' || r.status === 'attended') {
          eventRegistrations[r.event] = (eventRegistrations[r.event] || 0) + 1;
        }
      });

      const popularEvents = Object.entries(eventRegistrations)
        .map(([eventId, count]) => {
          const event = mockDb.events.find(e => e._id === eventId);
          return { name: event?.title || 'Unknown', registrations: count };
        })
        .sort((a, b) => b.registrations - a.registrations)
        .slice(0, 5);

      // If no events with registrations, add some sample data
      if (popularEvents.length === 0) {
        mockDb.events.slice(0, 5).forEach((e, i) => {
          popularEvents.push({ name: e.title, registrations: Math.floor(Math.random() * 100) + 50 });
        });
      }

      // Calculate stats
      const totalUsers = mockDb.users.filter(u => u.role === 'user').length;
      const totalEvents = mockDb.events.filter(e => e.status === 'approved').length;
      const pageViews = Math.floor(Math.random() * 50000) + 40000;
      const engagementRate = Math.floor(Math.random() * 20) + 60;

      res.json({
        success: true,
        reports: {
          userEngagement,
          activeUsers,
          popularEvents,
          pageViews,
          engagementRate,
          monthlyActiveUsers: Math.floor(totalUsers * 0.8),
          eventsThisMonth: totalEvents,
        },
      });
      return;
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // User engagement data
    const userEngagement = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%b', date: '$createdAt' } },
          new: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate active users per month (simplified)
    const activeUsers = await Registration.aggregate([
      { $match: { registeredAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%b', date: '$registeredAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Most popular events
    const popularEvents = await Registration.aggregate([
      { $match: { status: { $in: ['registered', 'attended'] } } },
      {
        $group: {
          _id: '$event',
          registrations: { $sum: 1 },
        },
      },
      { $sort: { registrations: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: '$event' },
      {
        $project: {
          name: '$event.title',
          registrations: 1,
          _id: 0,
        },
      },
    ]);

    // Page views simulation (in real app, this would come from analytics)
    const pageViews = Math.floor(Math.random() * 50000) + 40000;
    const engagementRate = Math.floor(Math.random() * 20) + 60;

    // Get additional stats
    const monthlyActiveUsers = await User.countDocuments({ 
      role: 'user', 
      createdAt: { $gte: sixMonthsAgo } 
    });
    const eventsThisMonth = await Event.countDocuments({ 
      createdAt: { $gte: sixMonthsAgo } 
    });

    res.json({
      success: true,
      reports: {
        userEngagement,
        activeUsers,
        popularEvents,
        pageViews,
        engagementRate,
        monthlyActiveUsers,
        eventsThisMonth,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
