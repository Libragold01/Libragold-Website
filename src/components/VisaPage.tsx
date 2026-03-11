import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Globe, Users, Briefcase, GraduationCap } from 'lucide-react';
import { apiService, ApiVisaPackage, resolveImage } from '../services/api';
import { SEO } from './SEO';

function fmtNaira(n: number): string {
  const m = n / 1_000_000;
  return `₦${parseFloat(m.toFixed(3))}M`;
}

function toNavSlug(p: ApiVisaPackage): string {
  const c = p.country.toLowerCase();
  if (c.includes('saudi')) return 'saudi';
  if (c.includes('emirates') || c.includes('uae')) return 'uae';
  if (c.includes('schengen') || c.includes('europe')) return 'schengen';
  if (c.includes('qatar')) return 'qatar';
  return p.slug;
}

interface LocalVisa {
  name: string;
  slug: string;
  image: string;
  description: string;
  price: { usd: string; naira: string };
  features: string[];
}

function apiToVisa(p: ApiVisaPackage): LocalVisa {
  return {
    name: p.name,
    slug: toNavSlug(p),
    image: resolveImage(p.image, '/Images/Hero Section/makkah-pilgrimage.jpeg'),
    description: p.description,
    price: {
      usd: p.priceUSD > 0 ? '$' + p.priceUSD : 'From',
      naira: p.priceNGN > 0 ? fmtNaira(p.priceNGN) : '',
    },
    features: p.requirements.slice(0, 4),
  };
}

export function VisaPage() {
  const navigate = useNavigate();
  const [visaTypes, setVisaTypes] = useState<LocalVisa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getVisaPackages()
      .then(data => {
        const sorted = data.packages
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(apiToVisa);
        setVisaTypes(sorted);
      })
      .catch(() => setVisaTypes([]))
      .finally(() => setLoading(false));
  }, []);

  const services = [
    {
      icon: GraduationCap,
      title: 'Student Visa Assistance',
      description: 'Planning to study abroad? We help you navigate the visa requirements for your chosen destination, ensuring all paperwork is in order for a smooth application process.'
    },
    {
      icon: Globe,
      title: 'Tourist Visa Processing',
      description: 'Whether it\'s a quick getaway or an extended vacation, Libragold assists with tourist visa applications for a range of destinations worldwide.'
    },
    {
      icon: Briefcase,
      title: 'Business and Work Visas',
      description: 'Traveling for work? We handle all the specifics of business and work visa applications, letting you focus on your career goals.'
    },
    {
      icon: Users,
      title: 'Religious Travel Visas',
      description: 'Heading for Hajj, Umrah, or other religious purposes? Libragold specializes in managing visas for spiritual journeys, ensuring your focus remains on your devotion.'
    }
  ];

  const handleApplyVisa = (slug: string) => {
    navigate(`/visas/${slug}`);
  };

  return (
    <>
      <SEO
        title="Visa Processing Services"
        description="Professional visa processing services for UAE, Saudi Arabia, Schengen, Qatar, and more. Fast processing, expert guidance, and hassle-free applications."
        canonical="/visas"
        keywords="visa processing, UAE visa, Saudi visa, Schengen visa, Qatar visa, travel visa, Nigeria visa services"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="relative overflow-hidden py-20 sm:py-32">
          <div className="absolute inset-0">
            <img
              src="/Images/Hero Section/Canada Job Visa_ Pathways, Eligibility & Application Process.jpeg"
              alt="Visa Background"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/90 via-[#F4E4C1]/80 to-[#FFE5B4]/90"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6 sm:mb-8">
                <span className="text-xl sm:text-2xl">🛂</span>
                <span className="text-black font-semibold text-sm sm:text-base">Professional Visa Services</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-6 sm:mb-8 leading-tight"
            >
              Streamline Your
              <span className="block bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent text-2xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 sm:mt-4">
                Visa Application Process
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl text-black/80 max-w-5xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2 sm:px-4"
            >
              Applying for a visa can be a daunting task, with complex requirements and deadlines to meet.
              At Libragold, we simplify the process, offering expert guidance and tailored services to help you secure your visa with ease.
            </motion.p>
          </div>
        </div>

        <div className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                Our Visa Application Services
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-gray-600 px-2">Whether you're traveling for business, study, leisure, or religious purposes, we are here to support you every step of the way.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{service.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                Visa Services Available
              </h2>
              <p className="text-base sm:text-xl text-gray-600">Choose from our comprehensive visa processing services</p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                    <div className="h-48 sm:h-64 bg-gray-200"></div>
                    <div className="p-4 sm:p-6 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-10 bg-gray-200 rounded-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {visaTypes.map((visa, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-48 sm:h-64 overflow-hidden">
                      <img
                        src={visa.image}
                        alt={visa.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">{visa.name}</h3>
                      <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">{visa.description}</p>

                      <ul className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                        {visa.features.map((feature, idx) => (
                          <li key={idx} className="text-gray-600 text-xs sm:text-sm flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl font-bold text-[#D4AF37]">{visa.price.usd}</div>
                          {visa.price.naira && (
                            <div className="text-base sm:text-lg text-gray-600">{visa.price.naira}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">+ Service Charge</div>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => handleApplyVisa(visa.slug)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
                How Libragold Simplifies Your Visa Process
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl font-bold text-[#D4AF37]">1</span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Step-by-Step Guidance</h3>
                <p className="text-gray-600 text-sm sm:text-base">Our team explains each step in detail, so you know exactly what to expect.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl font-bold text-[#D4AF37]">2</span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Personalized Solutions</h3>
                <p className="text-gray-600 text-sm sm:text-base">Every traveler's needs are unique. We tailor our services to match your requirements.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl font-bold text-[#D4AF37]">3</span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Fast and Reliable Service</h3>
                <p className="text-gray-600 text-sm sm:text-base">With Libragold, you'll experience quick processing times and reliable assistance.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
