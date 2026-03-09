import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import { applySecurityMiddleware, authLimiter } from './middleware/security';
import { setupSwagger } from './middleware/swagger';

//Route imports 
import { authRouter }         from './routes/auth';
import { bookingsRouter }     from './routes/bookings';
import { lwaRouter }          from './routes/lwa';
import { dashboardRouter }    from './routes/dashboard';
import { contentRouter }      from './routes/content';
import { pilgrimagesRouter }  from './routes/pilgrimages';
import { toursRouter }        from './routes/tours';
import { hotelsRouter }       from './routes/hotels';
import { visaPackagesRouter } from './routes/visaPackages';
import { paymentsRouter }     from './routes/payments';
import { adminsRouter }       from './routes/admins';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

//Body parsers 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

//Security (helmet, cors, rate limit, api key guard) 
applySecurityMiddleware(app);

//Swagger UI 
setupSwagger(app);

//Health check (no auth required) 
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//API Routes 
app.use('/api/auth',          authLimiter, authRouter);  // tighter rate limit on auth
app.use('/api/bookings',      bookingsRouter);
app.use('/api/payments',      paymentsRouter);
app.use('/api/lwa',           lwaRouter);
app.use('/api/dashboard',     dashboardRouter);
app.use('/api/content',       contentRouter);
app.use('/api/pilgrimages',   pilgrimagesRouter);
app.use('/api/tours',         toursRouter);
app.use('/api/hotels',        hotelsRouter);
app.use('/api/visa-packages', visaPackagesRouter);
app.use('/api/admins',        adminsRouter);

//Serve Admin SPA in production
if (process.env.NODE_ENV === 'production') {
  const adminDist = path.join(__dirname, '..', 'admin', 'dist');
  app.use('/admin', express.static(adminDist));
  app.get('/admin/*', (_req, res) => {
    res.sendFile(path.join(adminDist, 'index.html'));
  });
}

//404 handler 
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

//Global error handler 
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

export default app;
