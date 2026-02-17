import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: 'Aisha Mohammed',
      role: 'Hajj Pilgrim',
      location: 'Lagos, Nigeria',
      content: 'My Hajj journey with LibraGold was spiritually fulfilling and perfectly organized. Every moment was handled with care and respect.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      trip: 'Hajj 2023'
    },
    {
      name: 'David Okafor',
      role: 'Business Executive',
      location: 'Abuja, Nigeria',
      content: 'Seamless visa processing for my Dubai business trip. LibraGold made everything effortless and professional.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      trip: 'UAE Business Visa'
    },
    {
      name: 'Fatima Al-Hassan',
      role: 'Student',
      location: 'Kano, Nigeria',
      content: 'Thanks to LibraGold, I\'m now studying in the UK. Their admission guidance was exceptional and supportive.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      trip: 'UK Study Visa'
    },
    {
      name: 'Ibrahim Yusuf',
      role: 'Family Traveler',
      location: 'Kaduna, Nigeria',
      content: 'Our family Umrah was beautifully arranged. The kids loved every moment, and we felt blessed throughout.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      trip: 'Family Umrah'
    },
    {
      name: 'Grace Adebayo',
      role: 'Honeymooner',
      location: 'Port Harcourt, Nigeria',
      content: 'Our honeymoon in Turkey was magical! LibraGold created the perfect romantic getaway for us.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      trip: 'Turkey Honeymoon'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#D4AF37]/5 via-white to-[#F4E4C1]/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#F4E4C1]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 rounded-full mb-6">
            <Star className="w-5 h-5 text-[#D4AF37] fill-current" />
            <span className="text-[#D4AF37] font-semibold">Client Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Journeys That
            <span className="block bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] bg-clip-text text-transparent">
              Inspire Trust
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Real experiences from Nigerian travelers who chose LibraGold for their most important journeys
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-bl-full"></div>
              <Quote className="w-12 h-12 text-[#D4AF37] mb-6 relative z-10" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
                {/* Testimonial Content */}
                <div className="md:col-span-2 lg:col-span-2">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#D4AF37] fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed mb-6 font-light">
                    "{testimonials[currentIndex].content}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4E4C1] flex items-center justify-center text-2xl font-bold text-white">
                      {testimonials[currentIndex].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-600 font-medium">
                        {testimonials[currentIndex].role}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        {testimonials[currentIndex].location}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Trip Badge */}
                <div className="lg:col-span-1 flex justify-center">
                  <div className="bg-gradient-to-br from-[#D4AF37] to-[#F4E4C1] p-6 rounded-2xl text-center shadow-lg">
                    <div className="text-2xl mb-2">✈️</div>
                    <div className="text-black font-bold text-lg">
                      {testimonials[currentIndex].trip}
                    </div>
                    <div className="text-black/70 text-sm mt-1">Experience</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-all duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        {/* Testimonial Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-[#D4AF37] w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200"
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-2">5,000+</div>
            <div className="text-gray-600">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-2">98%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-2">50+</div>
            <div className="text-gray-600">Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}