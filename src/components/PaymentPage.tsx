import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, CheckCircle, Loader } from 'lucide-react';
import { lotusPayment, PaymentRequest } from '../services/lotusPayment';

interface PaymentPageProps {
  bookingDetails: any;
  onBack: () => void;
  onPaymentComplete: (details: any) => void;
}

export function PaymentPage({ bookingDetails, onBack, onPaymentComplete }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Use numeric amount if available, otherwise extract from price string
      let amount: number;
      if (bookingDetails.amountNGN) {
        // Use the numeric NGN amount directly
        amount = bookingDetails.amountNGN;
      } else if (bookingDetails.amountUSD) {
        // Convert USD to NGN using exchange rate
        amount = bookingDetails.amountUSD * 1510;
      } else {
        // Fallback: extract from price string
        const amountStr = bookingDetails.price?.usd?.replace(/[$,]/g, '') || '200';
        amount = parseFloat(amountStr) * 1510; // Convert to NGN
      }
      
      const paymentRequest: PaymentRequest = {
        amount,
        currency: 'NGN',
        email: bookingDetails.personalData?.email || 'customer@libragold.com',
        reference: lotusPayment.generateReference(),
        callback_url: window.location.origin + '/payment/callback',
        paymentMethod: paymentMethod as 'card' | 'transfer',
        metadata: {
          service: bookingDetails.service,
          package: bookingDetails.package,
          customer_name: bookingDetails.personalData?.fullName || 'Customer'
        }
      };

      // Add card details if card payment
      if (paymentMethod === 'card') {
        paymentRequest.cardDetails = cardData;
      }

      // Initialize payment with Lotus Bank API
      console.log('Initializing Lotus Bank payment...', { amount, paymentMethod });

      const response = await lotusPayment.initializePayment(paymentRequest);
      console.log('Lotus API response:', response);

      if (response.status && response.data?.authorization_url) {
        // Redirect to Lotus payment page for secure payment
        window.location.href = response.data.authorization_url;
      } else {
        // Payment initialization failed
        alert('Payment initialization failed: ' + (response.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Payment Method</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        paymentMethod === 'card' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-semibold">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, Verve</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        paymentMethod === 'transfer' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-semibold">Bank Transfer</div>
                      <div className="text-sm text-gray-600">Direct bank transfer</div>
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Bank Transfer Info */}
                {paymentMethod === 'transfer' && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Bank Transfer Details</h4>
                    <div className="space-y-3">
                      <div><span className="font-medium">Bank:</span> Access Bank</div>
                      <div><span className="font-medium">Account Name:</span> LibraGold Travel & Tours Ltd</div>
                      
                      <div className="flex items-center justify-between bg-white p-3 rounded border">
                        <div>
                          <span className="font-medium text-gray-700">Account Number:</span>
                          <div className="text-lg font-bold text-gray-900">0123456789</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('0123456789');
                            alert('Account number copied!');
                          }}
                          className="px-3 py-1 bg-[#D4AF37] text-black text-sm font-medium rounded hover:bg-[#F4E4C1] transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white p-3 rounded border">
                        <div>
                          <span className="font-medium text-gray-700">Reference ID:</span>
                          <div className="text-lg font-bold text-gray-900">{bookingDetails.service?.replace(/\s+/g, '') + Date.now()}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const ref = bookingDetails.service?.replace(/\s+/g, '') + Date.now();
                            navigator.clipboard.writeText(ref);
                            alert('Reference ID copied!');
                          }}
                          className="px-3 py-1 bg-[#D4AF37] text-black text-sm font-medium rounded hover:bg-[#F4E4C1] transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-4">
                      Please use the reference ID when making your transfer and upload proof of payment.
                    </p>
                  </div>
                )}

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
                      Processing Payment...
                    </>
                  ) : (
                    'Complete Payment'
                  )}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{bookingDetails.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium">{bookingDetails.package}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <div className="text-right">
                      <div className="text-[#D4AF37]">{bookingDetails.price?.usd}</div>
                      <div className="text-sm text-gray-600">{bookingDetails.price?.naira}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="text-xs text-gray-500">
                  Payment Powered & Secured By <span className="font-semibold text-[#D4AF37]">Lotus Bank</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}