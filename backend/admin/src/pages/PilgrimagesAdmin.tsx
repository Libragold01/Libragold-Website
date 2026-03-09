import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, MapPin, Star } from 'lucide-react';
import { pilgrimagesApi, Pilgrimage } from '../lib/api';

// ─── Variants ────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ─── Form defaults ────────────────────────────────────────────────────────────

interface PilgrimageForm {
  slug: string;
  title: string;
  type: string;
  category: string;
  season: string;
  year: string;
  duration: string;
  description: string;
  priceFromNGN: string;
  priceFromUSD: string;
  features: string;
  isActive: boolean;
  isFeatured: boolean;
}

const EMPTY_FORM: PilgrimageForm = {
  slug: '', title: '', type: 'Hajj', category: 'Standard',
  season: '', year: '', duration: '', description: '',
  priceFromNGN: '', priceFromUSD: '', features: '',
  isActive: true, isFeatured: false,
};

function pilgrimageToForm(p: Pilgrimage): PilgrimageForm {
  return {
    slug: p.slug,
    title: p.title,
    type: p.type,
    category: p.category,
    season: p.season ?? '',
    year: p.year != null ? String(p.year) : '',
    duration: p.duration,
    description: p.description,
    priceFromNGN: String(p.priceFromNGN),
    priceFromUSD: String(p.priceFromUSD),
    features: p.features.join(', '),
    isActive: p.isActive,
    isFeatured: p.isFeatured,
  };
}

function formToPayload(f: PilgrimageForm): Record<string, unknown> {
  return {
    slug: f.slug,
    title: f.title,
    type: f.type,
    category: f.category,
    season: f.season || null,
    year: f.year ? Number(f.year) : null,
    duration: f.duration,
    description: f.description,
    priceFromNGN: Number(f.priceFromNGN),
    priceFromUSD: f.priceFromUSD ? Number(f.priceFromUSD) : 0,
    features: f.features.split(',').map((s) => s.trim()).filter(Boolean),
    isActive: f.isActive,
    isFeatured: f.isFeatured,
  };
}

// ─── Type badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const colors =
    type === 'Hajj'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colors}`}>
      {type}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  editing: Pilgrimage | null;
  onClose: () => void;
  onSaved: () => void;
}

function PilgrimageModal({ editing, onClose, onSaved }: ModalProps) {
  const [form, setForm] = useState<PilgrimageForm>(
    editing ? pilgrimageToForm(editing) : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof PilgrimageForm>(key: K, value: PilgrimageForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = formToPayload(form);
      if (editing) {
        await pilgrimagesApi.update(editing.id, payload);
      } else {
        await pilgrimagesApi.create(payload);
      }
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    'border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] w-full bg-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {editing ? 'Edit Pilgrimage' : 'Add Pilgrimage'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug</label>
              <input
                className={inputCls}
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="e.g. hajj-standard-2026"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
              <select className={inputCls} value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option>Hajj</option>
                <option>Umrah</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title</label>
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Package title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
              <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option>Standard</option>
                <option>Economy</option>
                <option>Premium</option>
                <option>Budget</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Duration</label>
              <input
                className={inputCls}
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                placeholder="e.g. 21 Days"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Season (optional)</label>
              <input
                className={inputCls}
                value={form.season}
                onChange={(e) => set('season', e.target.value)}
                placeholder="e.g. 1446 AH"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year (optional)</label>
              <input
                className={inputCls}
                type="number"
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                placeholder="e.g. 2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Package description..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (NGN)</label>
              <input
                className={inputCls}
                type="number"
                min="0"
                value={form.priceFromNGN}
                onChange={(e) => set('priceFromNGN', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (USD, optional)</label>
              <input
                className={inputCls}
                type="number"
                min="0"
                value={form.priceFromUSD}
                onChange={(e) => set('priceFromUSD', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Features (comma-separated)
            </label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={form.features}
              onChange={(e) => set('features', e.target.value)}
              placeholder="Visa processing, Hotel accommodation, Guided tours"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => set('isFeatured', e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold text-sm hover:bg-[#c4a030] transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Pilgrimage'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Delete confirm ───────────────────────────────────────────────────────────

interface DeleteConfirmProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteConfirm({ name, onConfirm, onCancel, loading }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      >
        <h3 className="text-base font-bold text-gray-900 mb-2">Delete Pilgrimage?</h3>
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete <strong>{name}</strong>? This cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function PilgrimagesAdmin() {
  const [pilgrimages, setPilgrimages] = useState<Pilgrimage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Pilgrimage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pilgrimage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: { type?: string; active?: string } = {};
      if (typeFilter !== 'All') params.type = typeFilter;
      if (activeFilter !== 'all') params.active = activeFilter;
      const data = await pilgrimagesApi.list(params);
      setPilgrimages(data.pilgrimages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load pilgrimages');
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter, activeFilter]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setShowModal(true);
  }

  function openEdit(p: Pilgrimage) {
    setEditing(p);
    setShowModal(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await pilgrimagesApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#D4AF37]" />
            Pilgrimages
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{pilgrimages.length} package{pilgrimages.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-black font-semibold text-sm rounded-xl hover:bg-[#c4a030] transition"
        >
          <Plus className="w-4 h-4" />
          Add Pilgrimage
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Type:</span>
          {['All', 'Hajj', 'Umrah'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === t
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          {[['all', 'All'], ['true', 'Active'], ['false', 'Inactive']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveFilter(val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeFilter === val
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-3">
            <div className="w-7 h-7 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
          <button onClick={load} className="mt-3 text-sm underline hover:no-underline">Try again</button>
        </div>
      ) : pilgrimages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No pilgrimages found</p>
          <button onClick={openCreate} className="mt-4 text-sm text-[#D4AF37] font-semibold hover:underline">
            Add your first package
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {pilgrimages.map((p) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{p.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">{p.slug}</p>
                </div>
                <TypeBadge type={p.type} />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  {p.category}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  {p.duration}
                </span>
                {p.season && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                    {p.season}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-bold text-gray-900 text-sm">
                  ₦{p.priceFromNGN.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    p.isActive
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
                {p.isFeatured && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-[#FBF3D5] text-[#8B6914] border-[#D4AF37]/30">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => openEdit(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <PilgrimageModal
            editing={editing}
            onClose={() => setShowModal(false)}
            onSaved={() => { setShowModal(false); load(); }}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            name={deleteTarget.title}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
