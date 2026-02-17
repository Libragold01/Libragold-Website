import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { SEO } from './SEO';

export function HotelPage() {
  const navigate = useNavigate();

  const scrollToHotels = () => {
    const hotelsElement = document.getElementById('hotels-section');
    if (hotelsElement) {
      hotelsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // MAKKAH HOTELS
  const makkahHotels = [
    {
      id: 'fairmont',
      name: "Fairmont Makkah Clock Hotel",
      stars: 5,
      image: "/Images/Hotels/Fairmont Makkah Clock Hotel.jpg",
      location: "Makkah",
      description: "Last 10 days of Ramadan with Iftar & Suhur",
      currency: 'USD',
      includesMeals: true,
      pricing: {
        singleDouble: { total: 20400, perPerson: 10200 },
        triple: { total: 22800, perPerson: 7600 }
      }
    },
    {
      id: 'swissmaqam',
      name: "Swissmaqam Hotel",
      stars: 5,
      image: "/Images/Hotels/Swissotel Al Maqam Hotel.jpg",
      location: "Makkah",
      description: "Last 10 days of Ramadan with Iftar & Suhur",
      currency: 'USD',
      includesMeals: true,
      pricing: {
        singleDouble: { total: 11800, perPerson: 5900 },
        triple: { total: 13700, perPerson: 4570 },
        quad: { total: 15600, perPerson: 3900 }
      }
    },
    {
      id: 'movenpick',
      name: "Movenpick Makkah Clock Hotel",
      stars: 5,
      image: "/Images/Hotels/Movenpick Makkah Clock Hotel.jfif",
      location: "Makkah",
      description: "Last 10 days of Ramadan with Iftar & Suhur",
      currency: 'USD',
      includesMeals: true,
      pricing: {
        singleDouble: { total: 10990, perPerson: 5495 },
        triple: { total: 13200, perPerson: 4400 },
        quad: { total: 15300, perPerson: 3825 }
      }
    },
    {
      id: 'al-shoada',
      name: "Al Shoada Hotel",
      stars: 5,
      image: "/Images/Hotels/Anjum Hotel Makkah.jpg",
      location: "Ajyad Road, Makkah (5-7 mins walk to Haram)",
      description: "Last 10 days of Ramadan with Iftar & Suhur",
      currency: 'USD',
      includesMeals: true,
      pricing: {
        singleDouble: { total: 6840, perPerson: 3420 },
        triple: { total: 7375, perPerson: 2460 },
        quad: { total: 7920, perPerson: 1980 }
      }
    },
    {
      id: 'badr-al-massa',
      name: "Badr Al Massa Hotel",
      stars: 3,
      image: "/Images/Hotels/Badr Al Massa Hotel.jpg",
      location: "Makkah (7-8 mins walk to Haram)",
      description: "Room only - Standard 3 star hotel - Last 10 days of Ramadan",
      currency: 'NGN',
      includesMeals: false,
      pricing: {
        single: { total: 6000000, perPerson: 6000000 },
        singleDouble: { total: 6000000, perPerson: 3000000 },
        triple: { total: 6000000, perPerson: 2000000 },
        quad: { total: 6000000, perPerson: 1500000 }
      }
    },
    {
      id: 'emaar-al-khair',
      name: "Emaar Al Khair Grand Hotel",
      stars: 2,
      image: "/Images/Hotels/Emaar Al Khair Grand Hotel.jpg",
      location: "Misfala Bridge, Makkah (15-18 mins walk to Haram)",
      description: "Room only - Economy hotel - Last 10 days of Ramadan",
      currency: 'NGN',
      includesMeals: false,
      pricing: {
        single: { total: 3800000, perPerson: 3800000 },
        singleDouble: { total: 3800000, perPerson: 1900000 },
        triple: { total: 3810000, perPerson: 1270000 },
        quad: { total: 3800000, perPerson: 950000 }
      }
    }
  ];

  // MEDINA HOTELS
  const medinaHotels = [
    {
      id: 'peninsula-worth',
      name: "Peninsula Worth Hotel",
      stars: 5,
      image: "/Images/Hotels/Peninsula Worth Hotel.jpg",
      location: "Medina (4-5 mins walk North of Haram)",
      description: "5-9 March (RAM 16-20) - Newest 5 star hotel in Medina - Complimentary airport pickup for groups of 3+",
      currency: 'USD',
      includesMeals: true,
      pricing: {
        singleDouble: { total: 1880, perPerson: 940 },
        triple: { total: 2100, perPerson: 700 },
        quad: { total: 2310, perPerson: 580 }
      }
    },
    {
      id: 'leader-muna-kareem',
      name: "Leader Muna Kareem Medina Hotel",
      stars: 4,
      image: "/Images/Hotels/Leader Muna Kareem Medina Hotel.jfif",
      location: "Medina (4-5 mins walk North of Haram)",
      description: "6-9 March (RAM 17-20) - Standard 4 star hotel - Complimentary airport pickup for groups of 3+",
      currency: 'USD',
      includesMeals: true,
      pricing: {
        singleDouble: { total: 1150, perPerson: 575 },
        triple: { total: 1330, perPerson: 445 },
        quad: { total: 1510, perPerson: 380 }
      }
    },
    {
      id: 'green-plaza',
      name: "Green Plaza Hotel",
      stars: 3,
      image: "/Images/Hotels/Green Plaza Hotel.jpg",
      location: "Medina (5 mins walk North of Haram)",
      description: "6-9 March (RAM 17-20) - Room only - Standard 3 star hotel - Complimentary airport pickup for groups of 3+",
      currency: 'NGN',
      includesMeals: false,
      pricing: {
        single: { total: 1400000, perPerson: 1400000 },
        singleDouble: { total: 1400000, perPerson: 700000 },
        triple: { total: 1410000, perPerson: 470000 },
        quad: { total: 1400000, perPerson: 350000 }
      }
    },
    {
      id: 'diyar-l-huda',
      name: "Diyar l Huda Hotel",
      stars: 2,
      image: "/Images/Hotels/Diyar l Huda Hotel.jpg",
      location: "Medina (Directly in front of Bab Salaam Gate of Haram)",
      description: "6-9 March (RAM 17-20) - Room only - Economy Hotel - Complimentary airport pickup for groups of 3+",
      currency: 'NGN',
      includesMeals: false,
      pricing: {
        single: { total: 1200000, perPerson: 1200000 },
        singleDouble: { total: 1200000, perPerson: 600000 },
        triple: { total: 1200000, perPerson: 400000 },
        quad: { total: 1200000, perPerson: 300000 }
      }
    }
  ];

  const hotels = [...makkahHotels, ...medinaHotels];

  const handleExploreHotel = (hotelId: string) => {
    navigate(`/hotels/${hotelId}`);
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < count ? 'text-[#D4AF37] fill-current' : 'text-gray-300'}`}
      />
    ));
  };

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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6 sm:mb-8">
                <span className="text-xl sm:text-2xl">🕌</span>
                <span className="text-black font-semibold text-sm sm:text-base">Sacred Journey Accommodations</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-6 sm:mb-8 leading-tight"
            >
              Ramadan Umrah 2026
              <span className="block bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent text-2xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 sm:mt-4">
                Makkah & Medina Hotels
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-xl md:text-2xl text-black/80 max-w-5xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2"
            >
              Experience the blessed last 10 days of Ramadan in Makkah and Medina with our premium hotel packages. Select accommodations include Iftar and Suhur meals for a complete spiritual journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0"
            >
              <button
                onClick={scrollToHotels}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                View All Hotels
              </button>
              <button
                onClick={scrollToHotels}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm text-black font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                Book Now
              </button>
            </motion.div>
          </div>
        </div>

        {/* Hotels Section */}
        <div id="hotels-section" className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                Premium Accommodations
              </h2>
              <p className="text-base sm:text-xl text-gray-600">Handpicked hotels for your spiritual journey</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {hotels.map((hotel, index) => (
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
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {renderStars(hotel.stars)}
                      </div>
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
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">Single/Double:</span>
                        <span className="font-semibold text-sm sm:text-base">
                          {hotel.currency === 'NGN' ? '₦' : '$'}
                          {hotel.pricing.singleDouble.perPerson.toLocaleString()}/person
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">Triple:</span>
                        <span className="font-semibold text-sm sm:text-base">
                          {hotel.currency === 'NGN' ? '₦' : '$'}
                          {hotel.pricing.triple.perPerson.toLocaleString()}/person
                        </span>
                      </div>
                      {hotel.pricing.quad && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-gray-600">Quad:</span>
                          <span className="font-semibold text-sm sm:text-base">
                            {hotel.currency === 'NGN' ? '₦' : '$'}
                            {hotel.pricing.quad.perPerson.toLocaleString()}/person
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        {hotel.includesMeals ? 'Includes Iftar & Suhur' : 'Room Only'}
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleExploreHotel(hotel.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      Explore Hotel
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
