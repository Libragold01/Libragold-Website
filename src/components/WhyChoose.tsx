import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, PhoneCall, BadgeCheck } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Since 1996',
    description: 'Nearly three decades helping Nigerian families travel with confidence — from their first Umrah to study abroad.',
  },
  {
    icon: BadgeCheck,
    title: 'Licensed & Regulated',
    description: 'Fully accredited by the Nigerian Tourism Development Corporation (NTDC) and approved by the Saudi Embassy.',
  },
  {
    icon: PhoneCall,
    title: '24/7 On-Ground Support',
    description: 'Our team is reachable day or night — whether you are at MMIA, Jeddah airport, or anywhere in between.',
  },
  {
    icon: Clock,
    title: 'Pay at Your Own Pace',
    description: 'Book your trip now and spread payments across 2 to 12 months with our Libragold PSS plan.',
  },
];

export function WhyChoose() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[#D4AF37] font-semibold text-sm tracking-widest uppercase mb-3">
            Why Libragold
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What Sets Us Apart
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-base">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
