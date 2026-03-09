import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Ticketing', path: '/ticketing' },
  { name: 'Admission', path: '/admission' },
  { name: 'Hotels', path: '/hotels' },
  { name: 'Pilgrimages', path: '/pilgrimages' },
  { name: 'Visas', path: '/visas' },
  { name: 'Gallery', path: '/gallery' }
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <Link to="/">
              <img
                src="/Images/Logo/LOGO PNG.png"
                alt="LibraGold"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative group ${
                    scrolled
                      ? isActive
                        ? 'text-[#D4AF37]'
                        : 'text-gray-700 hover:text-[#D4AF37]'
                      : isActive
                      ? 'text-[#D4AF37]'
                      : 'text-white/90 hover:text-white'
                  }`
                }
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full" />
              </NavLink>
            ))}
          </nav>

          {/* CTA Button - Hidden on mobile */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/pilgrimages"
              className="hidden lg:block px-4 xl:px-6 py-2 sm:py-2.5 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors text-sm"
            >
              Book Now
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Slide Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl z-50 overflow-hidden"
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <img src="/Images/Logo/LOGO PNG.png" alt="LibraGold" className="h-10 w-auto" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block w-full text-left py-4 px-4 rounded-xl font-medium transition-all border ${
                        isActive
                          ? 'text-[#D4AF37] bg-white/10 border-[#D4AF37]/30'
                          : 'text-white hover:text-[#D4AF37] hover:bg-white/10 border-white/10 hover:border-[#D4AF37]/30'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <Link
                  to="/pilgrimages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full mt-6 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black font-bold rounded-full hover:from-[#F4E4C1] hover:to-yellow-400 transition-all shadow-xl text-center"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
