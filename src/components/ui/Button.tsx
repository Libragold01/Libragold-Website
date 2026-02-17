import React from 'react';
import { motion } from 'framer-motion';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center relative overflow-hidden';
  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-500 hover:from-amber-600 hover:via-yellow-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60',
    secondary: 'bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white shadow-lg shadow-amber-500/30',
    outline: 'border-2 border-amber-500 text-amber-600 hover:bg-amber-500/10'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  return <motion.button whileHover={{
    scale: 1.02
  }} whileTap={{
    scale: 0.98
  }} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </motion.button>;
}