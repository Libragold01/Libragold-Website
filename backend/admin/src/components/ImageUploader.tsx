import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('libragold_admin_token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleFile}
      />

      {value ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ aspectRatio: '16/7' }}>
          <img
            src={value}
            alt="Package image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-gray-700 shadow hover:bg-gray-50 transition"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="p-1.5 bg-red-600 rounded-lg shadow hover:bg-red-700 transition"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors disabled:opacity-60 bg-gray-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-medium">Uploading...</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-6 h-6" />
              <span className="text-xs font-medium">Click to upload image</span>
              <span className="text-[10px]">PNG, JPG, WebP up to 5MB</span>
            </>
          )}
        </button>
      )}

      {uploading && value && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-3 h-3 animate-spin" />
          Uploading new image...
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
