import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowLeft, Wifi, Car, Coffee, Utensils, Dumbbell, Waves, ShieldCheck } from 'lucide-react';
import { HotelBookingForm } from './HotelBookingForm';
import { SEO } from './SEO';
import { apiService, ApiHotel, resolveImage } from '../services/api';

const AMENITY_ICONS: Record<string, React.ElementType> = {
  wifi: Wifi, parking: Car, coffee: Coffee, restaurant: Utensils,
  fitness: Dumbbell, gym: Dumbbell, pool: Waves, swimming: Waves,
};

function amenityIcon(name: string): React.ElementType {
  const key = name.toLowerCase();
  for (const [k, Icon] of Object.entries(AMENITY_ICONS)) {
    if (key.includes(k)) return Icon;
  }
  return ShieldCheck;
}

function renderStars(count: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-5 h-5 ${i < count ? 'text-[#D4AF37] fill-current' : 'text-gray-300'}`} />
  ));
}

export function HotelDetailPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<ApiHotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showNaira, setShowNaira] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedPersons, setSelectedPersons] = useState<Record<string, number>>({});
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (!hotelId) return;
    setLoading(true);
    apiService.getHotel(hotelId)
      .then(({ hotel: h }) => setHotel(h))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [hotelId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h1>
          <p className="text-gray-600 mb-6">The hotel you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/hotels')}
            className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!selectedRoomType) {
      alert('Please select a room type first');
      return;
    }
    setShowBookingForm(true);
  };

  if (showBookingForm) {
    const room = hotel.roomTypes.find(r => r.type === selectedRoomType);
    const numPersons = selectedPersons[selectedRoomType] || 1;
    return (
      <HotelBookingForm
        bookingData={{
          hotel,
          roomType: selectedRoomType,
          checkIn: '',
          checkOut: '',
          guests: `${numPersons} person(s)`,
          numPersons,
          totalUSD: room?.priceUSD || 0,
          perPersonUSD: room ? Math.round(room.priceUSD / Math.max(room.capacity, 1)) : 0,
          totalNGN: room?.priceNGN || 0,
          perPersonNGN: room ? Math.round(room.priceNGN / Math.max(room.capacity, 1)) : 0,
          priceDisplay: room ? `$${room.priceUSD.toLocaleString()} total` : '',
          priceDisplayNaira: room ? `₦${room.priceNGN.toLocaleString()} total` : '',
        }}
        onBack={() => setShowBookingForm(false)}
        onBookingComplete={() => navigate('/')}
      />
    );
  }

  const heroImage = resolveImage(hotel.image, '/Images/Hotels/Fairmont Makkah Clock Hotel.jpg');

  return (
    <>
      <SEO
        title={hotel.name}
        description={`Book ${hotel.name}. ${hotel.stars}-star hotel in ${hotel.location}.`}
        canonical={`/hotels/${hotel.slug}`}
        keywords={`${hotel.name}, ${hotel.location} hotel, Umrah hotel, Haram hotel`}
      />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero */}
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
          <img src={heroImage} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
          <button
            onClick={() => navigate('/hotels')}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white rounded-full shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm font-medium">Back to Hotels</span>
          </button>
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 text-white">
            <div className="flex items-center gap-1 mb-2">{renderStars(hotel.stars)}</div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">{hotel.name}</h1>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-lg">{hotel.location}{hotel.distanceFromHaram ? ` · ${hotel.distanceFromHaram} from Haram` : ''}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* About */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">About {hotel.name}</h2>
                <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
              </div>

              {/* Amenities */}
              {hotel.amenities.length > 0 && (
                <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Hotel Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    {hotel.amenities.map((amenity, i) => {
                      const Icon = amenityIcon(amenity);
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Room types / pricing */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pricing</h2>
                  <button
                    onClick={() => setShowNaira(!showNaira)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    Show {showNaira ? 'USD' : 'NGN'}
                  </button>
                </div>

                {hotel.roomTypes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No room types listed. Contact us for pricing.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {hotel.roomTypes.map((room, i) => {
                      const selectedCount = selectedPersons[room.type] || 1;
                      return (
                        <motion.div
                          key={i}
                          whileHover={{ y: -5 }}
                          className={`border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all ${
                            selectedRoomType === room.type
                              ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                              : 'border-gray-200 hover:border-[#D4AF37]/50'
                          }`}
                          onClick={() => setSelectedRoomType(room.type)}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{room.type}</h3>
                            <div className="text-left sm:text-right">
                              <div className="text-lg sm:text-xl font-bold text-[#D4AF37]">
                                {showNaira
                                  ? `₦${room.priceNGN.toLocaleString()}`
                                  : `$${room.priceUSD.toLocaleString()}`}
                              </div>
                              <div className="text-sm text-gray-500">Up to {room.capacity} guest{room.capacity !== 1 ? 's' : ''}</div>
                            </div>
                          </div>

                          {selectedRoomType === room.type && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Number of persons:</label>
                              <select
                                value={selectedCount}
                                onChange={(e) => setSelectedPersons(prev => ({ ...prev, [room.type]: parseInt(e.target.value) }))}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                              >
                                {Array.from({ length: room.capacity }, (_, idx) => idx + 1).map(n => (
                                  <option key={n} value={n}>{n} person{n > 1 ? 's' : ''}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg lg:sticky lg:top-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Book Your Stay</h3>
                {selectedRoomType && (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Selected:</div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{selectedRoomType}</div>
                    {selectedPersons[selectedRoomType] && (
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        {selectedPersons[selectedRoomType]} person(s)
                      </div>
                    )}
                  </div>
                )}
                <motion.button
                  onClick={handleBooking}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-bold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg text-sm sm:text-base"
                >
                  Book Now
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
