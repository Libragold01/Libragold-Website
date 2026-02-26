import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, CreditCard, MapPin, Star, Loader } from 'lucide-react';
import { lotusPayment } from '../services/lotusPayment';
import { PaymentOptions, formatNaira } from './shared/PaymentOptions';
import { ThankYouModal } from './shared/ThankYouModal';
import { WEB3FORMS_KEY } from '../config';

interface BookingData {
  hotel: any;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  numPersons: number;
  totalUSD: number;
  perPersonUSD: number;
  totalNGN: number;
  perPersonNGN: number;
  priceDisplay: string;
  priceDisplayNaira: string;
}

interface HotelBookingFormProps {
  bookingData: BookingData;
  onBack: () => void;
  onBookingComplete: (details?: any) => void;
}

export function HotelBookingForm({ bookingData, onBack }: HotelBookingFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    passportNumber: '',
    specialRequests: '',
    referralCode: '', // Optional LWA ambassador referral code
  });
  const [selectedPersonCount, setSelectedPersonCount] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState('');

  // ─── Pricing ─────────────────────────────────────────────────────────────

  const perPersonNGN = bookingData?.perPersonNGN || 0;
  const perPersonUSD = bookingData?.perPersonUSD || 0;
  const numPersons = bookingData?.numPersons || 1;
  const totalNaira = perPersonNGN * selectedPersonCount;
  const totalUSD = perPersonUSD * selectedPersonCount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ─── Step 1: Submit guest form ────────────────────────────────────────────

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const web3FormData = new FormData();
    web3FormData.append('access_key', WEB3FORMS_KEY);
    web3FormData.append('subject', `Hotel Booking: ${bookingData.hotel?.name}`);
    web3FormData.append('hotelName', bookingData.hotel?.name || '');
    web3FormData.append('roomType', bookingData.roomType);
    web3FormData.append('guests', bookingData.guests);
    web3FormData.append('persons', String(selectedPersonCount));
    web3FormData.append('totalPrice', `$${totalUSD.toLocaleString()} / ${formatNaira(totalNaira)}`);
    web3FormData.append('fullName', formData.fullName);
    web3FormData.append('email', formData.email);
    web3FormData.append('phone', formData.phone);
    web3FormData.append('nationality', formData.nationality);
    web3FormData.append('passportNumber', formData.passportNumber);
    web3FormData.append('specialRequests', formData.specialRequests);
    if (formData.referralCode) web3FormData.append('referralCode', formData.referralCode);

    try {
      await fetch('https://api.web3forms.com/submit', { method: 'POST', body: web3FormData });
    } catch {
      // Non-critical — continue to payment step
    } finally {
      setIsProcessing(false);
      setFormSubmitted(true);
    }
  };

  // ─── Step 2: Payment helpers ──────────────────────────────────────────────

  async function submitPaymentMethod(paymentMethod: string, extraFields?: Record<string, string>) {
    const web3FormData = new FormData();
    web3FormData.append('access_key', WEB3FORMS_KEY);
    web3FormData.append('subject', `Hotel Payment Update: ${bookingData.hotel?.name}`);
    web3FormData.append('hotelName', bookingData.hotel?.name || '');
    web3FormData.append('paymentMethod', paymentMethod);
    web3FormData.append('amount', formatNaira(totalNaira));
    web3FormData.append('customerName', formData.fullName);
    web3FormData.append('email', formData.email);
    if (extraFields) {
      Object.entries(extraFields).forEach(([key, value]) => web3FormData.append(key, value));
    }
    await fetch('https://api.web3forms.com/submit', { method: 'POST', body: web3FormData });
  }

  async function initiateLotusPayment(amount: number) {
    const response = await lotusPayment.initializePayment({
      amount,
      currency: 'NGN',
      email: formData.email,
      reference: lotusPayment.generateReference(),
      callback_url: window.location.origin + '/payment/success',
      metadata: {
        service: 'Hotel Booking',
        hotel_name: bookingData.hotel?.name,
        room_type: bookingData.roomType,
        persons_paying_for: selectedPersonCount,
        guests: bookingData.guests,
        customer_name: formData.fullName,
        phone: formData.phone,
        amount_usd: totalUSD,
      },
    });
    if (response.status && response.data?.authorization_url) {
      window.location.href = response.data.authorization_url;
    } else {
      throw new Error(response.message || 'Payment initialization failed. Please try again.');
    }
  }

  // ─── Step 2: Payment handlers ─────────────────────────────────────────────

  async function handlePayNow() {
    setIsProcessing(true);
    try {
      await submitPaymentMethod('Pay Now - Full Payment');
      await initiateLotusPayment(totalNaira);
    } catch (error: any) {
      alert(error.message || 'Unable to process payment. Please try again.');
      setIsProcessing(false);
    }
  }

  async function handlePayLater() {
    setIsProcessing(true);
    try {
      await submitPaymentMethod('Pay Later');
      setThankYouMessage(`Thank you for your hotel booking at ${bookingData.hotel?.name}. Our team will contact you to arrange payment.`);
      setShowThankYou(true);
    } catch {
      alert('Unable to submit. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleInstallmentPayNow(installmentAmount: number, installmentCount: number) {
    setIsProcessing(true);
    try {
      await submitPaymentMethod('Libragold PSS - First Installment', {
        installmentPlan: `${installmentCount} payments`,
        installmentAmount: formatNaira(installmentAmount),
      });
      await initiateLotusPayment(installmentAmount);
    } catch (error: any) {
      alert(error.message || 'Unable to process payment. Please try again.');
      setIsProcessing(false);
    }
  }

  async function handleInstallmentPayLater(installmentAmount: number, installmentCount: number) {
    setIsProcessing(true);
    try {
      await submitPaymentMethod('Libragold PSS - Start Later', {
        installmentPlan: `${installmentCount} payments`,
        installmentAmount: formatNaira(installmentAmount),
      });
      setThankYouMessage(`Thank you for your hotel booking at ${bookingData.hotel?.name} and choosing Libragold PSS. We will contact you to start your installment plan.`);
      setShowThankYou(true);
    } catch {
      alert('Unable to submit. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  const renderStars = (count: number) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < count ? 'text-[#D4AF37] fill-current' : 'text-gray-300'}`} />
  ));

  // ─── Render ───────────────────────────────────────────────────────────────

  if (showThankYou) {
    return <ThankYouModal message={thankYouMessage} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Back Button */}
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
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">

              {!formSubmitted ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#D4AF37]" />
                    Guest Information
                  </h2>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="Enter your full name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="Enter your email" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="Enter your phone number" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                        <select name="nationality" value={formData.nationality} onChange={handleInputChange} required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent">
                          <option value="">Select Nationality</option>
                          <option value="Nigerian">Nigerian</option>
                          <option value="American">American</option>
                          <option value="British">British</option>
                          <option value="Canadian">Canadian</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number *</label>
                        <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="Enter your passport number" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                        <textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="Any special requests or requirements" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Referral Code <span className="text-gray-400 font-normal">(Optional — enter your LWA ambassador code)</span>
                        </label>
                        <input type="text" name="referralCode" value={formData.referralCode} onChange={handleInputChange}
                          placeholder="e.g. LWA01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent uppercase" />
                      </div>

                      {/* Person count selector */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          How many persons are you paying for? *
                        </label>
                        <p className="text-xs text-gray-500 mb-4">
                          Room capacity: {numPersons} person{numPersons > 1 ? 's' : ''} | Price per person: ${perPersonUSD.toLocaleString()} ({formatNaira(perPersonNGN)})
                        </p>
                        <div className={`grid gap-3 ${numPersons <= 2 ? 'grid-cols-2' : numPersons === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                          {Array.from({ length: numPersons }, (_, i) => i + 1).map((count) => (
                            <button key={count} type="button" onClick={() => setSelectedPersonCount(count)}
                              className={`p-4 border-2 rounded-xl text-center transition-all ${
                                selectedPersonCount === count ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-md' : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPersonCount === count ? 'border-[#D4AF37]' : 'border-gray-300'}`}>
                                  {selectedPersonCount === count && <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />}
                                </div>
                                <span className="font-semibold text-gray-900">{count} {count === 1 ? 'Person' : 'Persons'}</span>
                              </div>
                              <div className="text-lg font-bold text-[#D4AF37]">${(perPersonUSD * count).toLocaleString()}</div>
                              <div className="text-sm text-gray-500">{formatNaira(perPersonNGN * count)}</div>
                              {count === numPersons && <p className="text-xs text-green-600 mt-1 font-medium">Full Room</p>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <motion.button type="submit" disabled={isProcessing}
                      whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                      whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                      className={`w-full py-4 font-bold rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                        isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black hover:from-[#F4E4C1] hover:to-[#D4AF37]'
                      }`}
                    >
                      {isProcessing ? (
                        <><Loader className="w-5 h-5 animate-spin" /> Processing...</>
                      ) : (
                        'Continue to Payment'
                      )}
                    </motion.button>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                    <h2 className="text-2xl font-bold text-gray-900">Choose Payment Option</h2>
                  </div>

                  <PaymentOptions
                    totalNaira={totalNaira}
                    isProcessing={isProcessing}
                    onPayNow={handlePayNow}
                    onPayLater={handlePayLater}
                    onInstallmentPayNow={handleInstallmentPayNow}
                    onInstallmentPayLater={handleInstallmentPayLater}
                  />
                </>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <img src={bookingData?.hotel?.image || ''} alt={bookingData?.hotel?.name || 'Hotel'} loading="lazy"
                  className="w-full h-32 object-cover rounded-lg mb-3" />
                <div className="flex items-center gap-2 mb-2">{renderStars(bookingData?.hotel?.stars || 5)}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{bookingData?.hotel?.name || 'Hotel Name'}</h4>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  {bookingData?.hotel?.location || 'Makkah'}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="text-sm text-gray-600">
                  Occupancy: <span className="font-medium">{bookingData?.roomType || 'Not selected'}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Guests: <span className="font-medium">{bookingData?.guests || '1 Guest'}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Room Capacity</span>
                    <span>{numPersons} person{numPersons > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Per Person</span>
                    <div className="text-right">
                      <div>${perPersonUSD.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{formatNaira(perPersonNGN)}</div>
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center text-sm text-gray-700 mb-3">
                      <span>Paying for:</span>
                      <span className="font-semibold text-[#D4AF37]">{selectedPersonCount} of {numPersons} person{numPersons > 1 ? 's' : ''}</span>
                    </div>
                    <div className="bg-[#D4AF37]/10 rounded-lg p-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>You Pay</span>
                        <div className="text-right">
                          <div className="text-[#D4AF37]">${totalUSD.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{formatNaira(totalNaira)}</div>
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

      {/* Processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 text-center shadow-2xl"
          >
            <Loader className="w-10 h-10 text-[#D4AF37] animate-spin mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Processing your booking...</p>
            <p className="text-sm text-gray-500 mt-2">Please do not close this page</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
