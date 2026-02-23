import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SEO } from './SEO';
import { umrahCards, hajjCards } from '../data/pilgrimageCards';

export function PilgrimagesPage() {
  const navigate = useNavigate();

  const handleBookUmrah = (slug: string) => {
    navigate(`/pilgrimages/${slug}`);
  };

  const handleBookHajj = (slug: string) => {
    navigate(`/pilgrimages/hajj-packages/${slug}`);
  };

  return (
    <>
      <SEO
        title="Hajj & Umrah Pilgrimage Services"
        description="Book your Hajj and Umrah pilgrimage packages with Libragold. Premium accommodation, guided tours, and complete spiritual journey support to Makkah and Medina."
        canonical="/pilgrimages"
        keywords="Hajj packages, Umrah packages, pilgrimage, Makkah, Medina, Islamic travel, Saudi Arabia"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-20 sm:py-32">
          <div className="absolute inset-0">
            <img
              src="/Images/Hero Section/makkah-pilgrimage.jpeg"
              alt="Pilgrimage Background"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/90 via-[#F4E4C1]/80 to-[#FFE5B4]/90"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6 sm:mb-8">
                <span className="text-xl sm:text-2xl">🕌</span>
                <span className="text-black font-semibold text-sm sm:text-base">Sacred Pilgrimage Services</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-6 sm:mb-8 leading-tight"
            >
              Hajj & Umrah
              <span className="block bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent text-2xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 sm:mt-4">
                Pilgrimage Services
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl text-black/80 max-w-5xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2 sm:px-4"
            >
              Embark on your spiritual journey with our comprehensive pilgrimage packages.
              We provide complete guidance and support for your sacred journey to the holy cities.
            </motion.p>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Umrah Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4 text-center">
                Umrah Packages
              </h2>
              <p className="text-base sm:text-xl text-gray-600 text-center mb-8 sm:mb-12">Choose from our specially curated Umrah packages</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {umrahCards.map((pkg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-48 sm:h-64 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                        <span className="text-xs sm:text-sm font-semibold text-[#D4AF37]">{pkg.duration}</span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">{pkg.description}</p>

                      <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="text-gray-600 text-xs sm:text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <motion.button
                        onClick={() => handleBookUmrah(pkg.slug)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        Book Packages
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hajj Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4 text-center">
                Hajj 2027 Packages
              </h2>
              <p className="text-base sm:text-xl text-gray-600 text-center mb-8 sm:mb-12">Complete your spiritual obligation with our premium Hajj services</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {hajjCards.map((pkg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-48 sm:h-64 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                        <span className="text-xs sm:text-sm font-semibold text-[#D4AF37]">{pkg.duration}</span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">{pkg.description}</p>

                      <ul className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="text-gray-600 text-xs sm:text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="mb-4 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Pricing:</div>
                        <div className="space-y-1 text-xs sm:text-sm">
                          <div className="flex justify-between">
                            <span>Quad:</span>
                            <span className="font-semibold text-[#D4AF37]">{pkg.pricing.quad}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Triple:</span>
                            <span className="font-semibold text-[#D4AF37]">{pkg.pricing.triple}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Double:</span>
                            <span className="font-semibold text-[#D4AF37]">{pkg.pricing.double}</span>
                          </div>
                          {pkg.pricing.single && (
                            <div className="flex justify-between">
                              <span>Single:</span>
                              <span className="font-semibold text-[#D4AF37]">{pkg.pricing.single}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <motion.button
                        onClick={() => handleBookHajj(pkg.slug)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        Book Package
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
