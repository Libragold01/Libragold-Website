import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { TourDetailPage } from './TourDetailPage';
import { TourFormPage } from './TourFormPage';
import { TourPaymentPage } from './TourPaymentPage';
import { apiService, ApiTour } from '../services/api';
import { SEO } from './SEO';

function toTourShape(t: ApiTour) {
  return {
    name: t.title,
    slug: t.slug,
    duration: t.duration,
    price: {
      usd: t.priceUSD ? `$${t.priceUSD.toLocaleString()}` : 'Contact Us',
      naira: t.priceNGN ? `₦${t.priceNGN.toLocaleString()}` : '',
    },
    image: t.image || '/Images/Tour Cards/placeholder.jpeg',
    location: t.destination,
    rating: 4.7,
    features: t.highlights,
    description: t.description,
    includes: t.includes,
    departureDate: t.departureDate,
    maxGroupSize: t.maxGroupSize,
    requiresVisa: t.requiresVisa,
  };
}

interface TourPackagesPageProps {
  onFormSubmitted?: (details?: any) => void;
}

export function TourPackagesPage({ onFormSubmitted }: TourPackagesPageProps) {
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'form' | 'payment'>('list');
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [apiTours, setApiTours] = useState<ReturnType<typeof toTourShape>[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    apiService.getTours()
      .then(({ tours }) => setApiTours(tours.map(toTourShape)))
      .catch(() => setFetchError('Failed to load tour packages. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const tourPackages = apiTours;

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
      <SEO
        title="Tour Packages — Libragold Group"
        description="Explore our curated tour packages to Egypt, Turkey, Qatar, Saudi Arabia, South Africa and Nigeria. Book unforgettable travel experiences with Libragold Group."
        canonical="/tours"
        keywords="tour packages Nigeria, Egypt tours, Turkey tours, South Africa tours, holiday packages Nigeria"
      />
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

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, s) => <div key={s} className="w-4 h-4 bg-gray-200 rounded-full" />)}
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-5/6" />
                      <div className="h-3 bg-gray-100 rounded w-4/6" />
                    </div>
                    <div className="h-16 bg-gray-100 rounded-lg" />
                    <div className="h-11 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {fetchError && (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">{fetchError}</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#C4A030] transition-colors">
                Retry
              </button>
            </div>
          )}
          {!loading && !fetchError && (
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
          )}
        </div>
      </div>
    </div>


    </>
  );
}