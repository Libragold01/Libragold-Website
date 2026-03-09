import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, FileText, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VisaApplicationForm } from './VisaApplicationForm';
import { SEO } from './SEO';

interface SchengenVisaPageProps {
  onBack?: () => void;
  onFormSubmitted?: (details?: any) => void;
}

export function SchengenVisaPage({ onBack, onFormSubmitted }: SchengenVisaPageProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  const handleFormSubmitted = onFormSubmitted ?? (() => {});
  const [showApplication, setShowApplication] = useState(false);

  const visaDetails = {
    name: 'Schengen Visa (6 Months)',
    processingFee: '₦200,000',
    visaCenterFee: '₦150,000',
    processing: '15 working days',
    description: 'Access to 26 European countries with 6-month validity',
    feeBreakdown: [
      { item: '6 Month visa', amount: '$180' },
      { item: 'Standard Appointment Fee at VFS', amount: '$140' },
      { item: 'Documents Upload Service', amount: '$30' },
      { item: 'Processing Fee', amount: '$200' }
    ],
    totalCost: '$550',
    requirements: [
      'Introduction letter',
      'Employment confirmation letter / CAC Doc (for business owners)',
      'Photocopy of previous visas & travel stamp in the last five years',
      '3 months bank statement with sufficient closing balance',
      'Reference letter from bank',
      'Work ID Card',
      'Travel Health Insurance Certificate',
      'Marriage Certificate (if travelling with spouse)',
      'Invitation letter (if applicable)'
    ],
    notes: [
      'Processing Fee: ₦200,000 (payable to Libragold)',
      'Visa fee of ₦150,000 will be paid by applicant at the visa center on the day of submission',
      'Cost for appointment and travel health insurance will be charged as a separate cost'
    ]
  };

  if (showApplication) {
    return (
      <VisaApplicationForm
        visaType={`Schengen - ${visaDetails.name}`}
        visaPrice={{ usd: visaDetails.processingFee, naira: visaDetails.processingFee }}
        requirements={visaDetails.requirements}
        onBack={() => setShowApplication(false)}
        onFormSubmitted={handleFormSubmitted}
      />
    );
  }

  return (
    <>
      <SEO
        title="Schengen Visa — Libragold Group"
        description="Apply for a Schengen visa with Libragold Group. Access 26 European countries with 6-month multiple entry visa."
        canonical="/visas/schengen"
        keywords="Schengen visa Nigeria, Europe visa, Schengen visa processing, 26 countries visa"
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
            src="/Images/Hero Section/Diverse International Students With Diplomas Celebrating Graduation.jpeg"
            alt="Schengen Visa" 
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
            Schengen Visa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-black/80 max-w-3xl mx-auto"
          >
            Access 26 European countries with a single visa
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
              <h3 className="text-3xl font-bold text-black mb-4">{visaDetails.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-black/80" />
                <span className="text-black/80">{visaDetails.processing}</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-8">
              <p className="text-gray-600 mb-6">{visaDetails.description}</p>

              {/* Fee Breakdown */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                  Applicable Fees:
                </h4>
                <div className="space-y-2 mb-3">
                  {visaDetails.feeBreakdown.map((fee, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{fee.item}</span>
                      <span className="font-semibold text-gray-900">{fee.amount}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-300 flex justify-between">
                  <span className="font-bold text-gray-900">Total Cost (6 months):</span>
                  <span className="font-bold text-[#D4AF37] text-lg">{visaDetails.totalCost}</span>
                </div>
              </div>

              {/* Payment Structure */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Payment Structure:
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

              {/* Requirements */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                  Required Documents:
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

              {/* Apply Button */}
              <motion.button
                onClick={() => setShowApplication(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                Apply for Schengen Visa
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
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Schengen Countries Covered:</h4>
            <p className="text-sm text-gray-600 mb-3">
              Your Schengen visa grants you access to 26 European countries including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
              <div>• Austria</div>
              <div>• Belgium</div>
              <div>• Czech Republic</div>
              <div>• Denmark</div>
              <div>• Estonia</div>
              <div>• Finland</div>
              <div>• France</div>
              <div>• Germany</div>
              <div>• Greece</div>
              <div>• Hungary</div>
              <div>• Iceland</div>
              <div>• Italy</div>
              <div>• Latvia</div>
              <div>• Lithuania</div>
              <div>• Luxembourg</div>
              <div>• Malta</div>
              <div>• Netherlands</div>
              <div>• Norway</div>
              <div>• Poland</div>
              <div>• Portugal</div>
              <div>• Slovakia</div>
              <div>• Slovenia</div>
              <div>• Spain</div>
              <div>• Sweden</div>
              <div>• Switzerland</div>
              <div>• Liechtenstein</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}
