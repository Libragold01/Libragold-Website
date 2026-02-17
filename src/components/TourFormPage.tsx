import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, User, FileText } from 'lucide-react';

interface TourFormPageProps {
  tourPackage: {
    tourName: string;
    packageType: string;
    price: { usd: string; naira: string };
    duration: string;
  };
  onBack: () => void;
  onFormSubmit: (formData: any) => void;
}

export function TourFormPage({ tourPackage, onBack, onFormSubmit }: TourFormPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    emergencyContact: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    placeOfIssue: '',
    travelDate: '',
    numberOfTravelers: 1,
    roomPreference: 'double',
    specialRequests: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    const bookingData = {
      tour: tourPackage,
      personalData: formData,
      bookingId: `TUR${Date.now()}`
    };
    onFormSubmit(bookingData);
  };

  const isNigeriaTour = tourPackage.tourName === 'Nigeria Discovery';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Back Button - Fixed below navbar */}
      <div className="bg-white shadow-sm border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#D4AF37] bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Package</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Your Tour</h1>
          <p className="text-gray-600">{tourPackage.tourName} - {tourPackage.packageType} Package</p>
          <p className="text-[#D4AF37] font-semibold">{tourPackage.price.usd} / {tourPackage.price.naira}</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#D4AF37] text-white' : 'bg-gray-200'}`}>
                <User className="w-4 h-4" />
              </div>
              <span className={`ml-2 text-sm ${currentStep >= 1 ? 'text-[#D4AF37]' : 'text-gray-500'}`}>Personal Info</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${currentStep > 1 ? 'bg-[#D4AF37]' : 'bg-gray-200'}`} />
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#D4AF37] text-white' : 'bg-gray-200'}`}>
                <FileText className="w-4 h-4" />
              </div>
              <span className={`ml-2 text-sm ${currentStep >= 2 ? 'text-[#D4AF37]' : 'text-gray-500'}`}>Passport</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${currentStep > 2 ? 'bg-[#D4AF37]' : 'bg-gray-200'}`} />
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#D4AF37] text-white' : 'bg-gray-200'}`}>
                ✈️
              </div>
              <span className={`ml-2 text-sm ${currentStep >= 3 ? 'text-[#D4AF37]' : 'text-gray-500'}`}>Travel Details</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="date"
                  placeholder="Date of Birth *"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Nationality *"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Address *"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="md:col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Emergency Contact *"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="md:col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 2: Passport */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Passport Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Passport Number *"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Place of Issue *"
                  value={formData.placeOfIssue}
                  onChange={(e) => handleInputChange('placeOfIssue', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="date"
                  placeholder="Issue Date *"
                  value={formData.passportIssueDate}
                  onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="date"
                  placeholder="Expiry Date *"
                  value={formData.passportExpiryDate}
                  onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
              {!isNigeriaTour && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Visa processing will be handled by our team after booking confirmation.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Travel Details */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Travel Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  placeholder="Travel Date *"
                  value={formData.travelDate}
                  onChange={(e) => handleInputChange('travelDate', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <select
                  value={formData.numberOfTravelers}
                  onChange={(e) => handleInputChange('numberOfTravelers', parseInt(e.target.value))}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} Traveler{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <select
                  value={formData.roomPreference}
                  onChange={(e) => handleInputChange('roomPreference', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  <option value="single">Single Room</option>
                  <option value="double">Double Room</option>
                  <option value="triple">Triple Room</option>
                </select>
                <textarea
                  placeholder="Special Requests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  rows={3}
                  className="md:col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep === 3 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F]"
              >
                Proceed to Payment
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F]"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}