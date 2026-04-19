import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import { connectDB } from './db.js';
import rsvpRoutes from './routes/rsvp.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

const app = express();

// CORS
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      process.env.VERCEL_URL,
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'frame-src': ['https://www.google.com', 'https://maps.google.com']
    }
  }
}));

app.use(express.json({ limit: '100kb' }));

if (config.nodeEnv !== 'production') {
  app.use(morgan('dev'));
}

const healthHandler = (req, res) => {
  res.status(200).json({
    ok: true,
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);

// Error handler (no internals)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'ServerError' });
});

const start = async () => {
  try {
    const conn = await connectDB();
    conn.on('error', (e) => console.error('Mongo error:', e));
    console.log('Mongo connected');
    app.listen(config.port, () => {
      console.log(`Server running on :${config.port}`);
    });
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
};

start();
