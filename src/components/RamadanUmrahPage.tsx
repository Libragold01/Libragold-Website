import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Users, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PilgrimageBookingForm } from './PilgrimageBookingForm';
import { ramadanUmrahPackages } from '../data/ramadanUmrahPackages';
import type { UmrahPackage, SelectedBookingPackage, OccupancyPricing } from '../data/types';

interface RamadanUmrahPageProps {
  onBack?: () => void;
  onFormSubmitted?: (details?: any) => void;
}

export function RamadanUmrahPage({ onBack, onFormSubmitted }: RamadanUmrahPageProps) {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<SelectedBookingPackage | null>(null);
  const [selectedOccupancy, setSelectedOccupancy] = useState<string>('');

  const handlePackageSelect = (pkg: UmrahPackage, occupancy: string) => {
    const occupancyKey = occupancy.toLowerCase() as keyof OccupancyPricing;
    const price = pkg.pricing[occupancyKey] || '';
    setSelectedPackage({
      service: 'Ramadan Umrah',
      package: pkg.name,
      priceType: occupancy,
      price: { naira: price, usd: price },
    });
  };

  const packages = ramadanUmrahPackages;

  if (selectedPackage) {
    return (
      <PilgrimageBookingForm
        packageDetails={selectedPackage}
        onBack={() => setSelectedPackage(null)}
        onFormSubmitted={onFormSubmitted}
      />
    );
  }

  if (selectedOccupancy) {
    const pkg = packages.find(p => p.name === selectedOccupancy);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-16">
          <div className="absolute inset-0">
            <img
              src={pkg?.image}
              alt={pkg?.name}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/80 via-[#F4E4C1]/70 to-[#FFE5B4]/80"></div>
          </div>

          {/* Back button overlay */}
          <button
            onClick={() => setSelectedOccupancy('')}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white rounded-full shadow-lg transition-all hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm font-medium">Back to Packages</span>
          </button>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <span className="text-2xl">🕌</span>
                <span className="text-black font-semibold">{pkg?.name}</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold text-black mb-4"
            >
              Choose Your Room Type
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-black/80 max-w-2xl mx-auto"
            >
              Select the occupancy that best suits your travel preferences and budget
            </motion.p>
          </div>
        </div>

        {/* Occupancy Options */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(pkg?.pricing || {}).map(([type, price], index) => {
                const occupancyIcons = {
                  quad: '👥👥',
                  triple: '👥👤',
                  double: '👫',
                  single: '👤'
                };
                const occupancyDescriptions = {
                  quad: 'Share with 3 others - Most economical',
                  triple: 'Share with 2 others - Great value',
                  double: 'Share with 1 other - Comfortable',
                  single: 'Private room - Maximum privacy'
                };
                
                return (
                  <motion.button
                    key={type}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePackageSelect(pkg, type.charAt(0).toUpperCase() + type.slice(1))}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-left"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 capitalize group-hover:text-[#D4AF37] transition-colors">
                          {type} Occupancy
                        </h3>
                        <p className="text-sm text-gray-600">
                          {occupancyDescriptions[type as keyof typeof occupancyDescriptions]}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#D4AF37]">{price}</div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="capitalize">{type} sharing</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-semibold">Select</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Package Features Reminder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Package Includes:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                {pkg?.features.slice(0, 6).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/pilgrimages');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0">
          <img
            src="/Images/Hero Section/makkah-pilgrimage.jpeg"
            alt="Ramadan Umrah"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/90 via-[#F4E4C1]/80 to-[#FFE5B4]/90"></div>
        </div>

        {/* Back button overlay */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white rounded-full shadow-lg transition-all hover:shadow-xl"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm font-medium">Back to Pilgrimages</span>
        </button>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-black mb-6"
          >
            Ramadan Umrah 2026
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-black/80 max-w-3xl mx-auto mb-8"
          >
            Experience the blessed last 15/10 days of Ramadan in the holy cities with our comprehensive packages
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4 text-black/70">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>March 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Makkah & Medina</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Group Travel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-[#D4AF37]">{pkg.duration}</span>
                  </div>
                  {!pkg.flightIncluded && (
                    <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-semibold text-white">Flight Not Included</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pkg.dates}</p>
                  <p className="text-gray-600 mb-4 text-sm">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Package Includes:</h4>
                    <ul className="space-y-1 max-h-32 overflow-y-auto">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                          <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Pricing:</div>
                    <div className="space-y-1 text-sm">
                      {pkg.pricing.quad && (
                        <div className="flex justify-between">
                          <span>Quad:</span>
                          <span className="font-semibold text-[#D4AF37]">{pkg.pricing.quad}</span>
                        </div>
                      )}
                      {pkg.pricing.triple && (
                        <div className="flex justify-between">
                          <span>Triple:</span>
                          <span className="font-semibold text-[#D4AF37]">{pkg.pricing.triple}</span>
                        </div>
                      )}
                      {pkg.pricing.double && (
                        <div className="flex justify-between">
                          <span>Double:</span>
                          <span className="font-semibold text-[#D4AF37]">{pkg.pricing.double}</span>
                        </div>
                      )}
                      {pkg.pricing.single && (
                        <div className="flex justify-between">
                          <span>Single:</span>
                          <span className="font-semibold text-[#D4AF37]">{pkg.pricing.single}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => setSelectedOccupancy(pkg.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Book Package
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}