import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign(
      { adminId: admin.id, username: admin.username, role: admin.role },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me  — protected
router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.adminId },
      select: { id: true, username: true, role: true, createdAt: true },
    });

    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    res.json({ admin });
  } catch (err) {
    console.error('Auth/me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as authRouter };
