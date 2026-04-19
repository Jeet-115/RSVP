import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post('/login', loginLimiter, validate(LoginBody), async (req, res) => {
  const { email, password } = req.validated;
  if (email.toLowerCase() !== config.adminEmail.toLowerCase()) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials' });
  }
  let ok = false;
  if (config.adminPasswordHash) {
    ok = bcrypt.compareSync(password, config.adminPasswordHash);
  } else if (config.adminPassword) {
    ok = password === config.adminPassword;
  }
  if (!ok) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

  const expiresIn = 60 * 30; // 30 minutes
  const token = jwt.sign({ sub: 'admin', email }, config.jwtSecret, { expiresIn });
  return res.json({ token, expiresIn });
});

export default router;
