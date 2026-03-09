import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart } from 'lucide-react';

interface GalleryCardProps {
  image: string;
  destination: string;
  location: string;
  category: string;
  index: number;
}

export function GalleryCard({ image, destination, location, category, index }: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.03, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-[4/5]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.img
        src={image}
        alt={destination}
        className="w-full h-full object-cover"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: isHovered ? 0.6 : 0.3 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/80 backdrop-blur-sm"
      >
        {category}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Heart size={18} fill={isLiked ? '#D4AF37' : 'none'} stroke={isLiked ? '#D4AF37' : 'currentColor'} />
      </motion.button>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <h3 className="text-2xl font-bold mb-2">{destination}</h3>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl"
        style={{ boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.5), 0 20px 40px rgba(212, 175, 55, 0.3)' }}
      />
    </motion.div>
  );
}
