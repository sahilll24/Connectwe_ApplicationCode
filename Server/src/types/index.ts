export interface IUser {
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

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  time: string;
  location: string;
  image?: string;
  organizer: string | IUser;
  attendees: number;
  maxAttendees: number;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  registrations: IRegistration[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegistration {
  user: string | IUser;
  event: string | IEvent;
  status: 'registered' | 'cancelled' | 'attended';
  registeredAt: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  icon: string;
  count: number;
}

import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}
