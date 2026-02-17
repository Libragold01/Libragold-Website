import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Users, Star } from 'lucide-react';
import { TourDetailPage } from './TourDetailPage';
import { TourFormPage } from './TourFormPage';
import { TourPaymentPage } from './TourPaymentPage';

interface TourPackagesPageProps {
  onFormSubmitted?: (details?: any) => void;
}

export function TourPackagesPage({ onFormSubmitted }: TourPackagesPageProps) {
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'form' | 'payment'>('list');
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  const tourPackages = [
    {
      name: 'Egypt Explorer',
      duration: '7 Days',
      price: { usd: '$1,200', naira: '₦1,800,000' },
      image: '/Images/Tour Cards/Egypt.jpeg',
      location: 'Cairo, Luxor, Aswan',
      rating: 4.8,
      features: ['Pyramids of Giza', 'Nile River Cruise', 'Valley of Kings', 'All meals included', 'Expert guide']
    },
    {
      name: 'Turkey Adventure',
      duration: '10 Days',
      price: { usd: '$1,800', naira: '₦2,700,000' },
      image: '/Images/Tour Cards/Turkey.jpeg',
      location: 'Istanbul, Cappadocia, Pamukkale',
      rating: 4.9,
      features: ['Hot air balloon ride', 'Hagia Sophia', 'Blue Mosque', 'Turkish baths', 'Cultural experiences']
    },
    {
      name: 'Qatar Luxury',
      duration: '5 Days',
      price: { usd: '$2,500', naira: '₦3,750,000' },
      image: '/Images/Tour Cards/Qatar.jpeg',
      location: 'Doha, Al Wakrah',
      rating: 4.7,
      features: ['Luxury hotels', 'Desert safari', 'Museum tours', 'Shopping experiences', 'Fine dining']
    },
    {
      name: 'Saudi Heritage',
      duration: '8 Days',
      price: { usd: '$1,600', naira: '₦2,400,000' },
      image: '/Images/Tour Cards/Saudi Arabia.jpeg',
      location: 'Riyadh, Jeddah, Al-Ula',
      rating: 4.6,
      features: ['Historical sites', 'Cultural tours', 'Traditional cuisine', 'Heritage villages', 'Modern attractions']
    },
    {
      name: 'South Africa Safari',
      duration: '12 Days',
      price: { usd: '$3,200', naira: '₦4,800,000' },
      image: '/Images/Tour Cards/South Africa.jpeg',
      location: 'Cape Town, Kruger, Johannesburg',
      rating: 4.9,
      features: ['Big Five safari', 'Wine tours', 'Table Mountain', 'Penguin colony', 'Cultural townships']
    },
    {
      name: 'Nigeria Discovery',
      duration: '6 Days',
      price: { usd: '$800', naira: '₦1,200,000' },
      image: '/Images/Tour Cards/Nigeria.jpeg',
      location: 'Lagos, Abuja, Calabar',
      rating: 4.5,
      features: ['Cultural festivals', 'Local cuisine', 'Historical sites', 'Art galleries', 'Music experiences']
    }
  ];

  const handleTourClick = (tour: any) => {
    setSelectedTour(tour);
    setCurrentView('details');
  };

  const handlePackageSelect = (packageType: string) => {
    const packageData = {
      tourName: selectedTour.name,
      packageType,
      price: selectedTour.price,
      duration: selectedTour.duration
    };
    setSelectedPackage(packageData);
    setCurrentView('form');
  };

  const handleFormSubmit = (formData: any) => {
    setBookingData(formData);
    setCurrentView('payment');
  };

  const handlePaymentSuccess = () => {
    setCurrentView('list');
    setSelectedTour(null);
    setSelectedPackage(null);
    setBookingData(null);
    onFormSubmitted?.(bookingData);
  };

  const handleBack = () => {
    if (currentView === 'payment') setCurrentView('form');
    else if (currentView === 'form') setCurrentView('details');
    else if (currentView === 'details') setCurrentView('list');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-[#D4AF37] fill-current' : 'text-gray-300'}`} />
    ));
  };

  if (currentView !== 'list') {
    return (
      <>
        {currentView === 'details' && selectedTour && (
          <TourDetailPage
            tour={selectedTour}
            onBack={handleBack}
            onBookTour={handlePackageSelect}
          />
        )}
        {currentView === 'form' && selectedPackage && (
          <TourFormPage
            tourPackage={selectedPackage}
            onBack={handleBack}
            onFormSubmit={handleFormSubmit}
          />
        )}
        {currentView === 'payment' && bookingData && (
          <TourPaymentPage
            bookingData={bookingData}
            onBack={handleBack}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-32">
        <div className="absolute inset-0">
          <img 
            src="/Images/Hero Section/The Lush and Luxurious Sanya EDITION on Hainan Island.jpeg" 
            alt="Tour Packages" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/90 via-[#F4E4C1]/80 to-[#FFE5B4]/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-8">
              <span className="text-2xl">✈️</span>
              <span className="text-black font-semibold">Curated Travel Experiences</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold text-black mb-8 leading-tight"
          >
            Tour Packages
            <span className="block bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent text-3xl sm:text-5xl md:text-6xl mt-4">
              Discover the World
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base sm:text-xl md:text-2xl text-black/80 max-w-5xl mx-auto leading-relaxed mb-10 px-4"
          >
            Embark on unforgettable journeys with our carefully crafted tour packages. 
            From cultural explorations to luxury getaways, we create memories that last a lifetime.
          </motion.p>
        </div>
      </div>

      {/* Tour Packages Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Featured Destinations
            </h2>
            <p className="text-xl text-gray-600">Choose your next adventure from our premium tour collection</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tourPackages.map((tour, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-[#D4AF37]">{tour.duration}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{tour.location}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(tour.rating)}
                    <span className="text-sm text-gray-600">({tour.rating})</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {tour.name}
                  </h3>
                  
                  <ul className="space-y-1 mb-4">
                    {tour.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-gray-600 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#D4AF37]">{tour.price.usd}</div>
                      <div className="text-lg text-gray-600">{tour.price.naira}</div>
                      <div className="text-xs text-gray-500 mt-1">+ Service Charge</div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => handleTourClick(tour)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>


    </>
  );
}