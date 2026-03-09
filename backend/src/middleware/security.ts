import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Express } from 'express';

//CORS 
// Only allow requests from your known frontends
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export const corsMiddleware = cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin only in development (e.g. Postman, curl)
//     if (!origin) {
//       if (process.env.NODE_ENV !== 'production') return callback(null, true);
//       return callback(new Error('CORS: No origin header'), false);
//     }
//     if (ALLOWED_ORIGINS.includes(origin)) {
//       return callback(null, true);
//     }
//     return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
//   },

origin: (origin, callback) => {
    // In development, allow everything (Swagger UI, Postman, local frontends)
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // Production: enforce allowed origins
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
});

//RATE LIMITERS 

// General API rate limit
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Tighter limit for auth endpoints (prevent brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please wait 15 minutes.' },
});

//API KEY GUARD 
// Requires all API requests to carry x-api-key header.
// This stops casual browser browsing and forces proper clients only.
export function apiKeyGuard(req: Request, res: Response, next: NextFunction): void {
  // Skip for Swagger UI and its JSON spec
  if (req.path.startsWith('/api-docs')) {
    next();
    return;
  }

  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY;

  if (!validKey) {
    // If no API_KEY env var is set, skip this guard (dev convenience)
    next();
    return;
  }

  if (!apiKey || apiKey !== validKey) {
    res.status(401).json({ error: 'Unauthorized — invalid or missing API key' });
    return;
  }

  next();
}

//HIDE POWERED-BY 
// helmet already removes X-Powered-By, but just in case
export function hidePoweredBy(_req: Request, res: Response, next: NextFunction): void {
  res.removeHeader('X-Powered-By');
  next();
}

//APPLY ALL SECURITY TO APP
export function applySecurityMiddleware(app: Express): void {
  // 1. Secure HTTP headers (XSS, clickjacking, sniff protection, etc.)
  app.use(helmet());
  app.use(hidePoweredBy);

  // 2. CORS
  app.use(corsMiddleware);

  // 3. General rate limit on all routes
  app.use('/api', generalLimiter);

  // 4. API key guard — blocks browsers that don't pass the key
  app.use('/api', apiKeyGuard);
}