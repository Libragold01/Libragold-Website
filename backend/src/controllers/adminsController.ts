import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

//GET /api/admins
export async function listAdmins(req: AuthRequest, res: Response): Promise<void> {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, username: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ admins });
  } catch (err) {
    console.error('List admins error:', err);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
}

//POST /api/admins
export async function createAdmin(req: AuthRequest, res: Response): Promise<void> {
  const { username, password, role } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const allowedRoles = ['admin', 'super_admin'];
  const assignedRole = allowedRoles.includes(role) ? role : 'admin';

  try {
    const hashed = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.create({
      data: { username, password: hashed, role: assignedRole },
      select: { id: true, username: true, role: true, createdAt: true },
    });
    res.status(201).json({ message: 'Admin created', admin });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'Username already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create admin' });
  }
}

//PATCH /api/admins/:id/role
export async function updateAdminRole(req: AuthRequest, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  if (id === req.adminId) {
    res.status(400).json({ error: 'You cannot change your own role' });
    return;
  }

  const { role } = req.body;
  if (!['admin', 'super_admin'].includes(role)) {
    res.status(400).json({ error: 'Invalid role. Must be admin or super_admin' });
    return;
  }

  try {
    const admin = await prisma.admin.update({
      where: { id },
      data: { role },
      select: { id: true, username: true, role: true, createdAt: true },
    });
    res.json({ message: 'Role updated', admin });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to update role' });
  }
}

//PATCH /api/admins/:id/password
export async function resetAdminPassword(req: AuthRequest, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({ where: { id }, data: { password: hashed } });
    res.json({ message: 'Password updated' });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to update password' });
  }
}

//DELETE /api/admins/:id 
export async function deleteAdmin(req: AuthRequest, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  if (id === req.adminId) {
    res.status(400).json({ error: 'You cannot delete your own account' });
    return;
  }

  try {
    await prisma.admin.delete({ where: { id } });
    res.json({ message: 'Admin deleted' });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }
    res.status(500).json({ error: 'Failed to delete admin' });
  }
}