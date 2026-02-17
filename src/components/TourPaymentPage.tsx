import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Building2, Shield, CheckCircle, Clock } from 'lucide-react';
import { lotusPayment } from '../services/lotusPayment';

interface TourPaymentPageProps {
  bookingData: {
    tour: {
      name: string;
      price: string;
      duration: string;
      image: string;
    };
    personalData: any;
    totalAmount: string;
    bookingId: string;
  };
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export function TourPaymentPage({ bookingData, onBack, onPaymentSuccess }: TourPaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: bookingData.personalData.email || '',
    phone: bookingData.personalData.phone || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const basePrice = parseFloat(bookingData.tour.price.replace(/[^0-9.]/g, ''));
    const travelers = bookingData.personalData.numberOfTravelers || 1;
    const subtotal = basePrice * travelers;
    const serviceCharge = subtotal * 0.05; // 5% service charge
    return {
      subtotal,
      serviceCharge,
      total: subtotal + serviceCharge
    };
  };

  const { subtotal, serviceCharge, total } = calculateTotal();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Convert USD to NGN for payment (exchange rate: 1510)
      const amountNGN = total * 1510;

      const paymentRequest = {
        amount: amountNGN,
        currency: 'NGN',
        email: paymentData.email,
        reference: lotusPayment.generateReference(),
        callback_url: window.location.origin + '/payment/success',
        metadata: {
          service: 'Tour Booking',
          tour_name: bookingData.tour.name,
          travelers: bookingData.personalData.numberOfTravelers,
          travel_date: bookingData.personalData.travelDate,
          customer_name: `${bookingData.personalData.firstName} ${bookingData.personalData.lastName}`,
          phone: paymentData.phone,
          amount_usd: total
        }
      };

      console.log('Initializing Lotus Bank payment for tour...', paymentRequest);
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
          <p className="text-gray-600 mb-4">Please wait while we process your tour booking...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
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
            <span className="font-medium">Back to Booking</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <img src={bookingData.tour.image} alt={bookingData.tour.name} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
              <p className="text-gray-600">{bookingData.tour.name} • {bookingData.tour.duration}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
              
              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                    paymentMethod === 'card' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Card Payment</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                    paymentMethod === 'transfer' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Bank Transfer</span>
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={paymentData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Bank Transfer Details</h3>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><strong>Bank:</strong> Lotus Bank</p>
                    <p><strong>Account Name:</strong> LibraGold Travels Ltd</p>
                    <p><strong>Account Number:</strong> 1234567890</p>
                    <p><strong>Reference:</strong> {bookingData.bookingId}</p>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Please use the reference number for your transfer and contact us after payment.
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={paymentData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={paymentData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>

              {/* Security Notice */}
              <div className="mt-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800">
                  Your payment is secured by Lotus Bank's advanced encryption technology.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour Package</span>
                  <span className="font-medium">{bookingData.tour.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travelers</span>
                  <span className="font-medium">{bookingData.personalData.numberOfTravelers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Charge (5%)</span>
                  <span className="font-medium">${serviceCharge.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-[#D4AF37]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Free cancellation up to 48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Secure payment processing</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentMethod === 'card' && (!paymentData.cardNumber || !paymentData.cvv)}
                className="w-full bg-[#D4AF37] text-white py-4 rounded-lg font-semibold hover:bg-[#B8941F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {paymentMethod === 'card' ? `Pay $${total.toFixed(2)}` : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}