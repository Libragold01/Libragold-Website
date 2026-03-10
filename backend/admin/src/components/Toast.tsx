import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

// ─── Context ────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

// ─── Provider ───────────────────────────────────────────────────────────────

let _id = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles: Record<ToastType, { bg: string; border: string; icon: React.ReactNode }> = {
              success: {
                bg: 'bg-white',
                border: 'border-green-200',
                icon: <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />,
              },
              error: {
                bg: 'bg-white',
                border: 'border-red-200',
                icon: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
              },
              info: {
                bg: 'bg-white',
                border: 'border-blue-200',
                icon: <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
              },
            };
            const s = styles[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${s.bg} ${s.border} min-w-[240px] max-w-sm`}
              >
                {s.icon}
                <span className="text-sm font-medium text-gray-800 flex-1">{toast.message}</span>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
