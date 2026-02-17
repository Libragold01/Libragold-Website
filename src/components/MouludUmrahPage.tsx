import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PilgrimageBookingForm } from './PilgrimageBookingForm';

interface MouludUmrahPageProps {
  onBack?: () => void;
  onFormSubmitted?: (details?: any) => void;
}

export function MouludUmrahPage({ onBack, onFormSubmitted }: MouludUmrahPageProps) {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const packages = [
    {
      name: 'Moulud Umrah',
      duration: '10 Days',
      price: { usd: 'From', naira: '₦3.8M' },
      features: ['Luxury accommodation', 'Guided tours', 'Transportation', 'Visa processing', 'Moulud celebration events', 'Spiritual guidance'],

    },
    {
      name: 'Moulud Umrah + 4 Days in Dubai',
      duration: '14 Days',
      price: { usd: 'From', naira: '₦4.9M' },
      features: ['Luxury accommodation', 'Guided tours', 'Transportation', 'Visa processing', 'Moulud celebration events', '4 days Dubai vacation', 'Dubai city tours', 'Desert adventures'],

    }
  ];



  const handleBackToPackages = () => {
    setSelectedPackage(null);
  };

  const handleBookPackage = (pkg: any) => {
    const packageDetails = {
      service: 'Moulud Umrah',
      package: pkg.name,
      priceType: 'Package',
      price: pkg.price
    };
    setSelectedPackage(packageDetails);
  };

  if (selectedPackage) {
    return (
      <PilgrimageBookingForm
        packageDetails={selectedPackage}
        onBack={handleBackToPackages}
        onFormSubmitted={onFormSubmitted}
      />
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
      <div className="relative overflow-hidden py-16 sm:py-32">
        <div className="absolute inset-0">
          <img
            src="/Images/Hero Section/makkah-pilgrimage.jpeg"
            alt="Moulud Umrah"
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
            className="text-6xl md:text-8xl font-bold text-black mb-8 leading-tight"
          >
            Moulud Umrah
            <span className="block text-5xl md:text-6xl mt-4">Packages</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-black/80 max-w-4xl mx-auto leading-relaxed mb-6"
          >
            Celebrate the birth of the Prophet Muhammad (PBUH) with our special Moulud Umrah packages. This unique pilgrimage offers a profound spiritual experience, allowing you to commemorate this significant event while performing Umrah.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-black/70 max-w-3xl mx-auto"
          >
            <span className="font-semibold">But that’s not all!</span> Extend your spiritual journey with an exciting Dubai vacation — Discover the vibrant city of Dubai, explore its stunning architecture, luxury shopping, desert adventures, creating an unforgettable experience.
          </motion.p>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{pkg.name}</h3>
                  <div className="text-[#D4AF37] font-semibold mb-2">{pkg.duration}</div>
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-gray-900">{pkg.price.usd}</div>
                    <div className="text-lg text-gray-600">{pkg.price.naira}</div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button
                    onClick={() => handleBookPackage(pkg)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg"
                  >
                    Book Package
                    <ArrowRight className="w-4 h-4" />
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