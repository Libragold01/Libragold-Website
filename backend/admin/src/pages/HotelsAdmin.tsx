import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Building2 } from 'lucide-react';
import { hotelsApi, Hotel } from '../lib/api';

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

interface HotelForm {
  slug: string;
  name: string;
  location: string;
  country: string;
  stars: string;
  description: string;
  amenities: string;
  distanceFromHaram: string;
  isActive: boolean;
  isFeatured: boolean;
}

const EMPTY_FORM: HotelForm = {
  slug: '', name: '', location: '', country: '', stars: '3',
  description: '', amenities: '', distanceFromHaram: '',
  isActive: true, isFeatured: false,
};

function hotelToForm(h: Hotel): HotelForm {
  return {
    slug: h.slug,
    name: h.name,
    location: h.location,
    country: h.country,
    stars: String(h.stars),
    description: h.description,
    amenities: h.amenities.join(', '),
    distanceFromHaram: h.distanceFromHaram ?? '',
    isActive: h.isActive,
    isFeatured: h.isFeatured,
  };
}

function formToPayload(f: HotelForm): Record<string, unknown> {
  return {
    slug: f.slug,
    name: f.name,
    location: f.location,
    country: f.country,
    stars: Number(f.stars),
    description: f.description,
    amenities: f.amenities.split(',').map((s) => s.trim()).filter(Boolean),
    distanceFromHaram: f.distanceFromHaram || null,
    isActive: f.isActive,
    isFeatured: f.isFeatured,
  };
}

function StarDisplay({ count }: { count: number }) {
  return (
    <span className="text-[#D4AF37] tracking-tight text-sm" title={`${count} stars`}>
      {'★'.repeat(count)}{'☆'.repeat(Math.max(0, 5 - count))}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  editing: Hotel | null;
  onClose: () => void;
  onSaved: () => void;
}

function HotelModal({ editing, onClose, onSaved }: ModalProps) {
  const [form, setForm] = useState<HotelForm>(editing ? hotelToForm(editing) : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof HotelForm>(key: K, value: HotelForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = formToPayload(form);
      if (editing) {
        await hotelsApi.update(editing.id, payload);
      } else {
        await hotelsApi.create(payload);
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
            {editing ? 'Edit Hotel' : 'Add Hotel'}
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
                placeholder="e.g. hilton-makkah"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stars (1–5)</label>
              <input
                className={inputCls}
                type="number"
                min="1"
                max="5"
                value={form.stars}
                onChange={(e) => set('stars', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hotel Name</label>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Full hotel name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location</label>
              <input
                className={inputCls}
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="e.g. Makkah"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Country</label>
              <input
                className={inputCls}
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
                placeholder="e.g. Saudi Arabia"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Distance from Haram (optional)
            </label>
            <input
              className={inputCls}
              value={form.distanceFromHaram}
              onChange={(e) => set('distanceFromHaram', e.target.value)}
              placeholder="e.g. 200m"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Hotel description..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Amenities (comma-separated)
            </label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={form.amenities}
              onChange={(e) => set('amenities', e.target.value)}
              placeholder="WiFi, Restaurant, Gym, Pool, Concierge"
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
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Hotel'}
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
        <h3 className="text-base font-bold text-gray-900 mb-2">Delete Hotel?</h3>
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

export function HotelsAdmin() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Hotel | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: { country?: string; active?: string } = {};
      if (countryFilter.trim()) params.country = countryFilter.trim();
      if (activeFilter !== 'all') params.active = activeFilter;
      const data = await hotelsApi.list(params);
      setHotels(data.hotels);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load hotels');
    } finally {
      setIsLoading(false);
    }
  }, [countryFilter, activeFilter]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setShowModal(true);
  }

  function openEdit(h: Hotel) {
    setEditing(h);
    setShowModal(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await hotelsApi.delete(deleteTarget.id);
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
            <Building2 className="w-6 h-6 text-[#D4AF37]" />
            Hotels
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{hotels.length} hotel{hotels.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-black font-semibold text-sm rounded-xl hover:bg-[#c4a030] transition"
        >
          <Plus className="w-4 h-4" />
          Add Hotel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Country:</label>
          <input
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] w-40"
            placeholder="Filter by country"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          />
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
      ) : hotels.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No hotels found</p>
          <button onClick={openCreate} className="mt-4 text-sm text-[#D4AF37] font-semibold hover:underline">
            Add your first hotel
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {hotels.map((h) => (
            <motion.div
              key={h.id}
              variants={cardVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{h.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {h.location}, {h.country}
                  </p>
                </div>
              </div>

              <StarDisplay count={h.stars} />

              {h.distanceFromHaram && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#D4AF37]" />
                  {h.distanceFromHaram} from Haram
                </p>
              )}

              {h.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {h.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {a}
                    </span>
                  ))}
                  {h.amenities.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                      +{h.amenities.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    h.isActive
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  {h.isActive ? 'Active' : 'Inactive'}
                </span>
                {h.isFeatured && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-[#FBF3D5] text-[#8B6914] border-[#D4AF37]/30">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => openEdit(h)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(h)}
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
          <HotelModal
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
