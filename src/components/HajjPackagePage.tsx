import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PilgrimageBookingForm } from './PilgrimageBookingForm';

interface HajjPackagePageProps {
  packageName?: string;
  onBack?: () => void;
  onFormSubmitted?: (details?: any) => void;
}

export function HajjPackagePage({ packageName, onBack, onFormSubmitted }: HajjPackagePageProps) {
  const navigate = useNavigate();
  const { tier } = useParams<{ tier: string }>();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  // Map URL slugs to package keys
  const slugToPackageKey: { [key: string]: string } = {
    'budget': 'Budget Hajj',
    'comfort': 'Comfort Hajj',
    'executive': 'Executive Hajj',
    'vip': 'VIP Hajj',
    'vvip': 'VVIP Hajj'
  };

  const packageData = {
    'Budget Hajj': {
      name: 'Budget Hajj 2026',
      duration: 'May 12/15 - June 2/4, 2026',
      itinerary: 'MEDINA: 13/14 - 18 May | MAKKAH: 18 - 31 May | MASHER: 25-29 May',
      priceOptions: [
        { type: 'QUAD', naira: '₦8.5M' },
        { type: 'TRIPLE', naira: '₦9M' },
        { type: 'DOUBLE', naira: '₦10M' }
      ],
      features: [
        'Hajj Visa',
        'Economy hotel in Makkah Misfala or Sharamonsur (18/25 mins to Haram)',
        'Economy hotel in Madina not far from Haram',
        'One meal daily',
        'Shared transportation',
        'Tent D in Mina & Arafat',
        'Collective guidance and lectures',
        'Travel/Health Insurance',
        'Economy class flight ticket'
      ],
      flightIncluded: true,
      note: 'Prices shown are for group travel only. Individual travelers pay additional cost.'
    },
    'Comfort Hajj': {
      name: 'Comfort Hajj 2026',
      duration: 'May 12/15 - June 2/4, 2026',
      itinerary: 'MEDINA: 13/14 - 18 May | MAKKAH: 18 - 31 May | MASHER: 25-29 May',
      priceOptions: [
        { type: 'QUAD', naira: '₦10M' },
        { type: 'TRIPLE', naira: '₦11M' },
        { type: 'DOUBLE', naira: '₦12.5M' }
      ],
      features: [
        'Hajj Visa',
        'Budget Hotel in Makkah, Alkhalil or Ajyad road (8/10 mins to Haram)',
        'Economy Hotel in Madina close to Haram',
        'Two meals daily',
        'Maximum of 4 in a room',
        'Fully Air condition transportation for interstate travels (Jed/Mak/Med)',
        'Ziara (tour of historical places) in Makkah and Madina',
        'Economy Tent \'D\' in Minna and Arafat with additional services',
        'Daily Spiritual Lectures and Guidance on performing all rites',
        'Economy class flight ticket',
        'Travel/Health Insurance'
      ],
      flightIncluded: true,
      upgrade: 'Upgrade to VIP A+ Kidana towers at additional cost of ₦7.5M',
      note: 'Prices shown are for group travel only. Individual travelers pay additional cost.'
    },
    'Executive Hajj': {
      name: 'Executive Hajj 2026',
      duration: 'May 15/17 - 30/31, 2026',
      itinerary: 'MEDINA: 15-18 May | SWISSOTEL MAKKAH: 18-25 May | MASHER: 25-30 May | AZIZIYA: 29-31 May',
      priceOptions: [
        { type: 'QUAD', naira: '₦15.5M' },
        { type: 'TRIPLE', naira: '₦16M' },
        { type: 'DOUBLE', naira: '₦17.5M' },
        { type: 'SINGLE', naira: '₦25M' }
      ],
      features: [
        'Hajj Visa',
        '4 star hotel in Madina with breakfast (15-18 May)',
        '5 star SWISSOTEL/SWISSMAQAM Makkah clock tower Hotel Buffet Breakfast and Dinner (18-25 May)',
        'Regular Tent \'D\' in Minna and Arafat with additional services (25-30 May)',
        '5 Star Hotel in Aziziya, Makkah (29-31 May)',
        'Airport Transfers with meet and greet',
        'Train service MED MAK',
        'Executive luxury transportation',
        'Ziara (tour of historical places) in Makkah and Madina',
        'Daily Spiritual Lectures and Guidance on performing all rites',
        'Travel/Health Insurance',
        'Economy flight ticket'
      ],
      flightIncluded: true,
      upgrade: 'VIP A+ Kidana towers available: Quad ₦23M | Triple ₦23.5M | Double ₦25M | Single ₦32.5M'
    },
    'VIP Hajj': {
      name: 'VIP Hajj 2026',
      duration: 'May 17/18 - 30/31, 2026',
      itinerary: 'MEDINA: 18-21 May | MAKKAH: 22-31 May | MASHER: 25-29 May',
      priceOptions: [
        { type: 'QUAD', naira: '₦26M' },
        { type: 'TRIPLE', naira: '₦26.5M' },
        { type: 'DOUBLE', naira: '₦30M' },
        { type: 'SINGLE', naira: '₦36M' }
      ],
      features: [
        'Hajj Visa',
        '4 star hotel in Madina with breakfast',
        '5 star SWISSOTEL/SWISSMAQAM Makkah clock tower Hotel Buffet Breakfast and Dinner',
        'VIP A+ Kidana towers in Minna and Arafat',
        'Airport Transfers with meet and greet',
        'Train service MED MAK',
        'Executive luxury transportation',
        'Ziara (tour of historical places) in Makkah and Madina',
        'Daily Spiritual Lectures and Guidance on performing all rites',
        'Travel/Health Insurance',
        'Economy flight ticket'
      ],
      flightIncluded: true
    },
    'VVIP Hajj': {
      name: 'VVIP Hajj 2026',
      duration: 'May 17/18 - 30/31, 2026',
      itinerary: 'MEDINA: 28-31 May | FAIRMONT MAKKAH: 31 May - 10 June',
      priceOptions: [
        { type: 'QUAD', naira: '₦27M' },
        { type: 'TRIPLE', naira: '₦29M' },
        { type: 'DOUBLE', naira: '₦33M' }
      ],
      features: [
        'Hajj Visa',
        'Airport meet & greet',
        '5 star Hotel in Medina (28-31 May)',
        'FAIRMONT MAKKAH CLOCK HOTEL (31 May - 10 June)',
        'Hotels with Buffet Breakfast and Dinner',
        'Executive luxury transportation',
        'Business class Train service MED MAK',
        'Ziara (tour of historical places) in Makkah and Madina',
        'VIP Tent \'A\' in Minna and Arafat with new improved services',
        'Spiritual Lectures and Guidance on performing all rites',
        'Excellent welfarism',
        'Travel/Health Insurance'
      ],
      flightIncluded: false,
      note: 'Package exclusive of flight ticket'
    }
  };

  // Get package key from URL tier or from prop
  const packageKey = tier ? slugToPackageKey[tier] : packageName;
  const currentPackage = packageKey ? packageData[packageKey as keyof typeof packageData] : null;

  const handleBookPackage = () => {
    if (!currentPackage) return;
    const selectedOption = currentPackage.priceOptions[selectedPrice];
    const packageDetails = {
      service: 'Hajj 2026',
      package: currentPackage.name,
      duration: currentPackage.duration,
      itinerary: currentPackage.itinerary,
      price: { naira: selectedOption.naira },
      priceType: selectedOption.type,
      features: currentPackage.features,
      upgrade: (currentPackage as any).upgrade,
      note: (currentPackage as any).note
    };
    setSelectedPackage(packageDetails);
  };

  const handleBackToPackages = () => {
    setSelectedPackage(null);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/pilgrimages');
    }
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

  if (!currentPackage) {
    return <div className="min-h-screen pt-20 flex items-center justify-center">Package not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      <div className="relative overflow-hidden py-16 sm:py-32">
        <div className="absolute inset-0">
          <img
            src="/Images/Hero Section/السياحة الدينية في السعودية_ تجربة العمرة والحج في مكة والمدينة.jpeg"
            alt={packageName}
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
          <span className="text-sm font-medium">Back to Hajj Packages</span>
        </button>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight"
          >
            {currentPackage.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-black/90 max-w-4xl mx-auto leading-relaxed mb-4"
          >
            <div className="bg-black/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold mb-2">{currentPackage.duration}</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{currentPackage.name}</h3>
              
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Occupancy Type:</h4>
                <div className="space-y-3">
                  {currentPackage.priceOptions.map((priceOption, index) => (
                    <label key={index} className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPrice === index ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 hover:border-[#D4AF37]/50'
                    }`}>
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
                  {currentPackage.features.map((feature, idx) => (
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