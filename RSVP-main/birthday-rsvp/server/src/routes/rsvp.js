import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { Rsvp } from '../models/Rsvp.js';

const router = Router();

const rsvpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});

const RsvpBody = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().optional().or(z.literal('')),
  attending: z.boolean(),
  message: z.string().max(300).optional().or(z.literal(''))
});

router.post('/', rsvpLimiter, validate(RsvpBody), async (req, res, next) => {
  try {
    const data = req.validated;
    const doc = new Rsvp({
      name: data.name.trim(),
      email: data.email ? String(data.email).trim() : undefined,
      attending: data.attending,
      message: data.message ? String(data.message).trim() : undefined
    });
    await doc.save();
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
