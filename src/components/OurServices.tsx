import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Heart, FileCheck, BookOpen, Building2, ArrowRight, Sparkles, Star, Crown, Shield } from 'lucide-react';

interface OurServicesProps {
  onServiceClick?: (service: string) => void;
}
const services = [{
  icon: Heart,
  title: 'Hajj & Umrah',
  description: 'Sacred journeys with premium comfort and spiritual guidance',
  color: 'from-emerald-400 via-teal-500 to-cyan-600',
  bgImage: '/Images/Hero Section/makkah-pilgrimage.jpeg',
  featured: true
}, {
  icon: Plane,
  title: 'Tour Packages',
  description: 'Luxury adventures to breathtaking destinations worldwide',
  color: 'from-blue-400 via-indigo-500 to-purple-600',
  bgImage: '/Images/Hero Section/The Lush and Luxurious Sanya EDITION on Hainan Island.jpeg',
  featured: false
}, {
  icon: FileCheck,
  title: 'Visa Processing',
  description: 'Fast-track visa services for seamless travel experiences',
  color: 'from-rose-400 via-pink-500 to-red-600',
  bgImage: '/Images/Hero Section/Canada Job Visa_ Pathways, Eligibility & Application Process.jpeg',
  featured: false
}, {
  icon: Building2,
  title: 'Hotel Booking',
  description: 'Premium accommodations at unbeatable prices',
  color: 'from-amber-400 via-orange-500 to-red-600',
  bgImage: '/Images/Hero Section/The Lush and Luxurious Sanya EDITION on Hainan Island.jpeg',
  featured: false
}, {
  icon: BookOpen,
  title: 'Study Abroad',
  description: 'Your gateway to world-class education opportunities',
  color: 'from-violet-400 via-purple-500 to-indigo-600',
  bgImage: '/Images/Hero Section/Diverse International Students With Diplomas Celebrating Graduation.jpeg',
  featured: false
}];
export function OurServices({ onServiceClick }: OurServicesProps) {
  const handleServiceClick = (serviceTitle: string) => {
    if (onServiceClick) {
      onServiceClick(serviceTitle);
    }
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-10 w-6 h-6 text-[#D4AF37] opacity-20 animate-pulse" />
        <Star className="absolute top-40 right-20 w-4 h-4 text-yellow-400 opacity-30 animate-bounce" />
        <Crown className="absolute bottom-32 left-20 w-8 h-8 text-[#D4AF37] opacity-20" />
        <Shield className="absolute top-60 left-1/4 w-5 h-5 text-yellow-500 opacity-25 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-medium">Premium Services</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
              Luxury Travel
            </span>
            <br />
            <span className="text-white">Redefined</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience world-class services tailored for the discerning traveler
          </p>
        </motion.div>

        {/* Featured Service - Large Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="mb-8 sm:mb-12"
        >
          {services.filter(s => s.featured).map((service) => {
            const Icon = service.icon;
            return (
              <motion.div 
                key={service.title}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => handleServiceClick(service.title)}
                className="relative h-64 sm:h-80 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group"
              >
                <img 
                  src={service.bgImage} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                
                <div className="absolute top-6 right-6">
                  <div className="px-4 py-2 bg-[#D4AF37] text-black rounded-full font-bold text-sm">
                    ⭐ FEATURED
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-2xl px-6 sm:px-12">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 sm:mb-6 shadow-2xl`}
                    >
                      <Icon className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
                      {service.title}
                    </h3>
                    
                    <p className="text-sm sm:text-xl text-gray-200 mb-4 sm:mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <button className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-2 sm:py-4 bg-[#D4AF37] text-black font-bold rounded-full hover:bg-[#F4E4C1] transition-all group-hover:gap-4 text-sm sm:text-base">
                      Explore Service
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Other Services - Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.filter(s => !s.featured).map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                onClick={() => handleServiceClick(service.title)}
                className="relative h-48 sm:h-64 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className={`w-full h-full bg-gradient-to-br ${service.color}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-xl`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[#D4AF37] font-semibold group-hover:gap-3 transition-all">
                    <span className="text-sm">Discover</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-yellow-500/10 rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-[#D4AF37]/20">
            <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Begin Your Journey?</h3>
            <p className="text-base sm:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Let our experts craft the perfect travel experience just for you
            </p>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#D4AF37] text-black font-bold rounded-full hover:bg-[#F4E4C1] transition-colors shadow-2xl text-sm sm:text-base">
              Get Started Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}