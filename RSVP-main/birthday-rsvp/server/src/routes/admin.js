import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Rsvp } from '../models/Rsvp.js';

const router = Router();

router.get('/guests', requireAuth, async (req, res, next) => {
  try {
    const list = await Rsvp.find({}).sort({ createdAt: -1 }).lean();
    return res.json(list);
  } catch (e) {
    next(e);
  }
});

export default router;
