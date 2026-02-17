import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, CreditCard, MapPin, Star, CheckCircle, Loader } from 'lucide-react';
import { lotusPayment } from '../services/lotusPayment';

interface BookingData {
  hotel: any;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  numPersons: number;
  // Numeric pricing
  totalUSD: number;
  perPersonUSD: number;
  totalNGN: number;
  perPersonNGN: number;
  // Display strings
  priceDisplay: string;
  priceDisplayNaira: string;
}

interface HotelBookingFormProps {
  bookingData: BookingData;
  onBack: () => void;
  onBookingComplete: (details?: any) => void;
}

export function HotelBookingForm({ bookingData, onBack, onBookingComplete }: HotelBookingFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    passportNumber: '',
    specialRequests: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [finalBookingDetails, setFinalBookingDetails] = useState<any>(null);
  const [selectedPersonCount, setSelectedPersonCount] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Send hotel booking data to Web3Forms
    const web3FormData = new FormData();
    web3FormData.append('access_key', 'dc98498a-5066-478d-99f3-8524d9412556');
    web3FormData.append('subject', `Hotel Booking: ${bookingData.hotel?.name}`);
    web3FormData.append('hotelName', bookingData.hotel?.name || '');
    web3FormData.append('roomType', bookingData.roomType);
    web3FormData.append('checkIn', bookingData.checkIn);
    web3FormData.append('checkOut', bookingData.checkOut);
    web3FormData.append('guests', bookingData.guests);
    web3FormData.append('paymentType', `${selectedPersonCount} Person(s) of ${numPersons}`);
    web3FormData.append('totalPrice', `$${finalPaymentUSD.toLocaleString()} / ₦${finalPaymentNGN.toLocaleString()}`);
    web3FormData.append('fullName', formData.fullName);
    web3FormData.append('email', formData.email);
    web3FormData.append('phone', formData.phone);
    web3FormData.append('nationality', formData.nationality);
    web3FormData.append('passportNumber', formData.passportNumber);
    web3FormData.append('specialRequests', formData.specialRequests);

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormData
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }

    const bookingDetails = {
      service: 'Hotel Booking',
      package: bookingData.roomType,
      paymentType: `${selectedPersonCount} Person(s) of ${numPersons}`,
      personsPayingFor: selectedPersonCount,
      roomCapacity: numPersons,
      price: {
        usd: `$${finalPaymentUSD.toLocaleString()}`,
        naira: `₦${finalPaymentNGN.toLocaleString()}`
      },
      amountUSD: finalPaymentUSD,
      amountNGN: finalPaymentNGN,
      personalData: formData,
      hotel: bookingData.hotel,
      roomType: bookingData.roomType,
      guests: bookingData.guests,
      numPersons,
      totalAmount: `$${finalPaymentUSD.toLocaleString()}`,
      guestName: formData.fullName,
      email: formData.email
    };

    setFinalBookingDetails(bookingDetails);

    // Initialize Lotus Bank payment directly
    try {
      const paymentRequest = {
        amount: finalPaymentNGN,
        currency: 'NGN',
        email: formData.email,
        reference: lotusPayment.generateReference(),
        callback_url: window.location.origin + '/payment/success',
        metadata: {
          service: 'Hotel Booking',
          hotel_name: bookingData.hotel?.name,
          room_type: bookingData.roomType,
          persons_paying_for: selectedPersonCount,
          room_capacity: numPersons,
          guests: bookingData.guests,
          customer_name: formData.fullName,
          phone: formData.phone,
          amount_usd: finalPaymentUSD
        }
      };

      console.log('Initializing Lotus Bank payment for hotel...', paymentRequest);
      const response = await lotusPayment.initializePayment(paymentRequest);
      console.log('Lotus API response:', response);

      if (response.status && response.data?.authorization_url) {
        // Redirect to Lotus payment page
        window.location.href = response.data.authorization_url;
      } else {
        setIsProcessing(false);
        alert('Payment initialization failed: ' + (response.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      alert('Payment processing error. Please try again.');
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onBookingComplete(finalBookingDetails);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Use numeric pricing from bookingData - hotel packages are fixed price (not per night)
  const totalPriceUSD = bookingData?.totalUSD || 0;
  const totalPriceNGN = bookingData?.totalNGN || 0;
  const perPersonUSD = bookingData?.perPersonUSD || 0;
  const perPersonNGN = bookingData?.perPersonNGN || 0;
  const numPersons = bookingData?.numPersons || 1;

  // Calculate final payment amount based on number of persons selected
  const finalPaymentUSD = perPersonUSD * selectedPersonCount;
  const finalPaymentNGN = perPersonNGN * selectedPersonCount;

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < count ? 'text-[#D4AF37] fill-current' : 'text-gray-300'}`} />
    ));
  };

  // Show processing state
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 text-center shadow-xl max-w-md w-full mx-4"
        >
          <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
          <p className="text-gray-600 mb-4">Please wait while we connect you to our secure payment gateway...</p>
          <div className="flex justify-center">
            <Loader className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        </motion.div>
      </div>
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
            <span className="font-medium">Back to Hotel Details</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-[#D4AF37]" />
                Guest Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality *
                    </label>
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    >
                      <option value="">Select Nationality</option>
                      <option value="Nigerian">Nigerian</option>
                      <option value="American">American</option>
                      <option value="British">British</option>
                      <option value="Canadian">Canadian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter your passport number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Any special requests or requirements"
                    />
                  </div>

                  {/* Payment Type Selection - Number of Persons */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How many persons are you paying for? *
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      Room capacity: {numPersons} person{numPersons > 1 ? 's' : ''} | Price per person: ${perPersonUSD.toLocaleString()} (₦{perPersonNGN.toLocaleString()})
                    </p>
                    <div className={`grid gap-3 ${numPersons <= 2 ? 'grid-cols-2' : numPersons === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                      {Array.from({ length: numPersons }, (_, i) => i + 1).map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setSelectedPersonCount(count)}
                          className={`p-4 border-2 rounded-xl text-center transition-all ${
                            selectedPersonCount === count
                              ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedPersonCount === count ? 'border-[#D4AF37]' : 'border-gray-300'
                            }`}>
                              {selectedPersonCount === count && (
                                <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                              )}
                            </div>
                            <span className="font-semibold text-gray-900">
                              {count} {count === 1 ? 'Person' : 'Persons'}
                            </span>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#D4AF37]">
                              ${(perPersonUSD * count).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              ₦{(perPersonNGN * count).toLocaleString()}
                            </div>
                            {count === numPersons && (
                              <p className="text-xs text-green-600 mt-1 font-medium">Full Room</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isProcessing}
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  className={`w-full py-4 font-bold rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black hover:from-[#F4E4C1] hover:to-[#D4AF37]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Complete Booking & Pay'
                  )}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>

              {/* Hotel Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <img
                  src={bookingData?.hotel?.image || ''}
                  alt={bookingData?.hotel?.name || 'Hotel'}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(bookingData?.hotel?.stars || 5)}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{bookingData?.hotel?.name || 'Hotel Name'}</h4>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  {bookingData?.hotel?.location || 'Makkah'}
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4 mb-6">
                <div className="text-sm text-gray-600">
                  Occupancy Type: <span className="font-medium">{bookingData?.roomType || 'Not selected'}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Guests: <span className="font-medium">{bookingData?.guests || '1 Guest'}</span>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Room Capacity</span>
                    <span>{numPersons} person{numPersons > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Price per Person</span>
                    <div className="text-right">
                      <div>${perPersonUSD.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">₦{perPersonNGN.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Full Room Price</span>
                    <div className="text-right">
                      <div>${totalPriceUSD.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">₦{totalPriceNGN.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center text-sm text-gray-700 mb-3">
                      <span>Paying for:</span>
                      <span className="font-semibold text-[#D4AF37]">
                        {selectedPersonCount} of {numPersons} person{numPersons > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="bg-[#D4AF37]/10 rounded-lg p-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>You Pay</span>
                        <div className="text-right">
                          <div className="text-[#D4AF37]">${finalPaymentUSD.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">₦{finalPaymentNGN.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
                    <span>Payment Powered & Secured By</span>
                    <span className="font-semibold text-[#D4AF37]">Lotus Bank</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
            <div className="text-left space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold text-lg text-[#D4AF37] mb-2">Ramadan Umrah 2026 - Hotel Booking</div>
              <div><span className="font-medium">Hotel:</span> {finalBookingDetails?.hotel?.name}</div>
              <div><span className="font-medium">Occupancy Type:</span> {finalBookingDetails?.roomType}</div>
              <div><span className="font-medium">Number of Guests:</span> {finalBookingDetails?.guests}</div>
              <div><span className="font-medium">Guest Name:</span> {finalBookingDetails?.guestName}</div>
              <div><span className="font-medium">Email:</span> {finalBookingDetails?.email}</div>
              <div><span className="font-medium">Booking Date:</span> {new Date().toLocaleDateString()}</div>
              <div><span className="font-medium">Total Amount:</span> {finalBookingDetails?.price?.usd} / {finalBookingDetails?.price?.naira}</div>
              <div><span className="font-medium">Payment Status:</span> <span className="text-green-600">Confirmed</span></div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your Ramadan Umrah hotel booking has been confirmed! Confirmation details and further instructions will be sent to your email. Our team will contact you within 24 hours.
            </p>
            <button
              onClick={handleCloseSuccess}
              className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );


}