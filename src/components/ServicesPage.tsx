import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, MapPin, FileText, GraduationCap, Building, ArrowRight, CheckCircle, Star, Users, Clock } from 'lucide-react';
import { SEO } from './SEO';

const services = [
  {
    icon: MapPin,
    title: 'Hajj & Umrah',
    description: 'Complete pilgrimage packages with accommodation, flights, and guided tours',
    features: ['Visa processing', 'Hotel bookings', 'Ground transportation', '24/7 support'],
    gradient: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    price: 'From $2,200',
    rating: 4.9,
    clients: '2,500+'
  },
  {
    icon: FileText,
    title: 'Visa Processing',
    description: 'Fast and reliable visa services for multiple destinations',
    features: ['UAE visas', 'Saudi visas', 'Schengen visas', 'Qatar visas'],
    gradient: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    price: 'From $160',
    rating: 4.8,
    clients: '3,000+'
  },
  {
    icon: Plane,
    title: 'Tour Packages',
    description: 'Customized travel packages to amazing destinations worldwide',
    features: ['Egypt tours', 'Turkey packages', 'South Africa trips', 'Nigeria tours'],
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    price: 'From $1,500',
    rating: 4.7,
    clients: '1,200+'
  },
  {
    icon: Building,
    title: 'Hotel Booking',
    description: 'Premium hotel reservations in Makkah, Madinah, and worldwide',
    features: ['5-star hotels', 'Budget options', 'Group bookings', 'Special rates'],
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    price: 'From $80/night',
    rating: 4.6,
    clients: '4,000+'
  },
  {
    icon: GraduationCap,
    title: 'Study Abroad',
    description: 'Educational consultancy and admission processing services',
    features: ['University applications', 'Student visas', 'Scholarship guidance', 'Pre-departure support'],
    gradient: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50',
    price: 'From $500',
    rating: 4.8,
    clients: '800+'
  }
];

interface ServicesPageProps {
  onNavigate?: (page: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps = {}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleServiceClick = (serviceTitle: string) => {
    if (onNavigate) {
      switch (serviceTitle) {
        case 'Hajj & Umrah':
          onNavigate('pilgrimages');
          break;
        case 'Visa Processing':
          onNavigate('visas');
          break;
        case 'Tour Packages':
          onNavigate('tourpackages');
          break;
        case 'Hotel Booking':
          onNavigate('hotels');
          break;
        case 'Study Abroad':
          onNavigate('admission');
          break;
        default:
          onNavigate('contact');
      }
    }
  };

  return (
    <>
      <SEO
        title="Our Services — Libragold Group"
        description="Libragold Group offers Umrah, Hajj, tour packages, hotel bookings, visa processing, flight ticketing and school admission services."
        canonical="/services"
        keywords="Libragold services, Umrah packages, Hajj packages, visa processing, hotel booking, flight ticketing, school admission Nigeria"
      />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-[#D4AF37] to-gray-900 bg-clip-text text-transparent">
                Our Services
              </h1>
            </div>
            
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive travel solutions designed to make your journey 
              <span className="text-[#D4AF37] font-bold"> extraordinary</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              {/* Header with gradient */}
              <div className={`relative h-32 bg-gradient-to-br ${service.gradient} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <motion.div 
                  animate={{ 
                    rotate: hoveredIndex === index ? 360 : 0,
                    scale: hoveredIndex === index ? 1.2 : 1
                  }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                >
                  <service.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title and Rating */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">{service.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{service.clients} clients</span>
                  </div>
                  <div className="text-lg font-bold text-[#D4AF37]">{service.price}</div>
                </div>

                {/* CTA Button */}
                <motion.button 
                  whileHover={{ x: 4 }}
                  onClick={() => handleServiceClick(service.title)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all group-hover:gap-4"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-yellow-500/10 rounded-3xl p-12 border border-[#D4AF37]/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let our experienced team help you plan the perfect travel experience tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onNavigate?.('contact')}
                className="px-8 py-4 bg-[#D4AF37] text-white rounded-xl font-semibold hover:bg-[#B8941F] transition-colors flex items-center gap-2"
              >
                <Clock className="w-5 h-5" />
                Book Consultation
              </button>
              <button 
                onClick={() => onNavigate?.('destinations')}
                className="px-8 py-4 border-2 border-[#D4AF37] text-[#D4AF37] rounded-xl font-semibold hover:bg-[#D4AF37] hover:text-white transition-colors"
              >
                View All Packages
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}