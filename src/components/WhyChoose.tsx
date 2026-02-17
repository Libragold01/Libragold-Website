import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Shield, Sparkles } from 'lucide-react';
const features = [{
  icon: Award,
  title: '30 Years Experience',
  description: 'Industry-leading expertise in luxury travel'
}, {
  icon: Sparkles,
  title: 'Bespoke Journeys',
  description: 'Tailored to your unique preferences'
}, {
  icon: Shield,
  title: 'Trusted Partner',
  description: 'Fully licensed and insured services'
}, {
  icon: Clock,
  title: '24/7 Support',
  description: 'Always here when you need us'
}];
export function WhyChoose() {
  return <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Why Choose LibraGold
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Excellence in every journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
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
          }} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#D4AF37]/10 mb-4 sm:mb-6">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 px-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-4">
                  {feature.description}
                </p>
              </motion.div>;
        })}
        </div>
      </div>
    </section>;
}