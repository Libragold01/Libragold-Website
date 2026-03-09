import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  adminId?: number;
  adminUsername?: string;
  adminRole?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized — no token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const payload = jwt.verify(token, secret) as { adminId: number; username: string; role: string };
    req.adminId = payload.adminId;
    req.adminUsername = payload.username;
    req.adminRole = payload.role || 'admin';
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized — invalid or expired token' });
  }
}

export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.adminRole !== 'super_admin') {
      res.status(403).json({ error: 'Forbidden — Super Admin access required' });
      return;
    }
    next();
  });
}
