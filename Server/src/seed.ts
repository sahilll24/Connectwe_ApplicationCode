import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Event from './models/Event';
import Registration from './models/Registration';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/connectwe');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@connectwe.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      status: 'active',
    });
    console.log('Admin user created');

    // Create organizer users
    const organizers = await User.create([
      {
        name: 'TechCommunity SF',
        email: 'tech@connectwe.com',
        password: 'organizer123',
        role: 'organizer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        status: 'active',
      },
      {
        name: 'NYC Music Collective',
        email: 'music@connectwe.com',
        password: 'organizer123',
        role: 'organizer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        status: 'active',
      },
      {
        name: 'Brooklyn Crafts',
        email: 'crafts@connectwe.com',
        password: 'organizer123',
        role: 'organizer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        status: 'active',
      },
    ]);
    console.log('Organizer users created');

    // Create regular users
    const users = await User.create([
      {
        name: 'Gauri Patel',
        email: 'gauri@connectwe.com',
        password: 'user123',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
        status: 'active',
      },
      {
        name: 'Sakshi Pendarkar',
        email: 'sakshi@connectwe.com',
        password: 'user123',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        status: 'active',
      },
      {
        name: 'Praneet Bhosle',
        email: 'praneet@connectwe.com',
        password: 'user123',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        status: 'active',
      },
    ]);
    console.log('Regular users created');

    // Create events
    const events = await Event.create([
      {
        title: 'React Summit 2026',
        description: 'Join us for a deep dive into the latest React patterns, performance techniques, and the future of web development. Network with fellow developers and learn from industry experts.',
        category: 'Tech',
        date: new Date('2026-03-25'),
        time: '10:00 AM',
        location: 'San Francisco, CA',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
        organizer: organizers[0]._id,
        attendees: 234,
        maxAttendees: 300,
        status: 'approved',
        isFeatured: true,
      },
      {
        title: 'Jazz in the Park',
        description: 'An evening of smooth jazz under the stars. Bring your blanket and enjoy performances from local and touring jazz musicians.',
        category: 'Music',
        date: new Date('2026-03-28'),
        time: '6:00 PM',
        location: 'Central Park, NYC',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
        organizer: organizers[1]._id,
        attendees: 156,
        maxAttendees: 500,
        status: 'approved',
        isFeatured: true,
      },
      {
        title: 'Pottery Workshop',
        description: 'Learn the basics of pottery in this hands-on workshop. All materials provided. Perfect for beginners!',
        category: 'Workshops',
        date: new Date('2026-04-02'),
        time: '2:00 PM',
        location: 'Art Studio, Brooklyn',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=400&fit=crop',
        organizer: organizers[2]._id,
        attendees: 12,
        maxAttendees: 20,
        status: 'approved',
      },
      {
        title: 'Morning Yoga & Run',
        description: 'Start your weekend with a rejuvenating yoga session followed by a 5K community run through the scenic waterfront.',
        category: 'Sports',
        date: new Date('2026-04-05'),
        time: '7:00 AM',
        location: 'Marina Bay, SF',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
        organizer: organizers[0]._id,
        attendees: 45,
        maxAttendees: 100,
        status: 'approved',
      },
      {
        title: 'Startup Mixer',
        description: 'Connect with founders, investors, and tech professionals at our monthly startup networking event.',
        category: 'Networking',
        date: new Date('2026-04-08'),
        time: '7:00 PM',
        location: 'WeWork, Austin TX',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
        organizer: organizers[0]._id,
        attendees: 78,
        maxAttendees: 150,
        status: 'approved',
        isFeatured: true,
      },
      {
        title: 'Watercolor Masterclass',
        description: 'Master watercolor techniques with renowned artist Maria Chen. Suitable for intermediate painters.',
        category: 'Art',
        date: new Date('2026-04-12'),
        time: '11:00 AM',
        location: 'Gallery District, LA',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop',
        organizer: organizers[2]._id,
        attendees: 18,
        maxAttendees: 25,
        status: 'pending',
      },
    ]);
    console.log('Events created');

    // Create some registrations
    await Registration.create([
      { user: users[0]._id, event: events[0]._id, status: 'registered' },
      { user: users[1]._id, event: events[0]._id, status: 'registered' },
      { user: users[2]._id, event: events[0]._id, status: 'registered' },
      { user: users[0]._id, event: events[1]._id, status: 'registered' },
      { user: users[1]._id, event: events[1]._id, status: 'registered' },
      { user: users[0]._id, event: events[2]._id, status: 'registered' },
    ]);
    console.log('Registrations created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest accounts:');
    console.log('Admin: admin@connectwe.com / admin123');
    console.log('Organizer: tech@connectwe.com / organizer123');
    console.log('User: gauri@connectwe.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
