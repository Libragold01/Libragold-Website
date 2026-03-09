
import { motion } from 'framer-motion';
import { Plane, FileCheck, BookOpen, Building2, ArrowRight, HeartHandshake } from 'lucide-react';

interface OurServicesProps {
  onServiceClick?: (service: string) => void;
}

const services = [
  {
    icon: HeartHandshake,
    title: 'Hajj & Umrah',
    description: 'Over 28 years guiding Nigerian pilgrims to Makkah and Madinah — with trusted packages for every budget.',
    bgImage: '/Images/Hero Section/makkah-pilgrimage.jpeg',
    featured: true,
  },
  {
    icon: Plane,
    title: 'Tour Packages',
    description: 'Curated group and private tours across Africa, Europe, Asia and the Middle East.',
    bgImage: '/Images/Hero Section/The Lush and Luxurious Sanya EDITION on Hainan Island.jpeg',
    featured: false,
  },
  {
    icon: FileCheck,
    title: 'Visa Processing',
    description: 'UAE, Saudi, Schengen, Qatar and more — handled correctly the first time.',
    bgImage: '/Images/Hero Section/Canada Job Visa_ Pathways, Eligibility & Application Process.jpeg',
    featured: false,
  },
  {
    icon: Building2,
    title: 'Hotel Booking',
    description: 'Verified hotels near the Haram and top destinations — pay in full or in installments.',
    bgImage: '/Images/Hero Section/The Lush and Luxurious Sanya EDITION on Hainan Island.jpeg',
    featured: false,
  },
  {
    icon: BookOpen,
    title: 'Study Abroad',
    description: 'University placement, documentation and visa support to UK, Canada and beyond.',
    bgImage: '/Images/Hero Section/Diverse International Students With Diplomas Celebrating Graduation.jpeg',
    featured: false,
  },
];

export function OurServices({ onServiceClick }: OurServicesProps) {
  const handleServiceClick = (serviceTitle: string) => {
    if (onServiceClick) onServiceClick(serviceTitle);
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <p className="text-[#D4AF37] font-semibold text-sm tracking-widest uppercase mb-3">
            What We Offer
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Our Services
            </h2>
            <p className="text-gray-400 max-w-md text-base">
              Libragold Group has served thousands of Nigerian travelers since 1996 — from first Umrah to study abroad.
            </p>
          </div>
        </motion.div>

        {/* Featured Service — large card with real photo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 sm:mb-6"
        >
          {services.filter(s => s.featured).map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleServiceClick(service.title)}
                className="relative h-60 sm:h-80 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={service.bgImage}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />

                {/* Top badge */}
                <div className="absolute top-5 right-5">
                  <span className="px-3 py-1 bg-[#D4AF37] text-black rounded-full font-semibold text-xs tracking-wide">
                    MOST POPULAR
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center">
                  <div className="px-8 sm:px-12 max-w-2xl">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base mb-5 leading-relaxed">
                      {service.description}
                    </p>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors text-sm">
                      Explore Packages
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Other Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {services.filter(s => !s.featured).map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                onClick={() => handleServiceClick(service.title)}
                className="relative bg-gray-900 border border-gray-800 hover:border-[#D4AF37]/40 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300"
              >
                <div className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{service.description}</p>
                  <div className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-semibold">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA — clean, no icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-800 rounded-2xl px-6 sm:px-10 py-6"
        >
          <div>
            <p className="text-white font-semibold text-lg">Not sure which service you need?</p>
            <p className="text-gray-400 text-sm mt-1">Call us or send a message — our team responds within the hour.</p>
          </div>
          <button
            onClick={() => handleServiceClick('Contact')}
            className="whitespace-nowrap px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-full hover:bg-[#F4E4C1] transition-colors text-sm"
          >
            Talk to Us
          </button>
        </motion.div>
      </div>
    </section>
  );
}
