import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Plane, Hotel, Compass, Globe, Landmark } from 'lucide-react';

const services = [
  {
    icon: Landmark,
    label: 'Pilgrimage',
    description: 'Hajj & Umrah packages — split into easy installments',
    path: '/pilgrimages',
    gradient: 'from-yellow-400 to-amber-500',
  },
  {
    icon: Hotel,
    label: 'Hotel Booking',
    description: 'Book luxury hotels and pay at your own pace',
    path: '/hotels',
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    icon: Compass,
    label: 'Tour Packages',
    description: 'Explore the world without financial stress',
    path: '/tours',
    gradient: 'from-emerald-400 to-green-600',
  },
  {
    icon: Globe,
    label: 'Visa Processing',
    description: 'Get your visa processed with flexible payment',
    path: '/visas',
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    icon: Plane,
    label: 'Flight Tickets',
    description: 'Secure your seat now, complete payment later',
    path: '/ticketing',
    gradient: 'from-rose-400 to-red-500',
  },
];

export function LibragoldPSS() {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-5 py-2 mb-6">
            <Layers className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold text-sm tracking-wide">LIBRAGOLD PSS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Pay Small Small
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Pay in convenient installments — travel, perform your pilgrimage, and explore the world without financial burden. Pick a service and choose <span className="text-[#D4AF37] font-semibold">Pay Small Small</span> at checkout.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 sm:mb-16"
        >
          {[
            { step: '01', title: 'Pick a Service', desc: 'Choose from our range of travel services below' },
            { step: '02', title: 'Fill Your Details', desc: 'Complete the booking form with your information' },
            { step: '03', title: 'Choose PSS', desc: 'Select "Pay Small Small" and set your installments' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-3xl font-black text-[#D4AF37]/30 leading-none">{item.step}</div>
              <div>
                <div className="text-white font-semibold mb-1">{item.title}</div>
                <div className="text-gray-400 text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {services.map((service, index) => (
            <motion.button
              key={index}
              onClick={() => navigate(service.path)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group text-left bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-2xl"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{service.label}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-semibold">
                Book & Pay in Installments
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm">
            Payments are flexible and tailored to your budget. No hidden charges. Powered by{' '}
            <span className="text-[#D4AF37] font-semibold">Lotus Bank</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
