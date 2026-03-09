import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, FileText, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VisaApplicationForm } from './VisaApplicationForm';
import { SEO } from './SEO';

interface UAEVisaPageProps {
  onBack?: () => void;
  onFormSubmitted?: (details?: any) => void;
}

export function UAEVisaPage({ onBack, onFormSubmitted }: UAEVisaPageProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  const handleFormSubmitted = onFormSubmitted ?? (() => {});
  const [showApplication, setShowApplication] = useState(false);

  const visaDetails = {
    name: '96 Hours Dubai Transit Visa',
    price: '₦200,000',
    processing: '5 working days',
    validity: '96 hours (4 nights)',
    description: 'Transit visa allowing up to 4 nights in UAE depending on arrival time',
    requirements: [
      'Confirmed onward ticket with Emirates Airline',
      'Confirmed hotel booking from us (we can check any hotel of your choice and give quote)',
      'Valid visa for the destination country they are travelling to from UAE',
      'Bank statement requirement: Applicants aged 18–41 years travelling alone must provide the last six (6) months\' bank statements showing a minimum closing balance of $10,000 for each month'
    ],
    notes: [
      'This is a 96-hour transit visa, which allows applicants to spend up to 4 nights in the UAE depending on the arrival time',
      'Applicants above 41 years are exempted from providing the bank statement'
    ]
  };

  if (showApplication) {
    return (
      <VisaApplicationForm
        visaType={`UAE - ${visaDetails.name}`}
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
        title="UAE Visa — Libragold Group"
        description="Apply for a UAE transit visa with Libragold Group. 96-hour transit visa for Emirates Airline passengers. Fast processing in 5 working days."
        canonical="/visas/uae"
        keywords="UAE visa Nigeria, Dubai transit visa, 96 hours UAE visa, Emirates Airlines transit visa"
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
            src="/Images/Hero Section/The Lush and Luxurious Sanya EDITION on Hainan Island.jpeg" 
            alt="UAE Visa" 
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
            UAE 96 Hours Transit Visa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-black/80 max-w-3xl mx-auto"
          >
            Perfect for short stopovers in Dubai with Emirates Airline
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
              <div className="text-4xl font-bold text-black mb-3">{visaDetails.price}</div>
              <div className="text-sm text-black/80">per person</div>
              <div className="flex items-center justify-center gap-4 mt-4 text-black/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{visaDetails.processing}</span>
                </div>
                <div className="text-sm">• {visaDetails.validity}</div>
              </div>
            </div>

            {/* Details */}
            <div className="p-8">
              <p className="text-gray-600 mb-6">{visaDetails.description}</p>

              {/* Requirements */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                  Requirements:
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
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Important Notes:
                </h4>
                <ul className="space-y-2">
                  {visaDetails.notes.map((note, idx) => (
                    <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
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
                Apply for UAE Transit Visa
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
            <h4 className="text-lg font-semibold text-gray-900 mb-3">What's Included:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Visa processing and application assistance
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Hotel booking assistance (optional)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Document verification and submission
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Status tracking and updates
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}
