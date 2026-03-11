import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Star, CheckCircle, ArrowRight, Crown, Sparkles, Award, Shield, Plane, Camera } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService, ApiTour, resolveImage } from '../services/api';

interface TourShape {
  name: string;
  duration: string;
  price: { usd: string; naira: string };
  image: string;
  location: string;
  rating: number;
  features: string[];
}

interface TourDetailPageProps {
  tour?: TourShape;
  onBack?: () => void;
  onBookTour?: (packageType: string) => void;
}

function apiToShape(t: ApiTour): TourShape {
  return {
    name: t.title,
    duration: t.duration,
    price: {
      usd: t.priceUSD ? `$${t.priceUSD.toLocaleString()}` : 'Contact Us',
      naira: t.priceNGN ? `₦${t.priceNGN.toLocaleString()}` : '',
    },
    image: resolveImage(t.image, '/Images/Hero Section/makkah-pilgrimage.jpeg'),
    location: t.destination,
    rating: 4.7,
    features: t.highlights ?? [],
  };
}

export function TourDetailPage({ tour: tourProp, onBack, onBookTour }: TourDetailPageProps) {
  const navigate = useNavigate();
  const { tourId } = useParams<{ tourId: string }>();
  const [fetchedTour, setFetchedTour] = useState<TourShape | null>(null);
  const [loading, setLoading] = useState(!tourProp);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (tourProp) return; // prop takes priority — no need to fetch
    if (!tourId) { setNotFound(true); setLoading(false); return; }
    apiService.getTour(tourId)
      .then(({ tour }) => setFetchedTour(apiToShape(tour)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [tourId, tourProp]);

  const handleBack = onBack ?? (() => navigate(-1));
  const handleBookTour = onBookTour ?? (() => {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading tour details...</p>
        </div>
      </div>
    );
  }

  const tour = tourProp ?? fetchedTour;

  if (notFound || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Tour not found.</p>
          <button onClick={() => navigate('/tours')} className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors">
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  const tourImage = resolveImage(tour.image, '/Images/Hero Section/makkah-pilgrimage.jpeg');

  const packages = [
    {
      type: 'Standard',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      popular: false,
      price: { usd: tour.price.usd, naira: tour.price.naira },
      features: ['3-star accommodation', 'Breakfast included', 'Group tours', 'Airport transfers', 'Local guide', 'Travel insurance']
    },
    {
      type: 'Premium',
      icon: Award,
      gradient: 'from-[#D4AF37] to-yellow-500',
      popular: true,
      price: {
        usd: `$${parseInt(tour.price.usd.replace('$', '').replace(/,/g, '')) + 500 || 0}`,
        naira: tour.price.naira ? `₦${(parseInt(tour.price.naira.replace('₦', '').replace(/,/g, '')) + 755000).toLocaleString()}` : '',
      },
      features: ['4-star accommodation', 'Half board meals', 'Private tours', 'Premium transfers', 'City tours', 'Welcome dinner']
    },
    {
      type: 'Luxury',
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      popular: false,
      price: {
        usd: `$${parseInt(tour.price.usd.replace('$', '').replace(/,/g, '')) + 1000 || 0}`,
        naira: tour.price.naira ? `₦${(parseInt(tour.price.naira.replace('₦', '').replace(/,/g, '')) + 1510000).toLocaleString()}` : '',
      },
      features: ['5-star accommodation', 'Full board meals', 'Private guide', 'Luxury transfers', 'Exclusive experiences', 'Spa access']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-10 w-6 h-6 text-[#D4AF37] opacity-20 animate-pulse" />
        <Star className="absolute top-40 right-20 w-4 h-4 text-yellow-400 opacity-30 animate-bounce" />
        <Plane className="absolute bottom-32 left-20 w-8 h-8 text-[#D4AF37] opacity-20" />
        <Camera className="absolute top-60 left-1/4 w-5 h-5 text-yellow-500 opacity-25 animate-pulse" />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10" />
        <img src={tourImage} alt={tour.name} className="w-full h-96 object-cover" />

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <button onClick={handleBack} className="flex items-center gap-2 text-white/90 hover:text-white mb-6 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Tours
            </button>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-white">
              <div className="flex items-center gap-2 mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(tour.rating) ? 'text-[#D4AF37] fill-current' : 'text-white/50'}`} />
                ))}
                <span className="text-white/90 font-medium">({tour.rating}) • Verified Tour</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-[#D4AF37] bg-clip-text text-transparent">
                {tour.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  <span>{tour.duration}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tour Highlights */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-[#D4AF37] to-gray-900 bg-clip-text text-transparent mb-4">
              Experience Highlights
            </h2>
            <p className="text-xl text-gray-600">Discover what makes this journey unforgettable</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(tour.features ?? []).map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-[#D4AF37]/10"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature}</h3>
                <div className="w-full h-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-full opacity-20" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Packages Section */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-[#D4AF37] to-gray-900 bg-clip-text text-transparent mb-4">
            Choose Your Experience
          </h2>
          <p className="text-xl text-gray-600">Select the perfect package for your dream journey</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const IconComponent = pkg.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 ${pkg.popular ? 'ring-4 ring-[#D4AF37] ring-opacity-50' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black text-center py-2 font-bold text-sm">
                    🌟 MOST POPULAR
                  </div>
                )}

                <div className={`relative h-32 bg-gradient-to-br ${pkg.gradient} flex items-center justify-center ${pkg.popular ? 'mt-8' : ''}`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                </div>

                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{pkg.type} Package</h3>
                    <div className="text-3xl font-bold text-[#D4AF37] mb-1">{pkg.price.usd}</div>
                    <div className="text-xl text-gray-600">{pkg.price.naira}</div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-black" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => handleBookTour(pkg.type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black hover:shadow-2xl'
                        : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-[#D4AF37] hover:to-yellow-500 hover:text-black'
                    }`}
                  >
                    Book {pkg.type} Package
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-yellow-500/10 rounded-3xl p-12 border border-[#D4AF37]/20">
            <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready for Your Adventure?</h3>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who have experienced the magic of {tour.name} with LibraGold
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span>Secure Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>Best Price Guarantee</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
