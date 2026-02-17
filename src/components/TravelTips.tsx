import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Crown, MapPin, FileText, Sparkles, Star, Globe } from 'lucide-react';
import { BlogDetailPage } from './BlogDetailPage';

const posts = [{
  title: 'VIP Fairmont Package',
  excerpt: 'Experience luxury and spirituality with our exclusive VIP Fairmont Umrah package.',
  date: 'Jan 15, 2025',
  category: 'Packages',
  icon: Crown,
  gradient: 'from-purple-500 to-pink-500',
  accent: 'bg-purple-100 text-purple-700'
}, {
  title: 'Moulud Umrah 2025',
  excerpt: 'Join us for a blessed journey during Moulud with comprehensive services.',
  date: 'Jan 10, 2025',
  category: 'Pilgrimage',
  icon: MapPin,
  gradient: 'from-emerald-500 to-teal-500',
  accent: 'bg-emerald-100 text-emerald-700'
}, {
  title: 'Umrah Visa Updates',
  excerpt: 'Important update: Saudi Arabia has resumed Umrah visa processing.',
  date: 'Dec 28, 2024',
  category: 'News',
  icon: FileText,
  gradient: 'from-blue-500 to-indigo-500',
  accent: 'bg-blue-100 text-blue-700'
}];
export function TravelTips() {
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  if (selectedBlog) {
    return <BlogDetailPage blog={selectedBlog} onBack={() => setSelectedBlog(null)} />;
  }

  return <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-10 w-6 h-6 text-[#D4AF37] opacity-20 animate-pulse" />
        <Star className="absolute top-40 right-20 w-4 h-4 text-purple-400 opacity-30 animate-bounce" />
        <Globe className="absolute bottom-32 left-20 w-8 h-8 text-blue-300 opacity-20 animate-spin" style={{animationDuration: '20s'}} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-[#D4AF37] to-gray-900 bg-clip-text text-transparent">
              Travel Insights
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest updates, exclusive packages, and essential travel information
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post, index) => {
            const IconComponent = post.icon;
            return <motion.article key={post.title} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: index * 0.1
            }} whileHover={{
              y: -8,
              scale: 1.02
            }} className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
              {/* Creative header with gradient and icon */}
              <div className={`relative h-32 bg-gradient-to-br ${post.gradient} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </motion.div>
                
                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${post.accent}`}>
                    {post.category}
                  </span>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full"></div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mb-4">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#D4AF37] transition-colors leading-tight">
                  {post.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>

                <motion.button 
                  onClick={() => setSelectedBlog(post)}
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 text-[#D4AF37] font-semibold group-hover:gap-4 transition-all text-sm sm:text-base relative"
                >
                  <span className="relative z-10">Read more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-lg scale-0 group-hover:scale-100 transition-transform -m-2"></div>
                </motion.button>
              </div>
            </motion.article>
          })}
        </div>
        
        {/* Bottom decorative section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-[#D4AF37]/10 to-yellow-500/10 rounded-full border border-[#D4AF37]/20">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-gray-700 font-medium">Stay updated with our latest travel insights</span>
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </div>
        </motion.div>
      </div>
    </section>;
}