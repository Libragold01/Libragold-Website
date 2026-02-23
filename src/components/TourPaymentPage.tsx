import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, CheckCircle, Clock, Loader } from 'lucide-react';
import { lotusPayment } from '../services/lotusPayment';
import { PaymentOptions, formatNaira } from './shared/PaymentOptions';
import { ThankYouModal } from './shared/ThankYouModal';

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

export function TourPaymentPage({ bookingData, onBack }: TourPaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState('');

  // ─── Resolve total amount ─────────────────────────────────────────────────

  const basePrice = parseFloat(bookingData.tour.price.replace(/[^0-9.]/g, '')) || 0;
  const travelers = bookingData.personalData?.numberOfTravelers || 1;
  const subtotal = basePrice * travelers;
  const serviceCharge = subtotal * 0.05;
  const totalUSD = subtotal + serviceCharge;
  const totalNaira = Math.round(totalUSD * 1510);

  const email: string = bookingData.personalData?.email || 'customer@libragold.com';

  // ─── Helpers ──────────────────────────────────────────────────────────────

  async function submitToWeb3Forms(paymentMethod: string, extraFields?: Record<string, string>) {
    const web3FormData = new FormData();
    web3FormData.append('access_key', 'dc98498a-5066-478d-99f3-8524d9412556');
    web3FormData.append('subject', `Tour Booking: ${bookingData.tour.name}`);
    web3FormData.append('tourName', bookingData.tour.name);
    web3FormData.append('duration', bookingData.tour.duration);
    web3FormData.append('travelers', String(travelers));
    web3FormData.append('travelDate', bookingData.personalData?.travelDate || '');
    web3FormData.append('paymentMethod', paymentMethod);
    web3FormData.append('totalUSD', `$${totalUSD.toFixed(2)}`);
    web3FormData.append('totalNaira', formatNaira(totalNaira));
    const name = `${bookingData.personalData?.firstName || ''} ${bookingData.personalData?.lastName || ''}`.trim();
    web3FormData.append('customerName', name);
    web3FormData.append('email', email);
    web3FormData.append('phone', bookingData.personalData?.phone || '');
    if (extraFields) {
      Object.entries(extraFields).forEach(([key, value]) => {
        web3FormData.append(key, value);
      });
    }
    await fetch('https://api.web3forms.com/submit', { method: 'POST', body: web3FormData });
  }

  async function initiateLotusPayment(amount: number) {
    const response = await lotusPayment.initializePayment({
      amount,
      currency: 'NGN',
      email,
      reference: lotusPayment.generateReference(),
      callback_url: window.location.origin + '/payment/success',
      metadata: {
        service: 'Tour Booking',
        tour_name: bookingData.tour.name,
        travelers,
        travel_date: bookingData.personalData?.travelDate,
        customer_name: `${bookingData.personalData?.firstName || ''} ${bookingData.personalData?.lastName || ''}`.trim(),
        phone: bookingData.personalData?.phone,
        amount_usd: totalUSD,
      },
    });
    if (response.status && response.data?.authorization_url) {
      window.location.href = response.data.authorization_url;
    } else {
      throw new Error(response.message || 'Payment initialization failed. Please try again.');
    }
  }

  // ─── Payment Handlers ─────────────────────────────────────────────────────

  async function handlePayNow() {
    setIsProcessing(true);
    try {
      await submitToWeb3Forms('Pay Now - Full Payment');
      await initiateLotusPayment(totalNaira);
    } catch (error: any) {
      alert(error.message || 'Unable to process payment. Please try again.');
      setIsProcessing(false);
    }
  }

  async function handlePayLater() {
    setIsProcessing(true);
    try {
      await submitToWeb3Forms('Pay Later');
      setThankYouMessage(`Thank you for booking the ${bookingData.tour.name} tour. Our team will contact you to arrange payment.`);
      setShowThankYou(true);
    } catch {
      alert('Unable to submit your booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleInstallmentPayNow(installmentAmount: number, installmentCount: number) {
    setIsProcessing(true);
    try {
      await submitToWeb3Forms('Libragold PSS - First Installment', {
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
      await submitToWeb3Forms('Libragold PSS - Start Later', {
        installmentPlan: `${installmentCount} payments`,
        installmentAmount: formatNaira(installmentAmount),
      });
      setThankYouMessage(`Thank you for booking the ${bookingData.tour.name} tour and choosing Libragold PSS. We will contact you to start your installment plan.`);
      setShowThankYou(true);
    } catch {
      alert('Unable to submit your booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

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
            <span className="font-medium">Back to Booking</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <img src={bookingData.tour.image} alt={bookingData.tour.name} loading="lazy" className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Choose Payment Option</h1>
              <p className="text-gray-600">{bookingData.tour.name} • {bookingData.tour.duration}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Options */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                <h2 className="text-xl font-bold text-gray-900">Payment Options</h2>
              </div>

              <PaymentOptions
                totalNaira={totalNaira}
                isProcessing={isProcessing}
                onPayNow={handlePayNow}
                onPayLater={handlePayLater}
                onInstallmentPayNow={handleInstallmentPayNow}
                onInstallmentPayLater={handleInstallmentPayLater}
              />
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
                  <span className="font-medium">{travelers}</span>
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
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#D4AF37]">${totalUSD.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{formatNaira(totalNaira)}</div>
                  </div>
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
