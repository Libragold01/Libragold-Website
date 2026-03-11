import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PilgrimageBookingForm } from './PilgrimageBookingForm';
import { apiService, ApiPilgrimage } from '../services/api';
import { SEO } from './SEO';

interface DecemberUmrahPageProps {
  onBack?: () => void;
  onFormSubmitted?: (details?: any) => void;
}

function fmtNaira(n: number): string {
  const m = n / 1_000_000;
  return `₦${parseFloat(m.toFixed(3))}M`;
}

interface PriceOption {
  type: string;
  naira: string;
}

interface LocalPackage {
  name: string;
  duration: string;
  flight: string;
  priceOptions: PriceOption[];
  features: string[];
  popular: boolean;
}

function apiToPkg(p: ApiPilgrimage): LocalPackage {
  return {
    name: p.title,
    duration: p.duration,
    flight: 'Qatar Airways',
    priceOptions: p.occupancyOptions.map(o => ({
      type: o.type.toUpperCase(),
      naira: fmtNaira(o.priceNGN),
    })),
    features: p.features,
    popular: p.isFeatured,
  };
}

export function DecemberUmrahPage({ onBack, onFormSubmitted }: DecemberUmrahPageProps) {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedPrices, setSelectedPrices] = useState<{ [key: string]: number }>({});
  const [packages, setPackages] = useState<LocalPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getPilgrimages()
      .then(data => {
        const filtered = data
          .filter(p => p.season === 'December')
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(apiToPkg);
        setPackages(filtered);
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  const handleBookPackage = (pkg: LocalPackage, priceIndex: number) => {
    const selectedPrice = pkg.priceOptions[priceIndex];
    const packageDetails = {
      service: 'December Umrah',
      package: pkg.name,
      priceType: selectedPrice.type,
      price: selectedPrice
    };
    setSelectedPackage(packageDetails);
  };

  const handlePriceSelect = (packageIndex: number, priceIndex: number) => {
    setSelectedPrices(prev => ({ ...prev, [packageIndex]: priceIndex }));
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

  return (
    <>
      <SEO
        title="December Umrah Package — Libragold Group"
        description="Book your December Umrah package with Libragold Group. Affordable packages with flights, hotels, and guided spiritual journey to Makkah and Medina."
        canonical="/pilgrimages/december-umrah"
        keywords="December Umrah, Umrah December 2025, Umrah Nigeria, Qatar Airways Umrah"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
        <div className="relative overflow-hidden py-16 sm:py-32">
          <div className="absolute inset-0">
            <img
              src="/Images/Hero Section/makkah-pilgrimage.jpeg"
              alt="December Umrah"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/90 via-[#F4E4C1]/80 to-[#FFE5B4]/90"></div>
          </div>

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
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight"
            >
              LIBRAGOLD DECEMBER UMRAH
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 text-black/80">+ DOHA Funcation</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-black/90 max-w-4xl mx-auto leading-relaxed mb-4"
            >
              <div className="bg-black/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-2xl md:text-3xl font-bold mb-2">22/24 Dec - 4/7 Jan, 2026</div>
                <div className="text-lg md:text-xl">Spiritual journey with Qatar Airways + Optional Doha Extension</div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {[0, 1, 2].map(i => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                    <div className="p-6 lg:p-8 space-y-4">
                      <div className="h-7 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                      </div>
                      <div className="h-12 bg-gray-200 rounded-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${pkg.popular ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20' : 'border-gray-100'} relative`}
                  >
                    <div className="p-6 lg:p-8">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 mt-2">{pkg.name}</h3>
                      <div className="text-[#D4AF37] font-semibold mb-2">{pkg.duration}</div>
                      <div className="text-sm text-gray-600 mb-4">✈️ {pkg.flight}</div>
                      <div className="mb-6">
                        <div className="space-y-3">
                          {pkg.priceOptions.map((priceOption, priceIndex) => (
                            <label key={priceIndex} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name={`price-${index}`}
                                  checked={selectedPrices[index] === priceIndex}
                                  onChange={() => handlePriceSelect(index, priceIndex)}
                                  className="text-[#D4AF37] focus:ring-[#D4AF37]"
                                />
                                <div>
                                  <div className="font-semibold text-gray-900">{priceOption.type}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-[#D4AF37]">{priceOption.naira}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <motion.button
                        onClick={() => handleBookPackage(pkg, selectedPrices[index] || 0)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={selectedPrices[index] === undefined}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-full transition-all duration-300 shadow-lg ${
                          selectedPrices[index] !== undefined
                            ? pkg.popular
                              ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black hover:from-yellow-500 hover:to-[#D4AF37]'
                              : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-[#D4AF37] hover:to-yellow-500 hover:text-black'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {selectedPrices[index] !== undefined ? 'Book Package' : 'Select Price Option'}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-yellow-500/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What next after Umrah?
              </h2>
              <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto border border-[#D4AF37]/20">
                <h3 className="text-3xl font-bold text-[#D4AF37] mb-4">
                  DOHA Funcation
                </h3>
                <div className="text-xl text-gray-700 mb-6">
                  4-7 January, 2026
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-6">
                  Additional ₦1.350M per person
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <span className="text-gray-700">Qatar Visa</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <span className="text-gray-700">Hotel in Doha with Buffet breakfast</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <span className="text-gray-700">Airport transfers with meet and greet</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <span className="text-gray-700">Organized Tours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <span className="text-gray-700">Excellent welfarism</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="bg-[#D4AF37]/10 rounded-2xl p-4 border border-[#D4AF37]/30">
                    <p className="text-gray-700 font-medium">
                      <strong>Note:</strong> Basic Package also available with Egypt Air (Dec 23 - Jan 3)
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
