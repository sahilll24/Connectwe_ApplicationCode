// In-memory database for demonstration when MongoDB is not available
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'organizer' | 'admin';
  avatar?: string;
  bio?: string;
  location?: string;
  status: 'active' | 'suspended';
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  time: string;
  location: string;
  image?: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockRegistration {
  _id: string;
  user: string;
  event: string;
  status: 'registered' | 'cancelled' | 'attended';
  registeredAt: Date;
}

class MockDatabase {
  users: MockUser[] = [];
  events: MockEvent[] = [];
  registrations: MockRegistration[] = [];
  initialized = false;

  constructor() {
    // Don't auto-initialize - let the index.ts decide when to initialize
  }

  async initializeData() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Clear existing data
    this.users = [];
    this.events = [];
    this.registrations = [];
    
    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin: MockUser = {
      _id: uuidv4(),
      name: 'Admin User',
      email: 'admin@connectwe.com',
      password: adminPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      status: 'active',
      joinDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(admin);

    // Create organizers
    const orgPassword = await bcrypt.hash('organizer123', 10);
    const organizers: MockUser[] = [
      {
        _id: uuidv4(),
        name: 'TechCommunity SF',
        email: 'tech@connectwe.com',
        password: orgPassword,
        role: 'organizer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        status: 'active',
        joinDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        name: 'NYC Music Collective',
        email: 'music@connectwe.com',
        password: orgPassword,
        role: 'organizer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        status: 'active',
        joinDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.users.push(...organizers);

    // Create regular users
    const userPassword = await bcrypt.hash('user123', 10);
    const users: MockUser[] = [
      {
        _id: uuidv4(),
        name: 'Gauri Patel',
        email: 'gauri@connectwe.com',
        password: userPassword,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
        status: 'active',
        joinDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        name: 'Sakshi Pendarkar',
        email: 'sakshi@connectwe.com',
        password: userPassword,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        status: 'active',
        joinDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.users.push(...users);

    // Create events
    const events: MockEvent[] = [
      {
        _id: uuidv4(),
        title: 'React Summit 2026',
        description: 'Join us for a deep dive into the latest React patterns, performance techniques, and the future of web development.',
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.events.push(...events);

    console.log('Mock database initialized with sample data');
    console.log('Test accounts:');
    console.log('Admin: admin@connectwe.com / admin123');
    console.log('Organizer: tech@connectwe.com / organizer123');
    console.log('User: gauri@connectwe.com / user123');
  }

  // User methods
  async findUserByEmail(email: string): Promise<MockUser | undefined> {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id: string): Promise<MockUser | undefined> {
    return this.users.find(u => u._id === id);
  }

  async createUser(userData: Partial<MockUser>): Promise<MockUser> {
    const newUser: MockUser = {
      _id: uuidv4(),
      name: userData.name!,
      email: userData.email!,
      password: userData.password!,
      role: userData.role || 'user',
      avatar: userData.avatar,
      bio: userData.bio,
      location: userData.location,
      status: 'active',
      joinDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<MockUser>): Promise<MockUser | undefined> {
    const index = this.users.findIndex(u => u._id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...updates, updatedAt: new Date() };
    return this.users[index];
  }

  // Event methods
  async findAllEvents(filter?: any): Promise<MockEvent[]> {
    let result = this.events;
    if (filter?.status) {
      result = result.filter(e => e.status === filter.status);
    }
    if (filter?.category) {
      result = result.filter(e => e.category === filter.category);
    }
    return result;
  }

  async findEventById(id: string): Promise<MockEvent | undefined> {
    return this.events.find(e => e._id === id);
  }

  async createEvent(eventData: Partial<MockEvent>): Promise<MockEvent> {
    const newEvent: MockEvent = {
      _id: uuidv4(),
      title: eventData.title!,
      description: eventData.description!,
      category: eventData.category!,
      date: eventData.date!,
      time: eventData.time!,
      location: eventData.location!,
      image: eventData.image,
      organizer: eventData.organizer!,
      attendees: 0,
      maxAttendees: eventData.maxAttendees!,
      status: eventData.status || 'pending',
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.push(newEvent);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<MockEvent>): Promise<MockEvent | undefined> {
    const index = this.events.findIndex(e => e._id === id);
    if (index === -1) return undefined;
    this.events[index] = { ...this.events[index], ...updates, updatedAt: new Date() };
    return this.events[index];
  }

  async deleteEvent(id: string): Promise<boolean> {
    const index = this.events.findIndex(e => e._id === id);
    if (index === -1) return false;
    this.events.splice(index, 1);
    return true;
  }

  // Registration methods
  async findRegistrations(filter: any): Promise<MockRegistration[]> {
    return this.registrations.filter(r => {
      if (filter.user && r.user !== filter.user) return false;
      if (filter.event && r.event !== filter.event) return false;
      if (filter.status && !filter.status.$in?.includes(r.status)) return false;
      return true;
    });
  }

  async createRegistration(regData: Partial<MockRegistration>): Promise<MockRegistration> {
    const newReg: MockRegistration = {
      _id: uuidv4(),
      user: regData.user!,
      event: regData.event!,
      status: 'registered',
      registeredAt: new Date(),
    };
    this.registrations.push(newReg);
    
    // Update event attendees
    const event = this.events.find(e => e._id === regData.event);
    if (event) {
      event.attendees += 1;
    }
    
    return newReg;
  }
}

export const mockDb = new MockDatabase();
