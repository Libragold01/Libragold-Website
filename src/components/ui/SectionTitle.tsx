
import { motion } from 'framer-motion';
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}
export function SectionTitle({
  title,
  subtitle,
  centered = true
}: SectionTitleProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5
  }} className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-500 mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-xl text-neutral-600 max-w-3xl mx-auto">{subtitle}</p>}
    </motion.div>;
}