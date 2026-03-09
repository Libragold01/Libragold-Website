import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, Users, MapPin, ArrowRight, CheckCircle, Clock, Globe, User, Plus, X, Star } from 'lucide-react';
import { WEB3FORMS_KEY } from '../config';
import { apiService } from '../services/api';

interface TicketingFormProps {
  onFormSubmitted?: (details?: any) => void;
}

export function TicketingForm({ onFormSubmitted }: TicketingFormProps) {
  const [formData, setFormData] = useState({
    tripType: 'round-trip',
    passengers: 1,
    class: 'economy',
    fullName: '',
    passportNumber: '',
    email: '',
    phone: '',
    referralCode: '',
  });

  const [flights, setFlights] = useState([
    { from: '', to: '', departureDate: '', returnDate: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFlightChange = (index: number, field: string, value: string) => {
    setFlights(prev => prev.map((flight, i) =>
      i === index ? { ...flight, [field]: value } : flight
    ));
  };

  const addFlight = () => {
    setFlights(prev => [...prev, { from: '', to: '', departureDate: '', returnDate: '' }]);
  };

  const removeFlight = (index: number) => {
    if (flights.length > 1) {
      setFlights(prev => prev.filter((_, i) => i !== index));
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('flight-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  async function submitToBackend() {
    try {
      await apiService.createBooking({
        service: 'Ticketing',
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        referralCode: formData.referralCode || undefined,
        details: {
          tripType: formData.tripType,
          passengers: formData.passengers,
          class: formData.class,
          passportNumber: formData.passportNumber,
          flights: JSON.stringify(flights),
        },
      });
    } catch { /* non-fatal */ }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);

    const web3FormData = new FormData();
    web3FormData.append('access_key', WEB3FORMS_KEY);
    web3FormData.append('subject', 'Flight Ticket Booking Request');
    web3FormData.append('tripType', formData.tripType);
    web3FormData.append('passengers', formData.passengers.toString());
    web3FormData.append('class', formData.class);
    web3FormData.append('fullName', formData.fullName);
    web3FormData.append('passportNumber', formData.passportNumber);
    web3FormData.append('email', formData.email);
    web3FormData.append('phone', formData.phone);
    web3FormData.append('flights', JSON.stringify(flights));
    if (formData.referralCode) web3FormData.append('referralCode', formData.referralCode);

    try {
      const [response] = await Promise.all([
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: web3FormData }),
        submitToBackend(),
      ]);
      if (response.ok) setShowSuccessModal(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }

    const ticketDetails = {
      service: 'Ticket Form Completed',
      message: 'A service rep will follow up via mail/whatsapp to give the cheapest flight available',
      flights,
      passengers: formData.passengers,
      class: formData.class,
      tripType: formData.tripType,
      personalInfo: { fullName: formData.fullName, passportNumber: formData.passportNumber, email: formData.email, phone: formData.phone },
      bookingDate: new Date().toLocaleDateString(),
    };
    onFormSubmitted?.(ticketDetails);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({ tripType: 'round-trip', passengers: 1, class: 'economy', fullName: '', passportNumber: '', email: '', phone: '', referralCode: '' });
    setFlights([{ from: '', to: '', departureDate: '', returnDate: '' }]);
  };

  const whyChoose = [
    { icon: Globe, title: 'Global Destinations', desc: 'Access hundreds of destinations worldwide with our comprehensive network of airlines and partners.', color: 'from-blue-500 to-cyan-500' },
    { icon: Star, title: 'Best Fares Guaranteed', desc: 'We work with top airlines to bring you the most competitive fares for any budget or travel class.', color: 'from-yellow-500 to-orange-500' },
    { icon: Users, title: 'Group Bookings', desc: 'Specializing in group ticket bookings for families, business teams, and religious pilgrimages.', color: 'from-purple-500 to-pink-500' },
    { icon: MapPin, title: 'Multi-Destination', desc: 'Create customized multi-city itineraries for seamless connections to multiple destinations.', color: 'from-green-500 to-emerald-500' },
    { icon: Clock, title: '24/7 Support', desc: 'Our dedicated team is here to assist you anytime, ensuring a hassle-free booking experience.', color: 'from-red-500 to-pink-500' },
  ];

  const howItWorks = [
    { title: 'Submit Your Request', desc: 'Fill in your travel details — origin, destination, dates, passengers and preferred class.' },
    { title: 'We Search for You', desc: 'Our team searches across multiple airlines to find the best available fares and schedules.' },
    { title: 'Receive Your Options', desc: 'We contact you via email or WhatsApp with the best flight options tailored to your needs.' },
    { title: 'Confirm & Pay', desc: 'Choose your preferred flight, confirm the booking, and make payment securely through Libragold.' },
    { title: 'Get Your E-Ticket', desc: 'Receive your confirmed e-ticket and travel documents — ready to fly!' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={closeSuccessModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#D4AF37]/30"
              >
                <CheckCircle className="w-10 h-10 text-black" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Booking Request Submitted!</h3>
              <p className="text-gray-600 text-base mb-8 leading-relaxed">
                Thank you for choosing Libragold! A customer care representative will contact you shortly with the best available options.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeSuccessModal}
                className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-10 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section — gold gradient like Admission */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#F4E4C1] to-[#FFE5B4] py-20">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-300/30 rounded-full blur-lg" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <Plane className="w-6 h-6 text-black" />
                <span className="text-black font-semibold">Air Ticketing Services</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight"
            >
              Book Your Flights
              <span className="block bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                Anywhere in the World
              </span>
              <span className="block text-4xl md:text-5xl mt-2">with Libragold</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-black/70 max-w-4xl mx-auto leading-relaxed mb-10"
            >
              Fast, simple, and stress-free flight booking. Competitive fares, flexible options, and exceptional support for business, leisure, and religious travel.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={scrollToForm}
                className="px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Book a Flight
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-black font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300">
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-yellow-50/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Why Book with Libragold?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience seamless flight booking with unmatched support and the best fares</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChoose.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How Libragold Books Your Flight</h2>
          <div className="space-y-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-[#D4AF37]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Your Next Journey Starts Here</h2>
          <p className="text-xl text-black/80 mb-8">
            At Libragold, we're dedicated to making your travel seamless and affordable. From economy to first class, domestic to international — we've got you covered.
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div id="flight-form" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border"
          >
            {/* Form Header — gold like Admission */}
            <div className="bg-[#D4AF37] px-8 py-6">
              <h1 className="text-3xl font-bold text-black flex items-center gap-3">
                <Plane className="w-8 h-8" />
                Flight Booking Request
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Trip Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Trip Type</label>
                <div className="flex flex-wrap gap-4">
                  {['round-trip', 'one-way', 'multi-city'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        value={type}
                        checked={formData.tripType === type}
                        onChange={(e) => handleInputChange('tripType', e.target.value)}
                        className="text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <span className="font-medium capitalize">{type.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Flight Details */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">Flight Details</label>
                {flights.map((flight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-[#D4AF37]/5 rounded-xl p-6 border border-[#D4AF37]/20"
                  >
                    {formData.tripType === 'multi-city' && (
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Flight {index + 1}</h3>
                        {flights.length > 1 && (
                          <button type="button" onClick={() => removeFlight(index)} className="text-red-500 hover:text-red-700 p-1">
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                        <input type="text" placeholder="From" value={flight.from} onChange={(e) => handleFlightChange(index, 'from', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" required />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                        <input type="text" placeholder="To" value={flight.to} onChange={(e) => handleFlightChange(index, 'to', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" required />
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                        <input type="date" value={flight.departureDate} onChange={(e) => handleFlightChange(index, 'departureDate', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" required />
                      </div>
                      {formData.tripType === 'round-trip' && index === 0 && (
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                          <input type="date" placeholder="Return" value={flight.returnDate} onChange={(e) => handleFlightChange(index, 'returnDate', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" required />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {formData.tripType === 'multi-city' && (
                  <button type="button" onClick={addFlight}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors">
                    <Plus className="w-5 h-5" />
                    Add Another Flight
                  </button>
                )}
              </div>

              {/* Passengers & Class */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Passengers & Class</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                    <select value={formData.passengers} onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent appearance-none">
                      {[1,2,3,4,5,6,7,8,9].map(num => <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent">
                    <option value="0">0 Children</option>
                    {[1,2,3,4,5,6,7,8].map(num => <option key={num} value={num}>{num} Child{num > 1 ? 'ren' : ''} (2-12 yrs)</option>)}
                  </select>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent">
                    <option value="0">0 Infants</option>
                    {[1,2,3,4].map(num => <option key={num} value={num}>{num} Infant{num > 1 ? 's' : ''} (0-2 yrs)</option>)}
                  </select>
                  <select value={formData.class} onChange={(e) => handleInputChange('class', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent">
                    <option value="economy">Economy Class</option>
                    <option value="premium-economy">Premium Economy</option>
                    <option value="business">Business Class</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="border-t border-[#D4AF37]/20 pt-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" placeholder="Enter your full name" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number *</label>
                    <input type="text" placeholder="Enter your passport number" value={formData.passportNumber} onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Code <span className="text-gray-400 font-normal">(Optional — enter your LWA ambassador code)</span>
                    </label>
                    <input type="text" placeholder="e.g. LWA01" value={formData.referralCode}
                      onChange={(e) => handleInputChange('referralCode', e.target.value.toUpperCase())}
                      pattern="LWA[0-9]{2,4}" title="Enter a valid LWA code (e.g. LWA01)"
                      className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent uppercase" />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`px-8 py-4 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors shadow-lg flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Booking Request <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
