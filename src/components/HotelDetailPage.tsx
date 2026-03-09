import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Wifi, Car, Coffee, Utensils, Dumbbell, Waves, ArrowLeft } from 'lucide-react';
import { HotelBookingForm } from './HotelBookingForm';
import { SEO } from './SEO';

interface Hotel {
  id: string;
  name: string;
  stars: number;
  image: string;
  location: string;
  description: string;
  currency: 'USD' | 'NGN';
  includesMeals: boolean;
  pricing: {
    single?: { total: number; perPerson: number };
    singleDouble: { total: number; perPerson: number };
    triple: { total: number; perPerson: number };
    quad?: { total: number; perPerson: number };
  };
}

// MAKKAH HOTELS
const makkahHotels: Hotel[] = [
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
const medinaHotels: Hotel[] = [
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

// Combined hotel data
const hotelsData: Hotel[] = [...makkahHotels, ...medinaHotels];

export function HotelDetailPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();

  // Find the hotel by ID
  const hotel = hotelsData.find(h => h.id === hotelId);

  const [showNaira, setShowNaira] = useState(false);
  const [selectedPersons, setSelectedPersons] = useState<{[key: string]: number}>({});
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1 Guest'
  });

  // If hotel not found, show error
  if (!hotel) {
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

  const conversionRate = 1510; // USD to NGN

  // Format price based on hotel's currency
  const formatPrice = (total: number, perPerson: number) => {
    if (hotel.currency === 'NGN') {
      return {
        primary: `₦${total.toLocaleString()} total / ₦${perPerson.toLocaleString()} per person`,
        secondary: `$${Math.round(total / conversionRate).toLocaleString()} total / $${Math.round(perPerson / conversionRate).toLocaleString()} per person`
      };
    }
    return {
      primary: `$${total.toLocaleString()} total / $${perPerson.toLocaleString()} per person`,
      secondary: `₦${(total * conversionRate).toLocaleString()} total / ₦${(perPerson * conversionRate).toLocaleString()} per person`
    };
  };

  // Features based on whether meals are included
  const baseFeatures = hotel.includesMeals
    ? ['Iftar & Suhur included', 'Last 10 days of Ramadan', 'Premium location', 'Spiritual guidance']
    : ['Room only', 'Last 10 days of Ramadan', 'Strategic location', 'Self-catering'];

  // Define occupancy options with 2026 Ramadan pricing
  const occupancyTypes = [
    // Add Single occupancy if available
    ...(hotel.pricing.single ? [{
      type: 'Single Occupancy',
      priceUSD: formatPrice(hotel.pricing.single.total, hotel.pricing.single.perPerson).primary,
      priceNaira: formatPrice(hotel.pricing.single.total, hotel.pricing.single.perPerson).secondary,
      // Numeric values for payment calculation
      totalUSD: hotel.currency === 'USD' ? hotel.pricing.single.total : Math.round(hotel.pricing.single.total / conversionRate),
      perPersonUSD: hotel.currency === 'USD' ? hotel.pricing.single.perPerson : Math.round(hotel.pricing.single.perPerson / conversionRate),
      totalNGN: hotel.currency === 'NGN' ? hotel.pricing.single.total : Math.round(hotel.pricing.single.total * conversionRate),
      perPersonNGN: hotel.currency === 'NGN' ? hotel.pricing.single.perPerson : Math.round(hotel.pricing.single.perPerson * conversionRate),
      capacity: '1 guest',
      features: baseFeatures
    }] : []),
    {
      type: 'Single/Double Occupancy',
      priceUSD: formatPrice(hotel.pricing.singleDouble.total, hotel.pricing.singleDouble.perPerson).primary,
      priceNaira: formatPrice(hotel.pricing.singleDouble.total, hotel.pricing.singleDouble.perPerson).secondary,
      totalUSD: hotel.currency === 'USD' ? hotel.pricing.singleDouble.total : Math.round(hotel.pricing.singleDouble.total / conversionRate),
      perPersonUSD: hotel.currency === 'USD' ? hotel.pricing.singleDouble.perPerson : Math.round(hotel.pricing.singleDouble.perPerson / conversionRate),
      totalNGN: hotel.currency === 'NGN' ? hotel.pricing.singleDouble.total : Math.round(hotel.pricing.singleDouble.total * conversionRate),
      perPersonNGN: hotel.currency === 'NGN' ? hotel.pricing.singleDouble.perPerson : Math.round(hotel.pricing.singleDouble.perPerson * conversionRate),
      capacity: '1-2 guests',
      features: baseFeatures
    },
    {
      type: 'Triple Occupancy',
      priceUSD: formatPrice(hotel.pricing.triple.total, hotel.pricing.triple.perPerson).primary,
      priceNaira: formatPrice(hotel.pricing.triple.total, hotel.pricing.triple.perPerson).secondary,
      totalUSD: hotel.currency === 'USD' ? hotel.pricing.triple.total : Math.round(hotel.pricing.triple.total / conversionRate),
      perPersonUSD: hotel.currency === 'USD' ? hotel.pricing.triple.perPerson : Math.round(hotel.pricing.triple.perPerson / conversionRate),
      totalNGN: hotel.currency === 'NGN' ? hotel.pricing.triple.total : Math.round(hotel.pricing.triple.total * conversionRate),
      perPersonNGN: hotel.currency === 'NGN' ? hotel.pricing.triple.perPerson : Math.round(hotel.pricing.triple.perPerson * conversionRate),
      capacity: '3 guests',
      features: baseFeatures
    },
    // Add Quad occupancy if available
    ...(hotel.pricing.quad ? [{
      type: 'Quad Occupancy',
      priceUSD: formatPrice(hotel.pricing.quad.total, hotel.pricing.quad.perPerson).primary,
      priceNaira: formatPrice(hotel.pricing.quad.total, hotel.pricing.quad.perPerson).secondary,
      totalUSD: hotel.currency === 'USD' ? hotel.pricing.quad.total : Math.round(hotel.pricing.quad.total / conversionRate),
      perPersonUSD: hotel.currency === 'USD' ? hotel.pricing.quad.perPerson : Math.round(hotel.pricing.quad.perPerson / conversionRate),
      totalNGN: hotel.currency === 'NGN' ? hotel.pricing.quad.total : Math.round(hotel.pricing.quad.total * conversionRate),
      perPersonNGN: hotel.currency === 'NGN' ? hotel.pricing.quad.perPerson : Math.round(hotel.pricing.quad.perPerson * conversionRate),
      capacity: '4 guests',
      features: baseFeatures
    }] : [])
  ];

  const handleBooking = () => {
    if (!selectedRoomType) {
      alert('Please select an occupancy type first');
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingComplete = (_details?: any) => {
    // Navigate to home or show success
    navigate('/');
  };

  const handleBackToDetails = () => {
    setShowBookingForm(false);
  };

  const handleBack = () => {
    navigate('/hotels');
  };

  if (showBookingForm) {
    const selectedRoom = occupancyTypes.find(room => room.type === selectedRoomType);
    const numPersons = selectedPersons[selectedRoomType] || 1;

    return (
      <HotelBookingForm
        bookingData={{
          hotel,
          roomType: selectedRoomType,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: `${numPersons} person(s)`,
          numPersons,
          // Numeric pricing for payment
          totalUSD: selectedRoom?.totalUSD || 0,
          perPersonUSD: selectedRoom?.perPersonUSD || 0,
          totalNGN: selectedRoom?.totalNGN || 0,
          perPersonNGN: selectedRoom?.perPersonNGN || 0,
          // Display strings
          priceDisplay: selectedRoom?.priceUSD || '',
          priceDisplayNaira: selectedRoom?.priceNaira || ''
        }}
        onBack={handleBackToDetails}
        onBookingComplete={handleBookingComplete}
      />
    );
  }

  const amenities = [
    { icon: Wifi, name: 'Free WiFi' },
    { icon: Car, name: 'Parking' },
    { icon: Coffee, name: 'Coffee Shop' },
    { icon: Utensils, name: 'Restaurant' },
    { icon: Dumbbell, name: 'Fitness Center' },
    { icon: Waves, name: 'Pool' }
  ];

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < count ? 'text-[#D4AF37] fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <>
      <SEO
        title={hotel.name}
        description={`Book ${hotel.name} for Ramadan Umrah 2026. ${hotel.stars}-star hotel in ${hotel.location} with Iftar and Suhur included.`}
        canonical={`/hotels/${hotel.id}`}
        keywords={`${hotel.name}, Makkah hotel, Ramadan Umrah, Haram hotel`}
      />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"></div>

          {/* Back Button - Positioned top left over hero */}
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white rounded-full shadow-lg transition-all hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm font-medium">Back to Hotels</span>
          </button>

          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              {renderStars(hotel.stars)}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">{hotel.name}</h1>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-lg">{hotel.location}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">About {hotel.name}</h2>
                <p className="text-gray-600 leading-relaxed">
                  Experience luxury and comfort at {hotel.name}, strategically located in the heart of Makkah.
                  Our hotel offers world-class amenities and exceptional service to make your spiritual journey
                  memorable and comfortable. With stunning views of the Haram and modern facilities, we provide
                  the perfect sanctuary for pilgrims seeking both spiritual fulfillment and physical comfort.
                </p>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Hotel Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                        <amenity.icon className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Options */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ramadan 2026 Pricing</h2>
                  <button
                    onClick={() => setShowNaira(!showNaira)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {showNaira ? 'USD' : 'NGN'}
                  </button>
                </div>

                {/* Occupancy Options */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {occupancyTypes.map((option, index) => {
                    const maxPersons = option.type === 'Single Occupancy' ? 1 :
                                     option.type === 'Single/Double Occupancy' ? 2 :
                                     option.type === 'Triple Occupancy' ? 3 : 4;
                    const selectedCount = selectedPersons[option.type] || 1;

                    return (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className={`border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all ${
                          selectedRoomType === option.type
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                            : 'border-gray-200 hover:border-[#D4AF37]/50'
                        }`}
                        onClick={() => setSelectedRoomType(option.type)}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{option.type}</h3>
                          <div className="text-left sm:text-right">
                            <div className="text-lg sm:text-xl font-bold text-[#D4AF37]">
                              {showNaira ? option.priceNaira : option.priceUSD}
                            </div>
                            <div className="text-sm text-gray-500">{option.capacity}</div>
                          </div>
                        </div>

                        {selectedRoomType === option.type && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Number of persons:
                            </label>
                            <select
                              value={selectedCount}
                              onChange={(e) => setSelectedPersons(prev => ({
                                ...prev,
                                [option.type]: parseInt(e.target.value)
                              }))}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                            >
                              {Array.from({ length: maxPersons }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>{num} person{num > 1 ? 's' : ''}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <ul className="space-y-2">
                          {option.features.map((feature, idx) => (
                            <li key={idx} className="text-gray-600 text-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
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
