import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { PilgrimageBookingForm } from './PilgrimageBookingForm';

interface BudgetHajjPageProps {
  onBack: () => void;
  onFormSubmitted?: (details?: any) => void;
}

export function BudgetHajjPage({ onBack, onFormSubmitted }: BudgetHajjPageProps) {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  const packageData = {
    name: 'Budget Hajj 2026',
    duration: 'May 12-15 to June 2-4, 2026',
    priceOptions: [
      { type: 'QUAD', naira: '₦8.5M' },
      { type: 'TRIPLE', naira: '₦9M' },
      { type: 'DOUBLE', naira: '₦10M' }
    ],
    features: [
      'Hajj Visa',
      'Economy hotel in Makkah (18-25 mins to Haram)',
      'Economy hotel in Medina',
      'One meal daily',
      'Shared transportation',
      'Tent D in Mina & Arafat',
      'Collective guidance and lectures',
      'Travel/health insurance',
      'Economy class flight ticket'
    ]
  };

  const handleBookPackage = () => {
    const selectedPriceOption = packageData.priceOptions[selectedPrice];
    const packageDetails = {
      service: 'Budget Hajj 2026',
      package: packageData.name,
      priceType: selectedPriceOption.type,
      price: selectedPriceOption
    };
    setSelectedPackage(packageDetails);
  };

  const handleBackToPackages = () => {
    setSelectedPackage(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Hajj Packages
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden py-32">
        <div className="absolute inset-0">
          <img 
            src="/Images/Hero Section/السياحة الدينية في السعودية_ تجربة العمرة والحج في مكة والمدينة.jpeg" 
            alt="Budget Hajj" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/90 via-[#F4E4C1]/80 to-[#FFE5B4]/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight"
          >
            Budget Hajj 2026
            <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 text-black/80">Affordable Pilgrimage</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-black/90 max-w-4xl mx-auto leading-relaxed mb-4"
          >
            <div className="bg-black/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold mb-2">{packageData.duration}</div>
              <div className="text-lg md:text-xl">Essential Hajj services with group travel benefits</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{packageData.name}</h3>
              
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Occupancy Type:</h4>
                <div className="space-y-3">
                  {packageData.priceOptions.map((priceOption, index) => (
                    <label key={index} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="price"
                          checked={selectedPrice === index}
                          onChange={() => setSelectedPrice(index)}
                          className="text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <div className="font-semibold text-gray-900">{priceOption.type}</div>
                      </div>
                      <div className="text-xl font-bold text-[#D4AF37]">{priceOption.naira}</div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Package Includes:</h4>
                <ul className="space-y-3">
                  {packageData.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <motion.button
                onClick={handleBookPackage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-bold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg"
              >
                Book Package
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}