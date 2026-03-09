import { useEffect, useState } from 'react';
import { Save, Edit3, Check, X, RefreshCw } from 'lucide-react';
import { contentApi, SiteContent } from '../lib/api';

interface EditState {
  [key: string]: string;
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Section',
  about: 'About Us',
  contact: 'Contact Information',
  pilgrimage: 'Pilgrimage',
  lwa: 'LWA Ambassador Program',
  general: 'General',
};

export function Content() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditState>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  async function loadContent() {
    setIsLoading(true);
    setError('');
    try {
      const data = await contentApi.list();
      setItems(data.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  function startEdit(item: SiteContent) {
    setEditingKey(item.key);
    setEditValues((prev) => ({ ...prev, [item.key]: item.value }));
  }

  function cancelEdit() {
    setEditingKey(null);
  }

  async function saveEdit(item: SiteContent) {
    const newValue = editValues[item.key];
    if (!newValue?.trim()) {
      alert('Value cannot be empty');
      return;
    }

    setSavingKey(item.key);
    try {
      const data = await contentApi.update(item.key, newValue.trim(), item.section);
      setItems((prev) =>
        prev.map((i) =>
          i.key === item.key ? { ...i, value: data.content.value, updatedAt: data.content.updatedAt } : i
        )
      );
      setEditingKey(null);
      setSavedKey(item.key);
      setTimeout(() => setSavedKey(null), 2000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSavingKey(null);
    }
  }

  // Group items by section
  const grouped = items.reduce<Record<string, SiteContent[]>>((acc, item) => {
    const section = item.section || 'general';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
        <p>{error}</p>
        <button onClick={loadContent} className="mt-2 text-sm underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Edit homepage and site content values
          </p>
        </div>
        <button
          onClick={loadContent}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Content sections */}
      {Object.entries(grouped).map(([section, sectionItems]) => (
        <div key={section} className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">
              {SECTION_LABELS[section] || section}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Section: <code className="text-purple-600">{section}</code>
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {sectionItems.map((item) => {
              const isEditing = editingKey === item.key;
              const isSaving = savingKey === item.key;
              const isSaved = savedKey === item.key;
              const isLong = item.value.length > 80;

              return (
                <div key={item.key} className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                        {item.key}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isSaved && (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                          <Check className="w-3.5 h-3.5" />
                          Saved
                        </span>
                      )}
                      {!isEditing ? (
                        <button
                          onClick={() => startEdit(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => saveEdit(item)}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#D4AF37] text-black hover:bg-[#c4a032] transition disabled:opacity-50"
                          >
                            {isSaving ? (
                              <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5" />
                            )}
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    isLong ? (
                      <textarea
                        value={editValues[item.key] ?? item.value}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, [item.key]: e.target.value }))
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-[#D4AF37] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                        autoFocus
                      />
                    ) : (
                      <input
                        type="text"
                        value={editValues[item.key] ?? item.value}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, [item.key]: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 border border-[#D4AF37] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        autoFocus
                      />
                    )
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed">{item.value}</p>
                  )}

                  <p className="text-xs text-gray-400 mt-1.5">
                    Last updated: {new Date(item.updatedAt).toLocaleDateString('en-NG', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-gray-400 text-lg font-medium">No content found</p>
          <p className="text-gray-400 text-sm mt-1">
            Run the database seed script to populate default content
          </p>
        </div>
      )}
    </div>
  );
}
