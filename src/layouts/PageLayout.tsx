
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
