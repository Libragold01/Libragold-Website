import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, User, FileText, CreditCard } from 'lucide-react';
import { apiService } from '../services/api';

interface TourBookingFormProps {
  tour: {
    name: string;
    price: string;
    duration: string;
    image: string;
  };
  onFormSubmitted: (bookingData: any) => void;
  onBack: () => void;
}

export function TourBookingForm({ tour, onFormSubmitted, onBack }: TourBookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Data
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    emergencyContact: '',
    
    // Passport Details
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    placeOfIssue: '',
    
    // Visa Processing (except Nigeria)
    visaRequired: tour.name !== 'Nigeria Discovery',
    previousVisas: '',
    travelHistory: '',
    purposeOfVisit: 'Tourism',
    accommodationDetails: '',
    
    // Tour Details
    travelDate: '',
    numberOfTravelers: 1,
    roomPreference: 'double',
    specialRequests: '',

    // Optional LWA ambassador referral code
    referralCode: '',
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  async function submitToBackend() {
    try {
      await apiService.createBooking({
        service: 'Tour',
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        referralCode: formData.referralCode || undefined,
        details: {
          tourName: tour.name,
          destination: tour.name,
          travelDate: formData.travelDate,
          numberOfTravelers: formData.numberOfTravelers,
          passportNumber: formData.passportNumber,
        },
      });
    } catch { /* non-fatal */ }
  }

  const handleSubmit = () => {
    submitToBackend();
    const bookingData = {
      tour,
      personalData: formData,
      totalAmount: `${tour.price} x ${formData.numberOfTravelers}`,
      bookingId: `TUR${Date.now()}`,
      referralCode: formData.referralCode || undefined,
    };
    onFormSubmitted(bookingData);
  };

  const steps = [
    { number: 1, title: 'Personal Data', icon: User },
    { number: 2, title: 'Passport Details', icon: FileText },
    ...(formData.visaRequired ? [{ number: 3, title: 'Visa Processing', icon: FileText }] : []),
    { number: formData.visaRequired ? 4 : 3, title: 'Tour Details', icon: CreditCard }
  ];

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
            <span className="font-medium">Back to Tours</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <img src={tour.image} alt={tour.name} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tour.name}</h1>
              <p className="text-gray-600">{tour.duration} • {tour.price}</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.number ? 'bg-[#D4AF37] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-[#D4AF37]' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-[#D4AF37]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          {/* Step 1: Personal Data */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
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
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
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

          {/* Step 2: Passport Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Passport Information</h2>
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
            </div>
          )}

          {/* Step 3: Visa Processing (if required) */}
          {currentStep === 3 && formData.visaRequired && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Visa Processing Information</h2>
              <div className="space-y-4">
                <textarea
                  placeholder="Previous Visas (if any)"
                  value={formData.previousVisas}
                  onChange={(e) => handleInputChange('previousVisas', e.target.value)}
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <textarea
                  placeholder="Travel History (Countries visited in last 5 years)"
                  value={formData.travelHistory}
                  onChange={(e) => handleInputChange('travelHistory', e.target.value)}
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <select
                  value={formData.purposeOfVisit}
                  onChange={(e) => handleInputChange('purposeOfVisit', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  <option value="Tourism">Tourism</option>
                  <option value="Business">Business</option>
                  <option value="Cultural">Cultural Exchange</option>
                </select>
                <textarea
                  placeholder="Accommodation Details"
                  value={formData.accommodationDetails}
                  onChange={(e) => handleInputChange('accommodationDetails', e.target.value)}
                  rows={2}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 4/3: Tour Details */}
          {currentStep === (formData.visaRequired ? 4 : 3) && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tour Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  placeholder="Preferred Travel Date *"
                  value={formData.travelDate}
                  onChange={(e) => handleInputChange('travelDate', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <select
                  value={formData.numberOfTravelers}
                  onChange={(e) => handleInputChange('numberOfTravelers', parseInt(e.target.value))}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
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
                  <option value="family">Family Room</option>
                </select>
                <textarea
                  placeholder="Special Requests or Dietary Requirements"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  rows={3}
                  className="md:col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Code <span className="text-gray-400 font-normal">(Optional — enter your LWA ambassador code)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LWA01"
                    pattern="LWA[0-9]{2,4}"
                    title="Enter a valid LWA code (e.g. LWA01)"
                    value={formData.referralCode}
                    onChange={(e) => handleInputChange('referralCode', e.target.value.toUpperCase())}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep === (formData.visaRequired ? 4 : 3) ? (
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