import React from 'react';
import { motion } from 'framer-motion';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}
export function Card({
  children,
  className = '',
  hoverable = false
}: CardProps) {
  const baseStyles = 'bg-white rounded-xl border border-amber-500/20 overflow-hidden shadow-sm';
  if (hoverable) {
    return <motion.div whileHover={{
      y: -8,
      borderColor: 'rgba(245, 158, 11, 0.5)',
      boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.3)'
    }} transition={{
      duration: 0.3
    }} className={`${baseStyles} ${className}`}>
        {children}
      </motion.div>;
  }
  return <div className={`${baseStyles} ${className}`}>{children}</div>;
}