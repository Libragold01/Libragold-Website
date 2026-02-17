import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, FileText, Clock, Users } from 'lucide-react';
import { VisaApplicationForm } from './VisaApplicationForm';

interface SaudiVisaPageProps {
  onBack: () => void;
  onFormSubmitted: (details?: any) => void;
}

export function SaudiVisaPage({ onBack, onFormSubmitted }: SaudiVisaPageProps) {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const packages = [
    {
      name: 'Quick Umrah Visa',
      price: '₦1,000,000',
      processing: 'Fast Processing',
      description: 'Quick processing for immediate Umrah travel needs',
      requirements: [
        'Confirmed return flight ticket',
        'Confirmed hotel reservations in the name of our Saudi Umrah Operator',
        'Scanned passport bio page',
        'Passport picture on white background'
      ]
    },
    {
      name: 'Tourist Visa',
      price: '₦950,000',
      processing: '2-3 weeks',
      validity: '90 days, single visit',
      description: 'Tourist visa valid for 90 days with single entry',
      requirements: [
        'Scanned passport bio page',
        'Passport picture on white background',
        'Flight ticket to be submitted 48 hours before travel date'
      ]
    },
    {
      name: 'Regular Umrah Visa Package',
      price: '₦850,000',
      priceWithPackage: '₦1,200,000 (Quad with hotel & transport)',
      processing: '2-3 weeks',
      description: 'Regular Umrah visa with optional hotel and transportation package',
      note: 'Pax must travel with group when booking with hotel & transport',
      requirements: [
        'Scanned passport bio page',
        'Flight reservation'
      ]
    }
  ];

  if (selectedPackage) {
    return (
      <VisaApplicationForm
        visaType={`Saudi Visa - ${selectedPackage.name}`}
        visaPrice={{ usd: selectedPackage.price, naira: selectedPackage.price }}
        requirements={selectedPackage.requirements}
        onBack={() => setSelectedPackage(null)}
        onFormSubmitted={onFormSubmitted}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      {/* Back Button - Fixed below navbar */}
      <div className="bg-white shadow-sm border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#D4AF37] bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Visa Services</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <img 
            src="/Images/Hero Section/makkah-pilgrimage.jpeg" 
            alt="Saudi Visa" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/90 via-[#F4E4C1]/80 to-[#FFE5B4]/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-black mb-6"
          >
            Saudi Arabia Visa Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-black/80 max-w-3xl mx-auto"
          >
            Choose from our comprehensive Saudi visa packages for Umrah and tourism
          </motion.p>
        </div>
      </div>

      {/* Packages */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] p-6 text-center">
                  <h3 className="text-2xl font-bold text-black mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-black mb-2">{pkg.price}</div>
                  {pkg.priceWithPackage && (
                    <div className="text-sm text-black/80">{pkg.priceWithPackage}</div>
                  )}
                  <div className="flex items-center justify-center gap-2 mt-3 text-black/80">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{pkg.processing}</span>
                  </div>
                  {pkg.validity && (
                    <div className="text-sm text-black/80 mt-1">{pkg.validity}</div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  {pkg.note && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{pkg.note}</p>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#D4AF37]" />
                      Requirements:
                    </h4>
                    <ul className="space-y-2">
                      {pkg.requirements.map((req, idx) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <motion.button
                    onClick={() => setSelectedPackage(pkg)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Important Information</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-2"></div>
                All passport pictures must be on white background
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-2"></div>
                Passport must be valid for at least 6 months from travel date
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-2"></div>
                Processing times may vary based on Saudi authorities
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-2"></div>
                Service charges apply in addition to visa fees
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
