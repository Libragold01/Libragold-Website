import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCog, Plus, Trash2, KeyRound, ShieldCheck, Shield,
  Loader, X, Eye, EyeOff, AlertCircle, CheckCircle,
} from 'lucide-react';
import { adminsApi, Admin } from '../lib/api';
import { useAuth } from '../context/AuthContext';

function RoleBadge({ role }: { role: string }) {
  return role === 'super_admin' ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded-full">
      <ShieldCheck className="w-3 h-3" />
      Super Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
      <Shield className="w-3 h-3" />
      Admin
    </span>
  );
}

interface Toast { type: 'success' | 'error'; message: string; }

export function AdminsPage() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ username: '', password: '', role: 'admin' });
  const [createLoading, setCreateLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset password modal
  const [resetTarget, setResetTarget] = useState<Admin | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function load() {
    try {
      const { admins: data } = await adminsApi.list();
      setAdmins(data);
    } catch {
      showToast('error', 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.username.trim() || !createForm.password.trim()) return;
    setCreateLoading(true);
    try {
      await adminsApi.create(createForm.username.trim(), createForm.password, createForm.role);
      showToast('success', `Admin "${createForm.username}" created`);
      setShowCreate(false);
      setCreateForm({ username: '', password: '', role: 'admin' });
      load();
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Failed to create admin');
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleRoleToggle(a: Admin) {
    if (a.id === currentAdmin?.id) return;
    const newRole = a.role === 'super_admin' ? 'admin' : 'super_admin';
    try {
      await adminsApi.updateRole(a.id, newRole);
      showToast('success', `${a.username} is now ${newRole === 'super_admin' ? 'Super Admin' : 'Admin'}`);
      load();
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Failed to update role');
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetTarget || !newPassword.trim()) return;
    setResetLoading(true);
    try {
      await adminsApi.resetPassword(resetTarget.id, newPassword);
      showToast('success', `Password updated for "${resetTarget.username}"`);
      setResetTarget(null);
      setNewPassword('');
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminsApi.delete(deleteTarget.id);
      showToast('success', `Admin "${deleteTarget.username}" deleted`);
      setDeleteTarget(null);
      load();
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Failed to delete admin');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="w-7 h-7 text-[#D4AF37]" />
            Admin Accounts
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage admin users and their access levels</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#C4A030] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Admin
        </motion.button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Access Level Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-semibold text-gray-900">Super Admin</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Full access to all features</li>
            <li>• Create/edit/delete listings (Pilgrimages, Tours, Hotels, Visa)</li>
            <li>• Manage admin accounts &amp; roles</li>
            <li>• Edit site content</li>
            <li>• View bookings, payments, LWA</li>
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Admin</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• View dashboard &amp; analytics</li>
            <li>• Manage bookings (update status)</li>
            <li>• View payments</li>
            <li>• Manage LWA ambassadors (update status)</li>
            <li>• Cannot access listings, content, or admin settings</li>
          </ul>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="w-6 h-6 animate-spin text-[#D4AF37]" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Username</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Created</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {admins.map((a) => {
                const isSelf = a.id === currentAdmin?.id;
                return (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#D4AF37] text-sm font-bold">{a.username.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{a.username}</p>
                          {isSelf && <p className="text-xs text-gray-400">You</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={a.role} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle role */}
                        {!isSelf && (
                          <button
                            onClick={() => handleRoleToggle(a)}
                            title={a.role === 'super_admin' ? 'Demote to Admin' : 'Promote to Super Admin'}
                            className="p-2 rounded-lg text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}
                        {/* Reset password */}
                        <button
                          onClick={() => { setResetTarget(a); setNewPassword(''); }}
                          title="Reset password"
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        {/* Delete */}
                        {!isSelf && (
                          <button
                            onClick={() => setDeleteTarget(a)}
                            title="Delete admin"
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create Modal ── */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#D4AF37]" />
                  Create New Admin
                </h2>
                <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={createForm.username}
                    onChange={e => setCreateForm(p => ({ ...p, username: e.target.value }))}
                    placeholder="e.g. john_admin"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={createForm.password}
                      onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Min. 6 characters"
                      className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={createForm.role}
                    onChange={e => setCreateForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 text-sm bg-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={createLoading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#C4A030] transition-colors disabled:opacity-60">
                    {createLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reset Password Modal ── */}
      <AnimatePresence>
        {resetTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setResetTarget(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-blue-600" />
                  Reset Password
                </h2>
                <button onClick={() => setResetTarget(null)} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Setting new password for <strong className="text-gray-800">{resetTarget.username}</strong>
              </p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowNewPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setResetTarget(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={resetLoading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60">
                    {resetLoading ? <Loader className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    Update
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Admin</h2>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <strong className="text-gray-800">{deleteTarget.username}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60">
                  {deleteLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
