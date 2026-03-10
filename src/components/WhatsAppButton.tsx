import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config';

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Libragold%2C%20I%20would%20like%20to%20enquire%20about%20your%20services.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-4 max-w-[220px] border border-gray-100"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-sm font-semibold text-gray-900 mb-0.5">Chat with us</p>
            <p className="text-xs text-gray-500 leading-relaxed">We typically reply within minutes.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-whatsapp-ping opacity-30" />
        <span className="absolute inset-0 rounded-full bg-green-400 animate-whatsapp-ping opacity-20 animation-delay-300" />

        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onHoverStart={() => setShowTooltip(true)}
          onHoverEnd={() => setShowTooltip(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20be5a] text-white rounded-full shadow-lg transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white stroke-none" />
        </motion.a>
      </div>
    </div>
  );
}
