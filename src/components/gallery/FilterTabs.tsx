import React from 'react';
import { motion } from 'framer-motion';

interface FilterTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FilterTabs({ categories, activeCategory, onCategoryChange }: FilterTabsProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 flex flex-wrap gap-2 max-w-fit mx-auto shadow-sm border border-gray-200">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className="relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
          style={{
            color: activeCategory === category ? '#ffffff' : '#64748b',
          }}
        >
          <span className="relative z-10">{category}</span>
          {activeCategory === category && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1]"
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 30,
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
