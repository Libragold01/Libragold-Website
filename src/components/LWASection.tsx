import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, DollarSign, Users, ArrowRight, CheckCircle } from 'lucide-react';

const perks = [
  'Earn commission on every successful referral',
  'Refer friends, family & colleagues to any Libragold service',
  'Get your unique referral code instantly (LWA ID)',
  'Track your referrals and receive credit alerts',
  'No experience required — just your network',
];

export function LWASection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-5 py-2 mb-6">
              <Briefcase className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-semibold text-sm tracking-wide">LIBRAGOLD WORK AMBASSADOR</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              Become a{' '}
              <span className="bg-gradient-to-r from-[#D4AF37] to-amber-500 bg-clip-text text-transparent">
                Libragold Work Ambassador
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Earn more by referring your colleagues, friends and families to book any of Libragold's travel services — and get a <strong className="text-gray-900">credit alert</strong> in return. Join our growing network of ambassadors across Nigeria.
            </p>

            {/* Perks list */}
            <ul className="space-y-3 mb-8">
              {perks.map((perk, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <CheckCircle className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  {perk}
                </motion.li>
              ))}
            </ul>

            <motion.button
              onClick={() => navigate('/lwa')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold rounded-full text-lg shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Right: Corporate Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main card — uses the LWA.png photo from the public folder */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
              <img
                src="/LWA.png"
                alt="Libragold Work Ambassadors"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {/* Gradient overlay so the bottom stats card stays readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

              {/* Bottom overlay content */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-white font-bold">Earn Per Referral</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-300">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      <span>500+ Ambassadors</span>
                    </div>
                    <div className="text-[#D4AF37] font-semibold">● Growing Daily</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-[#D4AF37] text-black font-bold text-sm px-4 py-2 rounded-full shadow-xl"
            >
              Get Your LWA Code!
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
