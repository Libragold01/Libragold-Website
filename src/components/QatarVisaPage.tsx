import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VisaApplicationForm } from './VisaApplicationForm';
import { SEO } from './SEO';

interface QatarVisaPageProps {
  onBack?: () => void;
  onFormSubmitted?: (details?: any) => void;
}

export function QatarVisaPage({ onBack, onFormSubmitted }: QatarVisaPageProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  const handleFormSubmitted = onFormSubmitted ?? (() => {});
  const [showApplication, setShowApplication] = useState(false);

  const visaDetails = {
    name: 'Qatar Visa',
    price: '$750',
    description: 'Tourist and business visa processing for Qatar',
    requirements: [
      'International passport bio-data page (valid for at least 6 months from the day of departure)',
      'Passport photograph on a white background',
      'Paid and confirmed hotel voucher (For the duration of your stay, to be purchased through us; price depends on travel dates)',
      'Paid and confirmed flight tickets purchased through us',
      'Airport transfers purchased through us'
    ],
    notes: [
      'Applicant must purchase a hotel with us',
      'Not valid for previously submitted applications',
      'New applications only',
      'Visa issuance is at the discretion of the Consular; additional documents may be requested by the embassy if necessary',
      'Hotel Booking is required and it\'s a minimum'
    ]
  };

  if (showApplication) {
    return (
      <VisaApplicationForm
        visaType={`Qatar - ${visaDetails.name}`}
        visaPrice={{ usd: visaDetails.price, naira: visaDetails.price }}
        requirements={visaDetails.requirements}
        onBack={() => setShowApplication(false)}
        onFormSubmitted={handleFormSubmitted}
      />
    );
  }

  return (
    <>
      <SEO
        title="Qatar Visa — Libragold Group"
        description="Apply for a Qatar visa with Libragold Group. Complete visa package with hotel, flight and airport transfers included."
        canonical="/visas/qatar"
        keywords="Qatar visa Nigeria, Qatar tourist visa, Qatar visa processing, Doha visa"
      />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      {/* Back Button - Fixed below navbar */}
      <div className="bg-white shadow-sm border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#D4AF37] bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Visa Services</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <img 
            src="/Images/Hero Section/download (18).jpeg" 
            alt="Qatar Visa" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/90 via-[#F4E4C1]/80 to-[#FFE5B4]/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-black mb-6"
          >
            Qatar Visa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-black/80 max-w-3xl mx-auto"
          >
            Tourist and business visa processing for Qatar
          </motion.p>
        </div>
      </div>

      {/* Visa Details */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          >
            {/* Pricing Header */}
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] p-8 text-center">
              <h3 className="text-3xl font-bold text-black mb-2">{visaDetails.name}</h3>
              <div className="text-4xl font-bold text-black mb-2">{visaDetails.price}</div>
              <div className="text-sm text-black/80">+ Hotel, Flight & Airport Transfer</div>
            </div>

            {/* Details */}
            <div className="p-8">
              <p className="text-gray-600 mb-6">{visaDetails.description}</p>

              {/* Requirements */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                  Application Requirements:
                </h4>
                <ul className="space-y-3">
                  {visaDetails.requirements.map((req, idx) => (
                    <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Important Notes */}
              <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Important Notes:
                </h4>
                <ul className="space-y-2">
                  {visaDetails.notes.map((note, idx) => (
                    <li key={idx} className="text-sm text-amber-900 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply Button */}
              <motion.button
                onClick={() => setShowApplication(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                Apply for Qatar Visa
              </motion.button>
            </div>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Package Includes:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Visa processing and application assistance
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Hotel booking for duration of stay
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Flight ticket arrangement
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Airport transfer services
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Document verification and submission
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}
