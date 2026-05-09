import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  status: 'registered' | 'cancelled' | 'attended';
  registeredAt: Date;
}

const RegistrationSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['registered', 'cancelled', 'attended'],
      default: 'registered',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate registrations
RegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
