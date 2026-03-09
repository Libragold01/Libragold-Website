import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ArrowLeft, Calendar, MapPin, Users, Plane, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PilgrimageBookingForm } from './PilgrimageBookingForm';
import { SEO } from './SEO';

interface HajjPageProps {
  onBack?: () => void;
  onFormSubmitted?: (details?: any) => void;
}

export function HajjPage({ onBack, onFormSubmitted }: HajjPageProps) {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const packages = [
    {
      name: 'Budget Hajj 2027',
      duration: '21-23 Days',
      dates: 'Registration Closes: Nov 30th, 2026',
      travelType: 'General',
      itinerary: 'MEDINA: 13/14 - 18 May | MAKKAH: 18 - 31 May | MASHER: 25-29 May',
      occupancy: [
        { type: 'Quad', price: '₦8.5M' },
        { type: 'Triple', price: '₦9M' },
        { type: 'Double', price: '₦10M' }
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
    {
      name: 'Comfort Hajj 2027',
      duration: '21-23 Days',
      dates: 'Registration Closes: Nov 30th, 2026',
      travelType: 'General',
      itinerary: 'MEDINA: 13/14 - 18 May | MAKKAH: 18 - 31 May | MASHER: 25-29 May',
      occupancy: [
        { type: 'Quad', price: '₦10M' },
        { type: 'Triple', price: '₦11M' },
        { type: 'Double', price: '₦12.5M' }
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
    {
      name: 'Executive Hajj 2027',
      duration: '15-16 Days',
      dates: 'Registration Closes: Nov 30th, 2026',
      travelType: 'General',
      itinerary: 'MEDINA: 15-18 May | SWISSOTEL MAKKAH: 18-25 May | MASHER: 25-30 May | AZIZIYA: 29-31 May',
      occupancy: [
        { type: 'Quad', price: '₦15.5M' },
        { type: 'Triple', price: '₦16M' },
        { type: 'Double', price: '₦17.5M' },
        { type: 'Single', price: '₦25M' }
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
    {
      name: 'VIP Hajj 2027',
      duration: '14 Days',
      dates: 'Registration Closes: Nov 30th, 2026',
      travelType: 'VIP',
      itinerary: 'MEDINA: 18-21 May | MAKKAH: 22-31 May | MASHER: 25-29 May',
      occupancy: [
        { type: 'Quad', price: '₦26M' },
        { type: 'Triple', price: '₦26.5M' },
        { type: 'Double', price: '₦30M' },
        { type: 'Single', price: '₦36M' }
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
    {
      name: 'VVIP Hajj 2027',
      duration: '14 Days',
      dates: 'Registration Closes: Nov 30th, 2026',
      travelType: 'VIP',
      itinerary: 'MEDINA: 28-31 May | FAIRMONT MAKKAH: 31 May - 10 June',
      occupancy: [
        { type: 'Quad', price: '₦27M' },
        { type: 'Triple', price: '₦29M' },
        { type: 'Double', price: '₦33M' }
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
  ];

  const handleBookPackage = (pkg: any) => {
    const packageDetails = {
      service: 'Hajj 2027',
      package: pkg.name,
      duration: pkg.dates,
      itinerary: pkg.itinerary,
      occupancy: pkg.occupancy,
      features: pkg.features,
      upgrade: pkg.upgrade,
      note: pkg.note
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
        onFormSubmitted={onFormSubmitted || (() => {})}
      />
    );
  }

  return (
    <>
      <SEO
        title="Hajj 2027 — Libragold Group"
        description="Plan your Hajj 2027 with Libragold Group. Comprehensive Hajj packages including premium and budget options for Nigerian pilgrims."
        canonical="/pilgrimages/hajj"
        keywords="Hajj 2027, Hajj Nigeria 2027, Hajj packages Nigeria, pilgrimage 2027, Makkah Medina Hajj"
      />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0">
          <img
            src="/Images/Hero Section/makkah-pilgrimage.jpeg"
            alt="Hajj 2027"
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
            Hajj 2027
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-black/80 max-w-3xl mx-auto mb-8"
          >
            Complete your spiritual obligation with our comprehensive Hajj packages. From Budget to VVIP, we have the perfect package for your sacred journey.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4 text-black/70">
            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">
              <Calendar className="w-5 h-5" />
              <span>May - June 2027</span>
            </div>
            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="w-5 h-5" />
              <span>Makkah & Medina</span>
            </div>
            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">
              <Users className="w-5 h-5" />
              <span>Group Travel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Schedule Info */}
      <div className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Plane className="w-5 h-5 text-[#D4AF37]" />
                General Travel Schedule
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Travel:</strong> 12/13 May | <strong>Return:</strong> 1/2/3 June</p>
                <p><strong>MEDINA:</strong> 13/14 - 18 May</p>
                <p><strong>MAKKAH:</strong> 18 - 31 May</p>
                <p><strong>MASHER:</strong> 25-29 May</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Plane className="w-5 h-5 text-[#D4AF37]" />
                VIP Travel Schedule
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Travel:</strong> 17/18 May | <strong>Return:</strong> 31 May</p>
                <p><strong>MEDINA:</strong> 18-21 May</p>
                <p><strong>MAKKAH:</strong> 22-31 May</p>
                <p><strong>MASHER:</strong> 25-29 May</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hajj Seminar Notice */}
      <div className="py-4 bg-[#D4AF37]/10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-800">
            <Clock className="w-4 h-4 inline mr-2" />
            <strong>Hajj Seminar:</strong> Sunday, 22nd March - 10 May, 2027
          </p>
        </div>
      </div>

      {/* Packages */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Hajj Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Choose from our range of carefully curated Hajj packages designed to meet every budget and comfort level</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#D4AF37] to-[#F4E4C1]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">🕋</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-[#D4AF37]">{pkg.duration}</span>
                  </div>
                  <div className={`absolute top-4 left-4 ${pkg.travelType === 'VIP' ? 'bg-purple-500' : 'bg-blue-500'} rounded-full px-3 py-1`}>
                    <span className="text-xs font-semibold text-white">{pkg.travelType}</span>
                  </div>
                  {!pkg.flightIncluded && (
                    <div className="absolute bottom-4 left-4 bg-red-500 rounded-full px-3 py-1">
                      <span className="text-xs font-semibold text-white">Flight Not Included</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-sm text-[#D4AF37] font-medium mb-2">{pkg.dates}</p>
                  <p className="text-xs text-gray-600 mb-4">{pkg.itinerary}</p>

                  {/* Pricing */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-2">Pricing (per person):</div>
                    <div className="space-y-1 text-sm">
                      {pkg.occupancy.map((occ, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-gray-600">{occ.type}:</span>
                          <span className="font-semibold text-[#D4AF37]">{occ.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Package Includes:</div>
                    <ul className="space-y-1 max-h-32 overflow-y-auto">
                      {pkg.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="text-gray-600 text-xs flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {pkg.features.length > 5 && (
                        <li className="text-[#D4AF37] text-xs font-medium">+ {pkg.features.length - 5} more...</li>
                      )}
                    </ul>
                  </div>

                  {/* Upgrade/Note */}
                  {pkg.upgrade && (
                    <div className="mb-3 p-2 bg-yellow-50 rounded-lg text-xs text-yellow-800">
                      💡 {pkg.upgrade}
                    </div>
                  )}
                  {pkg.note && (
                    <div className="mb-3 p-2 bg-blue-50 rounded-lg text-xs text-blue-800">
                      📝 {pkg.note}
                    </div>
                  )}

                  <motion.button
                    onClick={() => handleBookPackage(pkg)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl"
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

      {/* Important Notes Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3">General Notes</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Budget and Comfort package prices are for group travel only</li>
                <li>• Individual travelers pay additional cost</li>
                <li>• VIP Kidana towers upgrade available for Comfort and Executive packages</li>
                <li>• LibragoldPSS (Pay Small Small) payment plan available</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3">Flight Information</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Booking open for flight of choice</li>
                <li>• First and Business class available on request</li>
                <li>• Book early to avoid rush period</li>
                <li>• VVIP package is exclusive of flight ticket</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Send in your passports for Visa processing early</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:08038176535"
                className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors"
              >
                Call: 08038176535
              </a>
              <a
                href="https://libragoldgroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
