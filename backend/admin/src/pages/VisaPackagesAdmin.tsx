import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, FileCheck } from 'lucide-react';
import { visaPackagesApi, VisaPackage } from '../lib/api';
import { ImageUploader } from '../components/ImageUploader';

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

// ─── Form ─────────────────────────────────────────────────────────────────────

interface VisaForm {
  image: string;
  slug: string;
  name: string;
  country: string;
  flag: string;
  priceNGN: string;
  priceUSD: string;
  processingTime: string;
  validity: string;
  description: string;
  requirements: string;
  isActive: boolean;
  isFeatured: boolean;
}

const EMPTY_FORM: VisaForm = {
  image: '', slug: '', name: '', country: '', flag: '', priceNGN: '', priceUSD: '',
  processingTime: '', validity: '', description: '', requirements: '',
  isActive: true, isFeatured: false,
};

function visaToForm(v: VisaPackage): VisaForm {
  return {
    image: v.image ?? '',
    slug: v.slug,
    name: v.name,
    country: v.country,
    flag: v.flag ?? '',
    priceNGN: String(v.priceNGN),
    priceUSD: String(v.priceUSD),
    processingTime: v.processingTime,
    validity: v.validity ?? '',
    description: v.description,
    requirements: v.requirements.join(', '),
    isActive: v.isActive,
    isFeatured: v.isFeatured,
  };
}

function formToPayload(f: VisaForm): Record<string, unknown> {
  return {
    image: f.image || null,
    slug: f.slug,
    name: f.name,
    country: f.country,
    flag: f.flag || null,
    priceNGN: Number(f.priceNGN),
    priceUSD: f.priceUSD ? Number(f.priceUSD) : 0,
    processingTime: f.processingTime,
    validity: f.validity || null,
    description: f.description,
    requirements: f.requirements.split(',').map((s) => s.trim()).filter(Boolean),
    isActive: f.isActive,
    isFeatured: f.isFeatured,
  };
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  editing: VisaPackage | null;
  onClose: () => void;
  onSaved: () => void;
}

function VisaModal({ editing, onClose, onSaved }: ModalProps) {
  const [form, setForm] = useState<VisaForm>(editing ? visaToForm(editing) : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof VisaForm>(key: K, value: VisaForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = formToPayload(form);
      if (editing) {
        await visaPackagesApi.update(editing.id, payload);
      } else {
        await visaPackagesApi.create(payload);
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
            {editing ? 'Edit Visa Package' : 'Add Visa Package'}
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
                placeholder="e.g. uk-tourist-visa"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Flag (emoji, optional)</label>
              <input
                className={inputCls}
                value={form.flag}
                onChange={(e) => set('flag', e.target.value)}
                placeholder="🇬🇧"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Package Name</label>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. UK Tourist Visa"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Country</label>
            <input
              className={inputCls}
              value={form.country}
              onChange={(e) => set('country', e.target.value)}
              placeholder="e.g. United Kingdom"
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
                value={form.priceNGN}
                onChange={(e) => set('priceNGN', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (USD)</label>
              <input
                className={inputCls}
                type="number"
                min="0"
                value={form.priceUSD}
                onChange={(e) => set('priceUSD', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Processing Time</label>
              <input
                className={inputCls}
                value={form.processingTime}
                onChange={(e) => set('processingTime', e.target.value)}
                placeholder="e.g. 10–15 working days"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Validity (optional)</label>
              <input
                className={inputCls}
                value={form.validity}
                onChange={(e) => set('validity', e.target.value)}
                placeholder="e.g. 6 months"
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

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Requirements (comma-separated)
            </label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={form.requirements}
              onChange={(e) => set('requirements', e.target.value)}
              placeholder="Valid passport, Bank statement, Travel insurance"
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

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cover Image</label>
            <ImageUploader value={form.image || null} onChange={(url) => set('image', url ?? '')} />
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
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Package'}
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
        <h3 className="text-base font-bold text-gray-900 mb-2">Delete Visa Package?</h3>
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

export function VisaPackagesAdmin() {
  const [packages, setPackages] = useState<VisaPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<VisaPackage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VisaPackage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: { active?: string } = { active: activeFilter };
      const data = await visaPackagesApi.list(params);
      setPackages(data.packages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load visa packages');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setShowModal(true);
  }

  function openEdit(v: VisaPackage) {
    setEditing(v);
    setShowModal(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await visaPackagesApi.delete(deleteTarget.id);
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
            <FileCheck className="w-6 h-6 text-[#D4AF37]" />
            Visa Packages
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{packages.length} package{packages.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-black font-semibold text-sm rounded-xl hover:bg-[#c4a030] transition"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
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
      ) : packages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No visa packages found</p>
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
          {packages.map((v) => (
            <motion.div
              key={v.id}
              variants={cardVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                {v.flag && (
                  <span className="text-3xl leading-none mt-0.5" role="img" aria-label={v.country}>
                    {v.flag}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{v.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{v.country}</p>
                </div>
              </div>

              <div className="font-bold text-gray-900 text-sm">
                ₦{v.priceNGN.toLocaleString()}
                {v.priceUSD > 0 && (
                  <span className="ml-2 font-normal text-xs text-gray-500">(${v.priceUSD.toLocaleString()})</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                  {v.processingTime}
                </span>
                {v.validity && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    Valid: {v.validity}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    v.isActive
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  {v.isActive ? 'Active' : 'Inactive'}
                </span>
                {v.isFeatured && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-[#FBF3D5] text-[#8B6914] border-[#D4AF37]/30">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => openEdit(v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(v)}
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
          <VisaModal
            editing={editing}
            onClose={() => setShowModal(false)}
            onSaved={() => { setShowModal(false); load(); }}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            name={deleteTarget.name}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
