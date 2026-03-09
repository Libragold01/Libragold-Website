import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { authRouter } from './routes/auth';
import { bookingsRouter } from './routes/bookings';
import { lwaRouter } from './routes/lwa';
import { dashboardRouter } from './routes/dashboard';
import { contentRouter } from './routes/content';
import { pilgrimagesRouter } from './routes/pilgrimages';
import { toursRouter } from './routes/tours';
import { hotelsRouter } from './routes/hotels';
import { visaPackagesRouter } from './routes/visaPackages';
import { paymentsRouter } from './routes/payments';
import { adminsRouter } from './routes/admins';
import { uploadRouter } from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ────────────────────────────────────────────────────────────────────

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body parsers ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/lwa', lwaRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/content', contentRouter);
app.use('/api/pilgrimages', pilgrimagesRouter);
app.use('/api/tours', toursRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/visa-packages', visaPackagesRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/upload', uploadRouter);

// ─── Serve uploaded images ────────────────────────────────────────────────────

app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// ─── Serve Admin SPA in production ───────────────────────────────────────────

if (process.env.NODE_ENV === 'production') {
  const adminDist = path.join(__dirname, '..', 'admin', 'dist');
  app.use('/admin', express.static(adminDist));
  app.get('/admin/*', (_req, res) => {
    res.sendFile(path.join(adminDist, 'index.html'));
  });
}

// ─── 404 handler ─────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error handler ────────────────────────────────────────────────────────────

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Start server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 Libragold API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Admin API:    http://localhost:${PORT}/api/auth/login`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🖥️  Admin UI:     http://localhost:${PORT}/admin`);
  } else {
    console.log(`🖥️  Admin UI:     http://localhost:5174 (run: cd admin && npm run dev)`);
  }
  console.log('');
});

export default app;
