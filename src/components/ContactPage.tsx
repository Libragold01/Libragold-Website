import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const offices = [
  {
    city: 'Lagos',
    label: 'Head Office',
    address: 'Block 12, Suites 13-15, Odua International Model Plaza, Ojota, Lagos',
    phones: ['+234 803 817 6535', '+234 817 202 7446', '+234 817 202 7449']
  },
  {
    city: 'Abuja',
    label: 'Branch Office',
    address: 'Suite G13, Haramani Plaza, Plot 873, Shetima Mungono Crescent, Utako, Abuja',
    phones: ['+234 803 817 6535', '+234 817 202 7448', '+234 809 714 4448']
  },
  {
    city: 'Ibadan',
    label: 'Branch Office',
    address: 'Block A, First Floor, Agric Womai Complex, Bodija Market, beside Wema Bank, Oyo State',
    phones: ['+234 803 817 6535', '+234 707 581 2466']
  },
  {
    city: 'Ilorin',
    label: 'Branch Office',
    address: 'First Floor, Hadizah Complex, Western Reservoir Road, Olorunsogo/Mandate Market Road, (Opposite Dangote Cement Depot), Kwara State',
    phones: ['+234 803 817 6535', '+234 706 570 3300', '+234 707 582 7610']
  }
];

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        e.currentTarget.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                  <span>+234 817 202 7446</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  <span>info@libragoldtravels.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                  <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="access_key" value="dc98498a-5066-478d-99f3-8524d9412556" />
                <input type="text" name="name" placeholder="Your Name" required className="w-full p-3 border rounded-lg" />
                <input type="email" name="email" placeholder="Your Email" required className="w-full p-3 border rounded-lg" />
                <textarea name="message" placeholder="Your Message" rows={4} required className="w-full p-3 border rounded-lg"></textarea>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-sm">Message sent successfully!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-sm">Failed to send message. Please try again.</p>
                )}
              </form>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Offices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offices.map((office, index) => (
                <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37] mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900">{office.city} <span className="text-gray-500 font-normal">({office.label})</span></h3>
                      <p className="text-gray-600 text-sm mt-1">{office.address}</p>
                      <div className="mt-2 space-y-1">
                        {office.phones.map((phone, phoneIndex) => (
                          <p key={phoneIndex} className="text-[#D4AF37] font-semibold">{phone}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}