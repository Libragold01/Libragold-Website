import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { SEO } from './SEO';
import { apiService, ApiHotel, ApiRoomType } from '../services/api';

function formatPrice(rt: ApiRoomType): string {
  if (rt.priceNGN > 0) return `₦${rt.priceNGN.toLocaleString()}`;
  return `$${rt.priceUSD.toLocaleString()}`;
}

function renderStars(count: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < count ? 'text-[#D4AF37] fill-current' : 'text-gray-300'}`} />
  ));
}

export function HotelPage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<ApiHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const scrollToHotels = () => {
    document.getElementById('hotels-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    apiService.getHotels()
      .then(({ hotels: data }) => setHotels(data))
      .catch(() => setError('Failed to load hotels. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const makkahHotels = hotels.filter(h => h.country === 'Saudi Arabia' && h.location.toLowerCase().includes('makkah'));
  const medinaHotels = hotels.filter(h => h.country === 'Saudi Arabia' && h.location.toLowerCase().includes('medina'));
  const otherHotels = hotels.filter(h => !makkahHotels.includes(h) && !medinaHotels.includes(h));

  const allDisplayed = [...makkahHotels, ...medinaHotels, ...otherHotels];

  return (
    <>
      <SEO
        title="Hotel Booking - Makkah & Medina Hotels"
        description="Book premium hotels in Makkah and Medina for Ramadan Umrah 2026. Fairmont, Swissmaqam, Movenpick, Peninsula Worth and more luxury hotels near Haram with Iftar and Suhur included."
        canonical="/hotels"
        keywords="Makkah hotels, Medina hotels, Ramadan Umrah hotels, Fairmont Makkah, Movenpick Makkah, Peninsula Worth Medina, Haram hotels, Saudi Arabia hotels"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-20 sm:py-32">
          <div className="absolute inset-0">
            <img
              src="/Images/Hero Section/makkah-pilgrimage.jpeg"
              alt="Makkah Background"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/90 via-[#F4E4C1]/80 to-[#FFE5B4]/90"></div>
            <div className="absolute top-10 left-10 w-20 sm:w-40 h-20 sm:h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 sm:right-20 w-32 sm:w-60 h-32 sm:h-60 bg-white/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-20 sm:w-32 h-20 sm:h-32 bg-yellow-300/30 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6 sm:mb-8">
                <span className="text-xl sm:text-2xl">🕌</span>
                <span className="text-black font-semibold text-sm sm:text-base">Sacred Journey Accommodations</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-6 sm:mb-8 leading-tight"
            >
              Ramadan Umrah 2026
              <span className="block bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent text-2xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 sm:mt-4">
                Makkah &amp; Medina Hotels
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-xl md:text-2xl text-black/80 max-w-5xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2"
            >
              Experience the blessed last 10 days of Ramadan in Makkah and Medina with our premium hotel packages.
              Select accommodations include Iftar and Suhur meals for a complete spiritual journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0"
            >
              <button onClick={scrollToHotels} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                View All Hotels
              </button>
              <button onClick={scrollToHotels} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm text-black font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300">
                Book Now
              </button>
            </motion.div>
          </div>
        </div>

        {/* Hotels Section */}
        <div id="hotels-section" className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                Premium Accommodations
              </h2>
              <p className="text-base sm:text-xl text-gray-600">Handpicked hotels for your spiritual journey</p>
            </motion.div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                    <div className="h-48 sm:h-64 bg-gray-200" />
                    <div className="p-4 sm:p-6 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-full" />
                        <div className="h-4 bg-gray-100 rounded w-5/6" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                      <div className="h-10 bg-gray-200 rounded-full w-full mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-16">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#C4A030] transition-colors">
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {allDisplayed.map((hotel, index) => {
                  const roomTypes: ApiRoomType[] = Array.isArray(hotel.roomTypes) ? hotel.roomTypes : [];
                  const includesMeals = hotel.description.toLowerCase().includes('iftar') || hotel.description.toLowerCase().includes('suhur');

                  return (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      <div className="relative h-48 sm:h-64 overflow-hidden">
                        <img
                          src={hotel.image || '/Images/Hotels/placeholder.jpg'}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                          <div className="flex items-center gap-0.5 sm:gap-1">{renderStars(hotel.stars)}</div>
                        </div>
                        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-1.5 sm:gap-2 text-white">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium">{hotel.location}</span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                          {hotel.name}
                        </h3>

                        <div className="mb-4 space-y-1.5 sm:space-y-2">
                          {roomTypes.slice(0, 3).map((rt) => (
                            <div key={rt.type} className="flex justify-between items-center">
                              <span className="text-xs sm:text-sm text-gray-600">{rt.type}:</span>
                              <span className="font-semibold text-sm sm:text-base">{formatPrice(rt)}/person</span>
                            </div>
                          ))}
                          <div className="text-xs text-gray-500 mt-2">
                            {includesMeals ? 'Includes Iftar & Suhur' : 'Room Only'}
                          </div>
                        </div>

                        <motion.button
                          onClick={() => navigate(`/hotels/${hotel.slug}`)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                          Explore Hotel
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
