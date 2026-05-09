import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  category: string;
  date: Date;
  time: string;
  location: string;
  image?: string;
  organizer: mongoose.Types.ObjectId;
  attendees: number;
  maxAttendees: number;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Tech', 'Music', 'Workshops', 'Sports', 'Networking', 'Art'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide a time'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    image: {
      type: String,
      default: '',
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: {
      type: Number,
      default: 0,
    },
    maxAttendees: {
      type: Number,
      required: [true, 'Please provide maximum attendees'],
      min: [1, 'Maximum attendees must be at least 1'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
EventSchema.index({ title: 'text', description: 'text', location: 'text' });
EventSchema.index({ category: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ date: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);
