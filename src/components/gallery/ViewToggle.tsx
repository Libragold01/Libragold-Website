import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Columns3 } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'masonry';
  onViewChange: (view: 'grid' | 'masonry') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 flex gap-1 shadow-sm border border-gray-200">
      <button
        onClick={() => onViewChange('grid')}
        className="relative px-4 py-2 rounded-full transition-colors flex items-center gap-2"
        style={{ color: view === 'grid' ? '#ffffff' : '#64748b' }}
      >
        <LayoutGrid size={16} />
        <span className="text-sm font-medium">Grid</span>
        {view === 'grid' && (
          <motion.div
            layoutId="viewIndicator"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>
      <button
        onClick={() => onViewChange('masonry')}
        className="relative px-4 py-2 rounded-full transition-colors flex items-center gap-2"
        style={{ color: view === 'masonry' ? '#ffffff' : '#64748b' }}
      >
        <Columns3 size={16} />
        <span className="text-sm font-medium">Masonry</span>
        {view === 'masonry' && (
          <motion.div
            layoutId="viewIndicator"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>
    </div>
  );
}
