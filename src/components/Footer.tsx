import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const offices = [
  {
    city: 'Lagos',
    label: 'Head Office',
    address: 'Block 12, Suites 13-15, Odua International Model Plaza, Ojota, Lagos',
    phone: '+234 817 202 7446'
  },
  {
    city: 'Ibadan',
    label: 'Branch Office',
    address: 'Block A, First Floor, Agric Womai Complex, Bodija Market, beside Wema Bank, Oyo State',
    phone: '+234 817 202 7446'
  },
  {
    city: 'Abuja',
    label: 'Branch Office',
    address: 'Suite G13, Haramani Plaza, Plot 873, Shetima Mungono Crescent, Utako, Abuja',
    phone: '+234 817 202 7446'
  },
  {
    city: 'Ilorin',
    label: 'Branch Office',
    address: 'First Floor, Hadizah Complex, Western Reservoir Road, Olorunsogo/Mandate Market Road, (Opposite Dangote Cement Depot), Kwara State',
    phone: '+234 817 202 7446'
  }
];

const serviceLinks = [
  { name: 'Tour Packages', path: '/tours' },
  { name: 'Hajj & Umrah', path: '/pilgrimages' },
  { name: 'Visa Processing', path: '/visas' },
  { name: 'Study Abroad', path: '/admission' },
  { name: 'Hotel Booking', path: '/hotels' }
];

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Our Services', path: '/services' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'FAQs', path: '/faq' },
  { name: 'Terms & Conditions', path: '/terms' }
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link to="/">
              <img
                src="/Images/Logo/LOGO PNG.png"
                alt="LibraGold"
                className="h-12 sm:h-16 w-auto mb-3 sm:mb-4"
              />
            </Link>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
              Your trusted partner for unforgettable journeys and seamless
              travel experiences since 1996.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <a
                href="tel:+2348172027446"
                className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span>+234 817 202 7446</span>
              </a>
              <a
                href="mailto:libragoldoperations@gmail.com"
                className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="break-all">libragoldoperations@gmail.com</span>
              </a>
            </div>

            {/* Social Media */}
            <div className="flex gap-2 sm:gap-3">
              <a
                href="https://www.instagram.com/libragoldtravel/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://web.facebook.com/libragoldgroup/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://x.com/libragoldgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@libragoldtravel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-[#D4AF37]">
              Services
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-[#D4AF37]">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Office Locations */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-[#D4AF37]">
              Our Offices
            </h4>
            <div className="space-y-4 sm:space-y-6">
              {offices.map((office) => (
                <div key={office.city} className="group">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm sm:text-base text-white mb-1">
                        {office.city}{' '}
                        <span className="text-gray-500 text-xs sm:text-sm font-normal">
                          ({office.label})
                        </span>
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                        {office.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
              © 2024 LibraGold. All Rights Reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-[#D4AF37] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 hover:text-[#D4AF37] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-500 hover:text-[#D4AF37] transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
