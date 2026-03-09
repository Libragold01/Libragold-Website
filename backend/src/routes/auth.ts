// import { Router, Request, Response } from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
// import { requireAuth, AuthRequest } from '../middleware/auth';

// const router = Router();
// const prisma = new PrismaClient();

// // POST /api/auth/login
// router.post('/login', async (req: Request, res: Response): Promise<void> => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     res.status(400).json({ error: 'Username and password are required' });
//     return;
//   }

//   try {
//     const admin = await prisma.admin.findUnique({ where: { username } });

//     if (!admin) {
//       res.status(401).json({ error: 'Invalid credentials' });
//       return;
//     }

//     const isValid = await bcrypt.compare(password, admin.password);

//     if (!isValid) {
//       res.status(401).json({ error: 'Invalid credentials' });
//       return;
//     }

//     const secret = process.env.JWT_SECRET || 'fallback-secret';
//     const token = jwt.sign(
//       { adminId: admin.id, username: admin.username, role: admin.role },
//       secret,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       token,
//       admin: {
//         id: admin.id,
//         username: admin.username,
//         role: admin.role,
//         createdAt: admin.createdAt,
//       },
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // GET /api/auth/me  — protected
// router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const admin = await prisma.admin.findUnique({
//       where: { id: req.adminId },
//       select: { id: true, username: true, role: true, createdAt: true },
//     });

//     if (!admin) {
//       res.status(404).json({ error: 'Admin not found' });
//       return;
//     }

//     res.json({ admin });
//   } catch (err) {
//     console.error('Auth/me error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// export { router as authRouter };


import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { login, getMe } from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Admin authentication
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: libragold2026
 *     responses:
 *       200:
 *         description: Login successful — returns JWT token and admin info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 admin:
 *                   $ref: '#/components/schemas/AdminPublic'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in admin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admin profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin:
 *                   $ref: '#/components/schemas/AdminPublic'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/me', requireAuth, getMe);

export { router as authRouter };