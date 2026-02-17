import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, FileText, GraduationCap, Hotel } from 'lucide-react';
const services = [{
  icon: MapPin,
  title: 'Tour Packages',
  description: 'Bespoke travel experiences'
}, {
  icon: Heart,
  title: 'Hajj & Umrah',
  description: 'Spiritual journeys'
}, {
  icon: FileText,
  title: 'Visa Services',
  description: 'Fast processing'
}, {
  icon: GraduationCap,
  title: 'Study Abroad',
  description: 'Education support'
}, {
  icon: Hotel,
  title: 'Hotel Booking',
  description: 'Luxury stays'
}];
export function ServiceTeasers() {
  return <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service, index) => {
          const Icon = service.icon;
          return <motion.div key={service.title} initial={{
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
            y: -4
          }} className="group p-6 rounded-2xl border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-soft transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:bg-[#D4AF37] transition-colors">
                  <Icon className="w-6 h-6 text-[#D4AF37] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </motion.div>;
        })}
        </div>
      </div>
    </section>;
}