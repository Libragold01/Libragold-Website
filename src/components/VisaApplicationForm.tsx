import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, FileText, Upload, Camera } from 'lucide-react';
import { PaymentPage } from './PaymentPage';

interface VisaApplicationFormProps {
  visaType: string;
  visaPrice?: { usd: string; naira: string };
  onBack: () => void;
  onFormSubmitted: (details: any) => void;
}

export function VisaApplicationForm({ visaType, visaPrice, onBack, onFormSubmitted }: VisaApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    address: '',
    occupation: '',
    
    // Passport Details
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    placeOfIssue: '',
    
    // Travel Information
    purposeOfVisit: '',
    intendedDuration: '',
    arrivalDate: '',
    departureDate: '',
    accommodationAddress: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    
    // Documents
    passportPage: null,
    passportPhoto: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        [fieldName]: file
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send visa application data to Web3Forms
    const web3FormData = new FormData();
    web3FormData.append('access_key', 'dc98498a-5066-478d-99f3-8524d9412556');
    web3FormData.append('subject', `Visa Application: ${visaType}`);
    web3FormData.append('visaType', visaType);
    web3FormData.append('fullName', formData.fullName);
    web3FormData.append('email', formData.email);
    web3FormData.append('phone', formData.phone);
    web3FormData.append('dateOfBirth', formData.dateOfBirth);
    web3FormData.append('placeOfBirth', formData.placeOfBirth);
    web3FormData.append('gender', formData.gender);
    web3FormData.append('maritalStatus', formData.maritalStatus);
    web3FormData.append('nationality', formData.nationality);
    web3FormData.append('address', formData.address);
    web3FormData.append('occupation', formData.occupation);
    web3FormData.append('passportNumber', formData.passportNumber);
    web3FormData.append('passportIssueDate', formData.passportIssueDate);
    web3FormData.append('passportExpiryDate', formData.passportExpiryDate);
    web3FormData.append('placeOfIssue', formData.placeOfIssue);
    web3FormData.append('purposeOfVisit', formData.purposeOfVisit);
    web3FormData.append('intendedDuration', formData.intendedDuration);
    web3FormData.append('arrivalDate', formData.arrivalDate);
    web3FormData.append('departureDate', formData.departureDate);
    web3FormData.append('accommodationAddress', formData.accommodationAddress);
    web3FormData.append('emergencyName', formData.emergencyName);
    web3FormData.append('emergencyPhone', formData.emergencyPhone);
    web3FormData.append('emergencyRelation', formData.emergencyRelation);

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormData
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }

    setShowPayment(true);
  };

  const handleBackFromPayment = () => {
    setShowPayment(false);
  };

  const handlePaymentComplete = (paymentDetails: any) => {
    onFormSubmitted(paymentDetails);
  };

  if (showPayment) {
    const applicationDetails = {
      service: 'Visa Processing',
      package: visaType,
      price: visaPrice || { usd: '$200', naira: '₦300,000' },
      applicationData: formData,
      applicationDate: new Date().toLocaleDateString()
    };
    return (
      <PaymentPage
        bookingDetails={applicationDetails}
        onBack={handleBackFromPayment}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

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
            <span className="font-medium">Back to Visa Services</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step ? 'bg-[#D4AF37] text-black' : 'bg-gray-200 text-gray-500'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-20 h-1 mx-4 ${
                  currentStep > step ? 'bg-[#D4AF37]' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Visa Type Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {visaType} Application
          </h2>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                  <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth *</label>
                    <input
                      type="text"
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Passport Details */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-6 h-6 text-[#D4AF37]" />
                  <h3 className="text-2xl font-bold text-gray-900">Passport Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number *</label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Place of Issue *</label>
                    <input
                      type="text"
                      name="placeOfIssue"
                      value={formData.placeOfIssue}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
                    <input
                      type="date"
                      name="passportIssueDate"
                      value={formData.passportIssueDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                    <input
                      type="date"
                      name="passportExpiryDate"
                      value={formData.passportExpiryDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone *</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                    <select
                      name="emergencyRelation"
                      value={formData.emergencyRelation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    >
                      <option value="">Select Relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Travel Information */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-6 h-6 text-[#D4AF37]" />
                  <h3 className="text-2xl font-bold text-gray-900">Travel Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Visit *</label>
                    <select
                      name="purposeOfVisit"
                      value={formData.purposeOfVisit}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    >
                      <option value="">Select Purpose</option>
                      <option value="Tourism">Tourism</option>
                      <option value="Business">Business</option>
                      <option value="Study">Study</option>
                      <option value="Work">Work</option>
                      <option value="Transit">Transit</option>
                      <option value="Family Visit">Family Visit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Intended Duration *</label>
                    <input
                      type="text"
                      name="intendedDuration"
                      value={formData.intendedDuration}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 2 weeks"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Intended Arrival Date *</label>
                    <input
                      type="date"
                      name="arrivalDate"
                      value={formData.arrivalDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Intended Departure Date *</label>
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Address</label>
                    <textarea
                      name="accommodationAddress"
                      value={formData.accommodationAddress}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Hotel or accommodation address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Document Upload */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Upload className="w-6 h-6 text-[#D4AF37]" />
                  <h3 className="text-2xl font-bold text-gray-900">Document Upload</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Data Page *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload passport data page</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'passportPage')}
                        required
                        className="hidden"
                        id="passportPage"
                      />
                      <label
                        htmlFor="passportPage"
                        className="cursor-pointer text-[#D4AF37] hover:text-[#F4E4C1] font-medium"
                      >
                        Choose File
                      </label>
                      {formData.passportPage && (
                        <p className="text-sm text-green-600 mt-2">✓ File selected</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Photograph *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition-colors">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload passport photograph</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'passportPhoto')}
                        required
                        className="hidden"
                        id="passportPhoto"
                      />
                      <label
                        htmlFor="passportPhoto"
                        className="cursor-pointer text-[#D4AF37] hover:text-[#F4E4C1] font-medium"
                      >
                        Choose File
                      </label>
                      {formData.passportPhoto && (
                        <p className="text-sm text-green-600 mt-2">✓ File selected</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Document Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Passport must be valid for at least 6 months</li>
                    <li>• Passport photograph should be recent (within 6 months)</li>
                    <li>• Files should be in JPG, PNG, or PDF format</li>
                    <li>• Maximum file size: 5MB per document</li>
                  </ul>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                    <span>Payment Powered & Secured By</span>
                    <span className="font-semibold text-[#D4AF37]">Lotus Bank</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F4E4C1] transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F4E4C1] transition-colors"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}