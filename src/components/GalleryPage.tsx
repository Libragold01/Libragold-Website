import { useState } from 'react';
import { motion } from 'framer-motion';
import { FilterTabs } from './gallery/FilterTabs';
import { GalleryCard } from './gallery/GalleryCard';
import { ViewToggle } from './gallery/ViewToggle';
import { SEO } from './SEO';

interface GalleryPageProps {
  onFormSubmitted?: (details?: any) => void;
}

export function GalleryPage({ onFormSubmitted: _onFormSubmitted }: GalleryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [view, setView] = useState<'grid' | 'masonry'>('grid');
  const categories = ['All', 'Pilgrimage', 'Hotels', 'Destinations', 'Events', 'Culture'];

  const galleryItems = [
    { image: '/Images/Gallery/IMG-20250603-WA0001.jpg', destination: 'Pilgrimage Journey', location: 'Makkah, Saudi Arabia', category: 'Pilgrimage' },
    { image: '/Images/Gallery/IMG-20250603-WA0003.jpg', destination: 'Holy Sites', location: 'Makkah, Saudi Arabia', category: 'Pilgrimage' },
    { image: '/Images/Gallery/IMG-20250603-WA0051.jpg', destination: 'Sacred Moments', location: 'Medina, Saudi Arabia', category: 'Pilgrimage' },
    { image: '/Images/Gallery/IMG-20250603-WA0053.jpg', destination: 'Spiritual Journey', location: 'Saudi Arabia', category: 'Pilgrimage' },
    { image: '/Images/Gallery/IMG-20250603-WA0054.jpg', destination: 'Blessed Travel', location: 'Saudi Arabia', category: 'Pilgrimage' },
    { image: '/Images/Gallery/IMG-20250604-WA0021.jpg', destination: 'Group Pilgrimage', location: 'Makkah, Saudi Arabia', category: 'Pilgrimage' },
    { image: '/Images/Gallery/IMG-20250604-WA0032.jpg', destination: 'Umrah Experience', location: 'Saudi Arabia', category: 'Pilgrimage' },
    { image: '/Images/Gallery/IMG-20250604-WA0043.jpg', destination: 'Holy Journey', location: 'Saudi Arabia', category: 'Pilgrimage' },
    { image: '/Images/Gallery/IMG_0808.jpg', destination: 'Travel Memories', location: 'International', category: 'Destinations' },
    { image: '/Images/Gallery/IMG_0811.jpg', destination: 'Adventure Awaits', location: 'International', category: 'Destinations' },
    { image: '/Images/Gallery/IMG_0877.jpg', destination: 'Cultural Experience', location: 'International', category: 'Culture' },
    { image: '/Images/Gallery/IMG_0894.jpg', destination: 'Scenic Views', location: 'International', category: 'Destinations' },
    { image: '/Images/Gallery/behind horel.jpg', destination: 'Hotel Views', location: 'Saudi Arabia', category: 'Hotels' },
    { image: '/Images/Gallery/good1.jpg', destination: 'Premium Stay', location: 'Saudi Arabia', category: 'Hotels' },
    { image: '/Images/Gallery/PHOTO-2024-06-09-16-55-28.jpg', destination: 'Travel Highlights', location: 'International', category: 'Events' },
    { image: '/Images/Gallery/PHOTO-2024-06-10-12-10-25.jpg', destination: 'Special Moments', location: 'International', category: 'Events' },
    { image: '/Images/Gallery/PHOTO-2024-06-22-07-54-50.jpg', destination: 'Journey Together', location: 'International', category: 'Events' },
    { image: '/Images/Gallery/PHOTO-2024-06-22-13-43-35.jpg', destination: 'Group Travel', location: 'International', category: 'Events' },
    { image: '/Images/Gallery/PHOTO-2024-06-24-11-20-48.jpg', destination: 'Memorable Trip', location: 'International', category: 'Culture' },
    { image: '/Images/Gallery/PHOTO-2024-06-24-11-20-49 (1).jpg', destination: 'Travel Experience', location: 'International', category: 'Culture' },
  ];

  const filteredItems = selectedCategory === 'All' ? galleryItems : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <>
      <SEO
        title="Gallery — Libragold Group"
        description="Browse our photo gallery of past pilgrimages, Umrah journeys, tours and travel experiences with Libragold Group."
        canonical="/gallery"
        keywords="Libragold gallery, Umrah photos, Hajj photos, travel photos Nigeria, pilgrimage gallery"
      />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-32">
        <div className="absolute inset-0">
          <img 
            src="/Images/Hero Section/Diverse International Students With Diplomas Celebrating Graduation.jpeg" 
            alt="Gallery Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/90 via-[#F4E4C1]/80 to-[#FFE5B4]/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-8">
              <span className="text-2xl">📸</span>
              <span className="text-black font-semibold">Memories & Moments</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold text-black mb-8 leading-tight"
          >
            Our Gallery
            <span className="block bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent text-5xl md:text-6xl mt-4">
              Journey Highlights
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base sm:text-xl md:text-2xl text-black/80 max-w-5xl mx-auto leading-relaxed mb-10 px-4"
          >
            Explore the beautiful moments and destinations from our travelers' journeys. 
            From sacred pilgrimages to luxury accommodations, witness the experiences that make LibraGold special.
          </motion.p>
        </div>
      </div>

      {/* Controls */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <FilterTabs categories={categories} activeCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === 'grid' ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div key={`${item.destination}-${index}`} layout>
                  <GalleryCard {...item} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {filteredItems.map((item, index) => (
                <div key={`${item.destination}-${index}`} className="mb-6 break-inside-avoid">
                  <GalleryCard {...item} index={index} />
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No images found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}