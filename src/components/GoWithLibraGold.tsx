import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Clock, Star } from 'lucide-react';
export function GoWithLibraGold() {
  return <section className="py-16 sm:py-24 lg:py-32 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            #GoWithLibraGold
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Experience travel the way it should be
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[{
          icon: CreditCard,
          title: 'Pay Small Small',
          description: 'Flexible payment plans that make luxury travel accessible to everyone.'
        }, {
          icon: Clock,
          title: '24/7 Support',
          description: 'Round-the-clock assistance wherever you are in the world.'
        }, {
          icon: Star,
          title: 'Curated Trips',
          description: 'Bespoke adventures tailored to your unique preferences.'
        }].map((feature, index) => {
          const Icon = feature.icon;
          return <motion.div key={feature.title} initial={{
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
          }} className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center mb-4 sm:mb-6">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>;
        })}
        </div>
      </div>
    </section>;
}