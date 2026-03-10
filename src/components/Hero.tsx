import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
const heroImages = ['/Images/Hero Section/Canada Job Visa_ Pathways, Eligibility & Application Process.jpeg', '/Images/Hero Section/Diverse International Students With Diplomas Celebrating Graduation.jpeg', '/Images/Hero Section/download (18).jpeg', '/Images/Hero Section/The Lush and Luxurious Sanya EDITION on Hainan Island.jpeg', '/Images/Hero Section/makkah-pilgrimage.jpeg'];
interface HeroProps {
  onExploreDestinations?: () => void;
  onBookNow?: () => void;
}

export function Hero({ onExploreDestinations, onBookNow }: HeroProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const {
    scrollY
  } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  return <section className="relative h-screen min-h-[500px] sm:min-h-[700px] overflow-hidden">
      {/* Background Images with Parallax */}
      <motion.div style={{
      y
    }} className="absolute inset-0">
        {heroImages.map((image, index) => <motion.div key={image} initial={{
        opacity: 0
      }} animate={{
        opacity: index === currentImage ? 1 : 0
      }} transition={{
        duration: 1.5
      }} className="absolute inset-0">
            <img src={image} alt="Luxury destination" className="w-full h-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'low'} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          </motion.div>)}
      </motion.div>

      {/* Content */}
      <motion.div style={{
      opacity
    }} className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center pt-20 sm:pt-0">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="mb-3 sm:mb-6">
            <span className="inline-flex items-center px-4 sm:px-4 py-2 sm:py-2 rounded-full glass-dark text-white/90 text-sm sm:text-sm font-medium">
              Luxury Travel Redefined
            </span>
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-[1] sm:leading-[1.1] tracking-tight px-2 sm:px-4">
            Journey Beyond
            <br />
            <span className="text-[#D4AF37]">Boundaries</span>
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.6
        }} className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto font-light px-4 sm:px-4 leading-relaxed">
            Experience bespoke pilgrimage and luxury travel with LibraGold
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center px-4 sm:px-0">
            <motion.button 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.8 }} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={onExploreDestinations}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#D4AF37] text-black font-bold rounded-full hover:bg-[#F4E4C1] transition-colors shadow-luxury text-base"
            >
              Explore Destinations
            </motion.button>
            
            <motion.button 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.9 }} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={onBookNow}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition-colors border border-white/30 text-base"
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator - Hidden on small mobile */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.5
    }} className="hidden sm:flex absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{
        y: [0, 12, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity
      }} className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs sm:text-sm font-medium">
            Scroll to explore
          </span>
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>
      </motion.div>

      {/* Image Indicators */}
      <div className="absolute bottom-4 sm:bottom-12 right-4 sm:right-8 lg:right-12 z-10 flex gap-1.5 sm:gap-2">
        {heroImages.map((_, index) => <button key={index} onClick={() => setCurrentImage(index)} className={`h-0.5 sm:h-1 rounded-full transition-all ${index === currentImage ? 'bg-[#D4AF37] w-6 sm:w-12' : 'bg-white/30 w-4 sm:w-8 hover:bg-white/50'}`} aria-label={`View image ${index + 1}`} />)}
      </div>
    </section>;
}