import mongoose from 'mongoose';

const RsvpSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, trim: true, lowercase: true },
  attending: { type: Boolean, required: true },
  message: { type: String, trim: true, maxlength: 300 },
  createdAt: { type: Date, default: Date.now }
});

export const Rsvp = mongoose.model('Rsvp', RsvpSchema);
