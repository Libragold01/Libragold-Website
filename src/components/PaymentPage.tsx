import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, Loader } from 'lucide-react';
import { lotusPayment, PaymentRequest } from '../services/lotusPayment';
import { PaymentOptions, formatNaira } from './shared/PaymentOptions';
import { ThankYouModal } from './shared/ThankYouModal';

interface PaymentPageProps {
  bookingDetails: any;
  onBack: () => void;
  onPaymentComplete: (details: any) => void;
}

export function PaymentPage({ bookingDetails, onBack }: PaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState('');

  // ─── Resolve total amount in Naira ───────────────────────────────────────

  const totalNaira: number = (() => {
    if (bookingDetails?.amountNGN) return bookingDetails.amountNGN;
    if (bookingDetails?.amountUSD) return bookingDetails.amountUSD * 1510;
    const amountStr = bookingDetails?.price?.usd?.replace(/[$,]/g, '') || '200';
    return parseFloat(amountStr) * 1510;
  })();

  const email: string = bookingDetails?.personalData?.email || 'customer@libragold.com';

  // ─── Helpers ─────────────────────────────────────────────────────────────

  async function submitToWeb3Forms(paymentMethod: string, extraFields?: Record<string, string>) {
    const web3FormData = new FormData();
    web3FormData.append('access_key', 'dc98498a-5066-478d-99f3-8524d9412556');
    web3FormData.append('subject', `Payment: ${bookingDetails?.service} - ${bookingDetails?.package}`);
    web3FormData.append('service', bookingDetails?.service || '');
    web3FormData.append('package', bookingDetails?.package || '');
    web3FormData.append('paymentMethod', paymentMethod);
    web3FormData.append('totalAmount', formatNaira(totalNaira));
    if (bookingDetails?.personalData) {
      Object.entries(bookingDetails.personalData).forEach(([key, value]) => {
        web3FormData.append(key, String(value));
      });
    }
    if (extraFields) {
      Object.entries(extraFields).forEach(([key, value]) => {
        web3FormData.append(key, value);
      });
    }
    await fetch('https://api.web3forms.com/submit', { method: 'POST', body: web3FormData });
  }

  async function initiateLotusPayment(amount: number) {
    const paymentRequest: PaymentRequest = {
      amount,
      currency: 'NGN',
      email,
      reference: lotusPayment.generateReference(),
      callback_url: window.location.origin + '/payment/callback',
      metadata: {
        service: bookingDetails?.service,
        package: bookingDetails?.package,
        customer_name: bookingDetails?.personalData?.fullName || 'Customer',
      },
    };
    const response = await lotusPayment.initializePayment(paymentRequest);
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
      setThankYouMessage(`Thank you for your booking — ${bookingDetails?.service}. Our team will contact you to arrange payment.`);
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
      setThankYouMessage(`Thank you for your booking — ${bookingDetails?.service}. We will contact you to start your Libragold PSS installment plan.`);
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Payment Options */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
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
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-right">{bookingDetails?.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium text-right">{bookingDetails?.package}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <div className="text-right">
                      <div className="text-[#D4AF37]">{bookingDetails?.price?.usd}</div>
                      <div className="text-sm text-gray-600">{bookingDetails?.price?.naira}</div>
                    </div>
                  </div>
                </div>
              </div>
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
