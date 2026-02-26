import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, Users, MapPin, ArrowRight, CheckCircle, Clock, Globe, Shield, User, Plus, X, Sparkles, Star } from 'lucide-react';
import { WEB3FORMS_KEY } from '../config';

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
    referralCode: '', // Optional LWA ambassador referral code
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormData
      });

      if (response.ok) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }

    const ticketDetails = {
      service: 'Ticket Form Completed',
      message: 'A service rep will follow up via mail/whatsapp to get give cheapest flight available',
      flights: flights,
      passengers: formData.passengers,
      class: formData.class,
      tripType: formData.tripType,
      personalInfo: {
        fullName: formData.fullName,
        passportNumber: formData.passportNumber,
        email: formData.email,
        phone: formData.phone
      },
      bookingDate: new Date().toLocaleDateString()
    };
    onFormSubmitted?.(ticketDetails);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Reset form after closing modal
    setFormData({
      tripType: 'round-trip',
      passengers: 1,
      class: 'economy',
      fullName: '',
      passportNumber: '',
      email: '',
      phone: '',
      referralCode: '',
    });
    setFlights([{ from: '', to: '', departureDate: '', returnDate: '' }]);
  };

  const services = [
    {
      title: 'Flight Bookings',
      description: 'Secure your tickets for local and international destinations in just a few clicks. We collaborate with top airlines to offer you the most convenient and cost-effective options.',
      icon: Plane
    },
    {
      title: 'Group Travel Tickets',
      description: 'Planning a group trip? Libragold specializes in group ticket bookings for family vacations, business teams, and religious pilgrimages like Hajj and Umrah.',
      icon: Users
    },
    {
      title: 'Multi-Destination Trips',
      description: 'Need to travel to more than one location? We create customized itineraries for seamless connections to multiple destinations.',
      icon: Globe
    },
    {
      title: 'Last-Minute Tickets',
      description: 'Unexpected trip? Libragold has you covered with quick and reliable last-minute booking services.',
      icon: Clock
    }
  ];

  const benefits = [
    { title: 'Affordable Prices', desc: 'Get access to the best deals and competitive fares for your destination.' },
    { title: 'Wide Range of Options', desc: 'From economy to first-class, we offer tickets for all budgets and preferences.' },
    { title: 'Global Destinations', desc: 'Explore hundreds of destinations worldwide with our comprehensive network of airlines.' },
    { title: 'Flexible Booking Policies', desc: 'Enjoy options for refunds, rescheduling, and multi-city itineraries.' },
    { title: '24/7 Customer Support', desc: 'Our dedicated team is here to assist you anytime, ensuring a hassle-free booking experience.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 relative overflow-hidden">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={closeSuccessModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Booking Form Submitted!
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Thanks for booking with us! A customer care representative will reach out to you immediately.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeSuccessModal}
                className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-8 py-3 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-[#D4AF37] transition-all duration-300 shadow-lg"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-10 w-6 h-6 text-[#D4AF37] opacity-20 animate-pulse" />
        <Star className="absolute top-40 right-20 w-4 h-4 text-yellow-400 opacity-30 animate-bounce" />
        <Plane className="absolute bottom-32 left-20 w-8 h-8 text-[#D4AF37] opacity-20 animate-pulse" style={{animationDuration: '3s'}} />
      </div>
      
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 flex items-center justify-center">
                <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-[#D4AF37] to-gray-900 bg-clip-text text-transparent text-center sm:text-left">
                Book Your Tickets with Ease
              </h1>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              Ready to explore the world or secure your next flight? <span className="text-[#D4AF37] font-bold">LibraGold</span> makes ticket booking fast, simple, and stress-free. Whether it's for business, leisure, or religious purposes, we offer competitive fares, flexible options, and exceptional customer support to ensure your journey starts smoothly.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-5xl mx-auto px-4 mb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#D4AF37]/20">
          <div className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 p-6">
            <h2 className="text-2xl font-bold text-black flex items-center gap-3">
              <Plane className="w-6 h-6" />
              Flight Search
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Trip Type Selection */}
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

            {/* Flight Details */}
            <div className="space-y-6">
              {flights.map((flight, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative bg-gradient-to-r from-[#D4AF37]/5 to-yellow-500/5 rounded-2xl p-6 border border-[#D4AF37]/20"
                >
                  {formData.tripType === 'multi-city' && (
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Flight {index + 1}</h3>
                      {flights.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeFlight(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                      <input 
                        type="text" 
                        placeholder="From" 
                        value={flight.from} 
                        onChange={(e) => handleFlightChange(index, 'from', e.target.value)} 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" 
                        required 
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                      <input 
                        type="text" 
                        placeholder="To" 
                        value={flight.to} 
                        onChange={(e) => handleFlightChange(index, 'to', e.target.value)} 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" 
                        required 
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                      <input 
                        type="date" 
                        value={flight.departureDate} 
                        onChange={(e) => handleFlightChange(index, 'departureDate', e.target.value)} 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" 
                        required 
                      />
                    </div>
                    {(formData.tripType === 'round-trip' && index === 0) && (
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                        <input 
                          type="date" 
                          value={flight.returnDate} 
                          onChange={(e) => handleFlightChange(index, 'returnDate', e.target.value)} 
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" 
                          required 
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {formData.tripType === 'multi-city' && (
                <motion.button
                  type="button"
                  onClick={addFlight}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Another Flight
                </motion.button>
              )}
            </div>

            {/* Passengers and Class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                <select 
                  value={formData.passengers} 
                  onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent appearance-none"
                >
                  {[1,2,3,4,5,6,7,8,9].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="0">0 Child</option>
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} Child{num > 1 ? 'ren' : ''} (2-12 yrs)</option>
                ))}
              </select>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="0">0 Infant</option>
                {[1,2,3,4].map(num => (
                  <option key={num} value={num}>{num} Infant{num > 1 ? 's' : ''} (0-2 yrs)</option>
                ))}
              </select>
              <select 
                value={formData.class} 
                onChange={(e) => handleInputChange('class', e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="economy">Economy Class</option>
                <option value="premium-economy">Premium Economy</option>
                <option value="business">Business Class</option>
                <option value="first">First Class</option>
              </select>
            </div>

            {/* Personal Information */}
            <div className="border-t border-[#D4AF37]/20 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-[#D4AF37]" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={formData.fullName} 
                  onChange={(e) => handleInputChange('fullName', e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Passport Number" 
                  value={formData.passportNumber} 
                  onChange={(e) => handleInputChange('passportNumber', e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" 
                  required 
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent" 
                  required 
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Referral Code (Optional — e.g. LWA01)"
                  value={formData.referralCode}
                  onChange={(e) => handleInputChange('referralCode', e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent uppercase"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className={`w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Search Flights <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Why Choose Section */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Book Your Tickets with Libragold?</h2>
          <p className="text-xl text-gray-600">At Libragold, we understand that every traveler's needs are unique. That's why we provide:</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-[#D4AF37]/10"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Ticketing Services</h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border border-[#D4AF37]/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}