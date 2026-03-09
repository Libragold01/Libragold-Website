// import { Router, Response } from 'express';
// import bcrypt from 'bcryptjs';
// import { PrismaClient } from '@prisma/client';
// import { requireSuperAdmin, AuthRequest } from '../middleware/auth';

// const router = Router();
// const prisma = new PrismaClient();

// // All admin management routes require super_admin

// // GET /api/admins — list all admins
// router.get('/', requireSuperAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const admins = await prisma.admin.findMany({
//       select: { id: true, username: true, role: true, createdAt: true },
//       orderBy: { createdAt: 'asc' },
//     });
//     res.json({ admins });
//   } catch (err) {
//     console.error('List admins error:', err);
//     res.status(500).json({ error: 'Failed to fetch admins' });
//   }
// });

// // POST /api/admins — create admin
// router.post('/', requireSuperAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
//   const { username, password, role } = req.body;

//   if (!username || !password) {
//     res.status(400).json({ error: 'Username and password are required' });
//     return;
//   }

//   const allowedRoles = ['admin', 'super_admin'];
//   const assignedRole = allowedRoles.includes(role) ? role : 'admin';

//   try {
//     const hashed = await bcrypt.hash(password, 12);
//     const admin = await prisma.admin.create({
//       data: { username, password: hashed, role: assignedRole },
//       select: { id: true, username: true, role: true, createdAt: true },
//     });
//     res.status(201).json({ message: 'Admin created', admin });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2002') {
//       res.status(409).json({ error: 'Username already exists' });
//       return;
//     }
//     res.status(500).json({ error: 'Failed to create admin' });
//   }
// });

// // PATCH /api/admins/:id/role — update role
// router.patch('/:id/role', requireSuperAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

//   // Prevent super admin from demoting themselves
//   if (id === req.adminId) {
//     res.status(400).json({ error: 'You cannot change your own role' });
//     return;
//   }

//   const { role } = req.body;
//   if (!['admin', 'super_admin'].includes(role)) {
//     res.status(400).json({ error: 'Invalid role. Must be admin or super_admin' });
//     return;
//   }

//   try {
//     const admin = await prisma.admin.update({
//       where: { id },
//       data: { role },
//       select: { id: true, username: true, role: true, createdAt: true },
//     });
//     res.json({ message: 'Role updated', admin });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') {
//       res.status(404).json({ error: 'Admin not found' }); return;
//     }
//     res.status(500).json({ error: 'Failed to update role' });
//   }
// });

// // PATCH /api/admins/:id/password — reset password
// router.patch('/:id/password', requireSuperAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

//   const { newPassword } = req.body;
//   if (!newPassword || newPassword.length < 6) {
//     res.status(400).json({ error: 'Password must be at least 6 characters' });
//     return;
//   }

//   try {
//     const hashed = await bcrypt.hash(newPassword, 12);
//     await prisma.admin.update({ where: { id }, data: { password: hashed } });
//     res.json({ message: 'Password updated' });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') {
//       res.status(404).json({ error: 'Admin not found' }); return;
//     }
//     res.status(500).json({ error: 'Failed to update password' });
//   }
// });

// // DELETE /api/admins/:id — delete admin
// router.delete('/:id', requireSuperAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

//   // Prevent super admin from deleting themselves
//   if (id === req.adminId) {
//     res.status(400).json({ error: 'You cannot delete your own account' });
//     return;
//   }

//   try {
//     await prisma.admin.delete({ where: { id } });
//     res.json({ message: 'Admin deleted' });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') {
//       res.status(404).json({ error: 'Admin not found' }); return;
//     }
//     res.status(500).json({ error: 'Failed to delete admin' });
//   }
// });

// export { router as adminsRouter };

import { Router } from 'express';
import { requireSuperAdmin } from '../middleware/auth';
import {
  listAdmins,
  createAdmin,
  updateAdminRole,
  resetAdminPassword,
  deleteAdmin,
} from '../controllers/adminsController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin user management — Super Admin only
 */

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: List all admins
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of admin accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admins:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminPublic'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/', requireSuperAdmin, listAdmins);

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
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
 *                 example: jane_admin
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: securePass123
 *               role:
 *                 type: string
 *                 enum: [admin, super_admin]
 *                 default: admin
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 admin:
 *                   $ref: '#/components/schemas/AdminPublic'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Username already exists
 */
router.post('/', requireSuperAdmin, createAdmin);

/**
 * @swagger
 * /api/admins/{id}/role:
 *   patch:
 *     summary: Update an admin's role
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, super_admin]
 *     responses:
 *       200:
 *         description: Role updated
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/role', requireSuperAdmin, updateAdminRole);

/**
 * @swagger
 * /api/admins/{id}/password:
 *   patch:
 *     summary: Reset an admin's password
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: newSecurePass456
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/password', requireSuperAdmin, resetAdminPassword);

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', requireSuperAdmin, deleteAdmin);

export { router as adminsRouter };