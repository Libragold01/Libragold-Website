import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, FileText, CreditCard, Loader, CheckCircle, Banknote, Clock, Layers, Home, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { lotusPayment } from '../services/lotusPayment';

// ─── Types ──────────────────────────────────────────────────────────────

interface PilgrimageBookingFormProps {
  packageDetails: {
    service: string;
    package: string;
    price?: { usd: string; naira: string };
    priceType?: string;
    occupancy?: Array<{ type: string; price: string }>;
    duration?: string;
    itinerary?: string;
    features?: string[];
    upgrade?: string;
    note?: string;
  };
  onBack: () => void;
  onFormSubmitted?: (details: any) => void;
}

type PaymentView = 'options' | 'installment';

// ─── Helpers ────────────────────────────────────────────────────────────

/** Convert price string like "₦5.7M" to a number in Naira (5700000) */
function parsePriceToNaira(priceStr: string): number {
  const cleaned = priceStr.replace(/[₦,\s]/g, '');
  if (cleaned.toUpperCase().endsWith('M')) {
    return parseFloat(cleaned.slice(0, -1)) * 1_000_000;
  }
  return parseFloat(cleaned) || 0;
}

/** Format a Naira amount like 2850000 → "₦2,850,000" */
function formatNaira(amount: number): string {
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

// ─── Component ──────────────────────────────────────────────────────────

export function PilgrimageBookingForm({ packageDetails, onBack, onFormSubmitted }: PilgrimageBookingFormProps) {
  const navigate = useNavigate();

  // Form step state
  const [currentStep, setCurrentStep] = useState(packageDetails.occupancy ? 0 : 1);
  const [selectedOccupancy, setSelectedOccupancy] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment options state
  const [paymentView, setPaymentView] = useState<PaymentView>('options');
  const [installmentCount, setInstallmentCount] = useState(2);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', dateOfBirth: '',
    gender: '', nationality: '', address: '',
    passportNumber: '', passportIssueDate: '', passportExpiryDate: '', placeOfIssue: '',
    emergencyName: '', emergencyPhone: '', emergencyRelation: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ─── Price helpers ──────────────────────────────────────────────────

  const currentPriceStr = selectedOccupancy?.price || packageDetails.price?.naira || '0';
  const totalAmountNaira = parsePriceToNaira(currentPriceStr);
  const installmentAmount = Math.ceil(totalAmountNaira / installmentCount);

  // ─── Web3Forms submission ───────────────────────────────────────────

  async function submitToWeb3Forms(paymentMethod: string, extraFields?: Record<string, string>) {
    const web3FormData = new FormData();
    web3FormData.append('access_key', 'dc98498a-5066-478d-99f3-8524d9412556');
    web3FormData.append('subject', `New Booking: ${packageDetails.service} - ${packageDetails.package}`);
    web3FormData.append('service', packageDetails.service);
    web3FormData.append('package', packageDetails.package);
    web3FormData.append('occupancy', selectedOccupancy?.type || packageDetails.priceType || 'N/A');
    web3FormData.append('price', currentPriceStr);
    web3FormData.append('paymentMethod', paymentMethod);

    // Personal data
    Object.entries(formData).forEach(([key, value]) => {
      web3FormData.append(key, value);
    });

    // Extra fields (e.g. installment info)
    if (extraFields) {
      Object.entries(extraFields).forEach(([key, value]) => {
        web3FormData.append(key, value);
      });
    }

    await fetch('https://api.web3forms.com/submit', { method: 'POST', body: web3FormData });
  }

  // ─── Lotus Bank payment ─────────────────────────────────────────────

  async function initiateLotusPayment(amount: number) {
    const paymentRequest = {
      amount,
      currency: 'NGN',
      email: formData.email,
      reference: lotusPayment.generateReference(),
      callback_url: window.location.origin + '/payment/success',
      metadata: {
        service: packageDetails.service,
        package: packageDetails.package,
        occupancy: selectedOccupancy?.type || packageDetails.priceType || 'N/A',
        customer_name: formData.fullName,
        phone: formData.phone,
        passport: formData.passportNumber,
      },
    };

    const response = await lotusPayment.initializePayment(paymentRequest);

    if (response.status && response.data?.authorization_url) {
      window.location.href = response.data.authorization_url;
    } else {
      throw new Error(response.message || 'Payment initialization failed. Please try again.');
    }
  }

  // ─── Payment action handlers ────────────────────────────────────────

  async function handlePayNow() {
    setIsProcessing(true);
    try {
      await submitToWeb3Forms('Pay Now - Full Payment');
      await initiateLotusPayment(totalAmountNaira);
    } catch (error: any) {
      alert(error.message || 'Unable to process payment. Please try again.');
      setIsProcessing(false);
    }
  }

  async function handlePayLater() {
    setIsProcessing(true);
    try {
      await submitToWeb3Forms('Pay Later');
      setThankYouMessage(`Thank you for filling the form for ${packageDetails.package}`);
      setShowThankYou(true);
    } catch {
      alert('Unable to submit your booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleInstallmentPayNow() {
    setIsProcessing(true);
    try {
      await submitToWeb3Forms('Libragold PSS - First Installment', {
        installmentPlan: `${installmentCount} payments`,
        installmentAmount: formatNaira(installmentAmount),
        totalAmount: formatNaira(totalAmountNaira),
      });
      await initiateLotusPayment(installmentAmount);
    } catch (error: any) {
      alert(error.message || 'Unable to process payment. Please try again.');
      setIsProcessing(false);
    }
  }

  async function handleInstallmentPayLater() {
    setIsProcessing(true);
    try {
      await submitToWeb3Forms('Libragold PSS - Start Later', {
        installmentPlan: `${installmentCount} payments`,
        installmentAmount: formatNaira(installmentAmount),
        totalAmount: formatNaira(totalAmountNaira),
      });
      setThankYouMessage(
        `Thank you for filling the form for ${packageDetails.package} and choosing Libragold PSS`
      );
      setShowThankYou(true);
    } catch {
      alert('Unable to submit your booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  // ─── Step navigation ────────────────────────────────────────────────

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };
  const handlePrevStep = () => {
    const minStep = packageDetails.occupancy ? 0 : 1;
    if (currentStep > minStep) setCurrentStep(currentStep - 1);
  };

  // ─── Thank You Modal ───────────────────────────────────────────────

  if (showThankYou) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Submitted!</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{thankYouMessage}</p>
          <p className="text-sm text-gray-500 mb-6">
            Our team will reach out to you shortly via email or phone.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors shadow-lg"
          >
            <Home className="w-5 h-5" />
            Go Back Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────

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
            <span className="font-medium">Back to Packages</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {(packageDetails.occupancy ? [0, 1, 2, 3] : [1, 2, 3]).map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs ${
                currentStep >= step ? 'bg-[#D4AF37] text-black' : 'bg-gray-200 text-gray-500'
              }`}>
                {step === 0 ? 'R' : step}
              </div>
              {step < 3 && (
                <div className={`w-20 h-1 mx-4 ${
                  currentStep > step ? 'bg-[#D4AF37]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Package Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-600">Service:</span>
              <div className="font-semibold">{packageDetails.service}</div>
            </div>
            <div>
              <span className="text-gray-600">Package:</span>
              <div className="font-semibold">{packageDetails.package}{packageDetails.priceType ? ` - ${packageDetails.priceType}` : ''}</div>
            </div>
            <div>
              <span className="text-gray-600">Price:</span>
              <div className="text-xl font-bold text-[#D4AF37]">
                {selectedOccupancy ? `${selectedOccupancy.price} (${selectedOccupancy.type})` : packageDetails.price?.naira || 'Select occupancy'}
              </div>
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <form onSubmit={(e) => e.preventDefault()}>

            {/* Step 0: Room Occupancy Selection (for Hajj packages) */}
            {currentStep === 0 && packageDetails.occupancy && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Room Occupancy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packageDetails.occupancy.map((occ, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedOccupancy(occ)}
                      className={`p-6 border-2 rounded-xl text-left transition-all ${
                        selectedOccupancy?.type === occ.type
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-lg'
                          : 'border-gray-200 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div className="text-lg font-bold text-gray-900 mb-2">{occ.type} Occupancy</div>
                      <div className="text-2xl font-bold text-[#D4AF37]">{occ.price}</div>
                      <div className="text-sm text-gray-600 mt-2">per person</div>
                    </button>
                  ))}
                </div>
                {packageDetails.upgrade && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                    {packageDetails.upgrade}
                  </div>
                )}
                {packageDetails.note && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                    {packageDetails.note}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                  <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                    <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} required rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Passport & Emergency Contact */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-6 h-6 text-[#D4AF37]" />
                  <h3 className="text-2xl font-bold text-gray-900">Passport & Emergency Contact</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number *</label>
                    <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Place of Issue *</label>
                    <input type="text" name="placeOfIssue" value={formData.placeOfIssue} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
                    <input type="date" name="passportIssueDate" value={formData.passportIssueDate} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                    <input type="date" name="passportExpiryDate" value={formData.passportExpiryDate} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
                    <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone *</label>
                    <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                    <select name="emergencyRelation" value={formData.emergencyRelation} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent">
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

            {/* Step 3: Payment Options */}
            {currentStep === 3 && (
              <AnimatePresence mode="wait">
                {paymentView === 'options' && (
                  <motion.div
                    key="options"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                      <h3 className="text-2xl font-bold text-gray-900">Choose Payment Option</h3>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                      <div className="text-3xl font-bold text-[#D4AF37]">{formatNaira(totalAmountNaira)}</div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Pay Now */}
                      <button
                        type="button"
                        onClick={handlePayNow}
                        disabled={isProcessing}
                        className="group relative flex items-center gap-4 p-6 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] rounded-xl text-left hover:shadow-xl transition-all disabled:opacity-50"
                      >
                        <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Banknote className="w-6 h-6 text-black" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-black">Pay Now</h4>
                          <p className="text-sm text-black/70">Complete full payment immediately via Lotus Bank</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-black/60 group-hover:translate-x-1 transition-transform" />
                      </button>

                      {/* Pay Later */}
                      <button
                        type="button"
                        onClick={handlePayLater}
                        disabled={isProcessing}
                        className="group relative flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl text-left hover:border-[#D4AF37] hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">Pay Later</h4>
                          <p className="text-sm text-gray-600">Submit your booking and pay at a later time</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </button>

                      {/* Pay Small Small */}
                      <button
                        type="button"
                        onClick={() => setPaymentView('installment')}
                        disabled={isProcessing}
                        className="group relative flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl text-left hover:border-[#D4AF37] hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Layers className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">Pay Small Small</h4>
                          <p className="text-sm text-gray-600">Split your payment into installments with Libragold PSS</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4">
                      <span>Payments Powered & Secured By</span>
                      <span className="font-semibold text-[#D4AF37]">Lotus Bank</span>
                    </div>
                  </motion.div>
                )}

                {paymentView === 'installment' && (
                  <motion.div
                    key="installment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-6 h-6 text-[#D4AF37]" />
                      <h3 className="text-2xl font-bold text-gray-900">Libragold PSS</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Pay Small Small — split your package cost into equal installments</p>

                    {/* Total price reminder */}
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                      <span className="text-gray-600">Total Package Price</span>
                      <span className="text-xl font-bold text-gray-900">{formatNaira(totalAmountNaira)}</span>
                    </div>

                    {/* Installment selector */}
                    <div className="bg-white border-2 border-[#D4AF37]/30 rounded-xl p-6 space-y-4">
                      <label className="block text-sm font-semibold text-gray-900">
                        How many installments do you want to pay?
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={2}
                          max={12}
                          value={installmentCount}
                          onChange={(e) => setInstallmentCount(Number(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                        />
                        <div className="w-16 text-center">
                          <span className="text-2xl font-bold text-[#D4AF37]">{installmentCount}</span>
                          <div className="text-xs text-gray-500">times</div>
                        </div>
                      </div>

                      <div className="bg-[#D4AF37]/5 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-600 mb-1">You pay per installment</div>
                        <div className="text-3xl font-bold text-[#D4AF37]">{formatNaira(installmentAmount)}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {installmentCount} payments of {formatNaira(installmentAmount)}
                        </div>
                      </div>
                    </div>

                    {/* Installment action buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={handleInstallmentPayNow}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Banknote className="w-5 h-5" />}
                        Make First Payment Now
                      </button>

                      <button
                        type="button"
                        onClick={handleInstallmentPayLater}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-[#D4AF37] hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Clock className="w-5 h-5" />}
                        Start Payment Later
                      </button>
                    </div>

                    {/* Back to payment options */}
                    <button
                      type="button"
                      onClick={() => setPaymentView('options')}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#D4AF37] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Payment Options
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Navigation Buttons (Steps 0-2 only) */}
            {currentStep < 3 && (
              <div className="flex justify-between mt-8">
                {currentStep > (packageDetails.occupancy ? 0 : 1) && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={currentStep === 0 && !selectedOccupancy}
                  className={`ml-auto px-6 py-3 font-semibold rounded-lg transition-colors ${
                    currentStep === 0 && !selectedOccupancy
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#D4AF37] text-black hover:bg-[#F4E4C1]'
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            {/* Previous button for Step 3 */}
            {currentStep === 3 && paymentView === 'options' && (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Processing overlay */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
              <Loader className="w-10 h-10 text-[#D4AF37] animate-spin mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Processing your booking...</p>
              <p className="text-sm text-gray-500 mt-2">Please do not close this page</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
