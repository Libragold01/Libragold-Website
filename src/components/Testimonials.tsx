import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Aisha Mohammed',
      role: 'Hajj Pilgrim',
      location: 'Lagos, Nigeria',
      content: 'My Hajj journey with Libragold was spiritually fulfilling and perfectly organised. The team handled every detail — flights, accommodation near the Haram, and guides on ground. I felt at peace the entire time.',
      rating: 5,
      trip: 'Hajj Package 2024',
    },
    {
      name: 'David Okafor',
      role: 'Business Executive',
      location: 'Abuja, Nigeria',
      content: 'My UAE visa was processed within four working days. No back and forth, no stress. Libragold knows exactly what the embassy needs and gets it right the first time.',
      rating: 5,
      trip: 'UAE Business Visa',
    },
    {
      name: 'Fatima Al-Hassan',
      role: 'Student',
      location: 'Kano, Nigeria',
      content: "I was confused about the UK admission process until Libragold stepped in. They helped me pick the right university, prepared my documents, and I received my offer letter within two months. I'm currently in my second year.",
      rating: 5,
      trip: 'UK Study Visa',
    },
    {
      name: 'Ibrahim Yusuf',
      role: 'Family Head',
      location: 'Kaduna, Nigeria',
      content: 'We went for Umrah as a family of six. The rooms were close to Masjid al-Haram, meals were taken care of, and our guide was very knowledgeable. The kids came back changed in the best way.',
      rating: 4,
      trip: 'Family Umrah Package',
    },
    {
      name: 'Grace Adeyemi',
      role: 'Newlywed',
      location: 'Port Harcourt, Nigeria',
      content: 'Our honeymoon tour to Turkey was seamless. Hotel, transfers, sightseeing — all arranged without us lifting a finger. Libragold made sure everything matched what we were promised.',
      rating: 5,
      trip: 'Turkey Tour Package',
    },
  ];

  const nextTestimonial = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[currentIndex];

  // Initials avatar colour cycling
  const avatarColors = ['from-[#D4AF37] to-amber-600', 'from-blue-500 to-blue-700', 'from-emerald-500 to-teal-700', 'from-purple-500 to-indigo-700', 'from-rose-500 to-red-700'];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[#D4AF37] font-semibold text-sm tracking-widest uppercase mb-3">
            What Our Clients Say
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Real Stories,<br />Real Results
            </h2>
            <p className="text-gray-500 max-w-md text-base">
              Thousands of Nigerian families have travelled with Libragold since 1996. Here are a few of their stories.
            </p>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                {/* Left: Quote */}
                <div className="md:col-span-2">
                  <Quote className="w-8 h-8 text-[#D4AF37] mb-5" />

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < current.rating ? 'text-[#D4AF37] fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">{current.rating}.0 / 5</span>
                  </div>

                  <p className="text-gray-700 text-lg sm:text-xl leading-relaxed mb-8">
                    "{current.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColors[currentIndex]} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {current.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{current.name}</p>
                      <p className="text-gray-500 text-sm">{current.role}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {current.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Trip tag */}
                <div className="flex md:justify-end items-start">
                  <div className="border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-xl p-5 text-center min-w-[140px]">
                    <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">Service Used</p>
                    <p className="text-gray-900 font-bold text-base">{current.trip}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[#D4AF37] w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats — clean row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 pt-10 border-t border-gray-200">
          {[
            { value: '5,000+', label: 'Travelers Served' },
            { value: '28+', label: 'Years in Business' },
            { value: '50+', label: 'Destinations' },
            { value: '24/7', label: 'Customer Support' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <motion.p
                whileInView={{ scale: [0.8, 1.05, 1] }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 + 0.2, duration: 0.5, ease: 'easeOut' }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 group-hover:text-[#D4AF37] transition-colors duration-300"
              >
                {stat.value}
              </motion.p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
