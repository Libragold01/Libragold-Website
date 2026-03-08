import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Headphones, CheckCircle2 } from 'lucide-react';

const pillars = [
  {
    icon: CreditCard,
    title: 'Pay Small Small (PSS)',
    description: 'Split your booking into 2 to 12 monthly payments. No interest, no hidden fees. Travel now, finish paying later.',
    highlight: 'Flexible Payments',
  },
  {
    icon: Headphones,
    title: 'Always Reachable',
    description: 'Call, WhatsApp, or email us any time. Our customer team is online 24/7 including weekends and public holidays.',
    highlight: '24/7 Support',
  },
  {
    icon: CheckCircle2,
    title: 'Verified & Trusted',
    description: 'Every hotel, airline, and visa partner is vetted. What we promise in the brochure is exactly what you get.',
    highlight: 'No Surprises',
  },
];

export function GoWithLibraGold() {
  return (
    <section className="py-16 sm:py-24 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[#D4AF37] font-semibold text-sm tracking-widest uppercase mb-3">
            The Libragold Promise
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            #GoWithLibraGold
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-800 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
                    {pillar.highlight}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{pillar.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{pillar.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
