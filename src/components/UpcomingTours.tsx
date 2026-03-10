import { useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

const tours = [{
  name: 'Egypt Heritage',
  image: '/Images/Tour Cards/Egypt.jpeg',
  date: 'March 2025',
  location: 'Cairo & Luxor',
  price: 'From $2,800',
  duration: '8 Days / 7 Nights',
  rating: 4.8,
  priceDetails: { usd: '$2,800', naira: '₦4,200,000' },
  features: ['Ancient Pyramids Tour', 'Nile River Cruise', 'Valley of Kings', 'Egyptian Museum', 'Local Cuisine Experience', 'Professional Guide']
}, {
  name: 'Turkey Explorer',
  image: '/Images/Tour Cards/Turkey.jpeg',
  date: 'April 2025',
  location: 'Istanbul & Cappadocia',
  price: 'From $2,500',
  duration: '7 Days / 6 Nights',
  rating: 4.7,
  priceDetails: { usd: '$2,500', naira: '₦3,750,000' },
  features: ['Hot Air Balloon Ride', 'Hagia Sophia Visit', 'Cappadocia Cave Hotels', 'Turkish Bath Experience', 'Grand Bazaar Shopping', 'Bosphorus Cruise']
}, {
  name: 'Qatar Luxury',
  image: '/Images/Tour Cards/Qatar.jpeg',
  date: 'May 2025',
  location: 'Doha, Qatar',
  price: 'From $3,200',
  duration: '5 Days / 4 Nights',
  rating: 4.9,
  priceDetails: { usd: '$3,200', naira: '₦4,800,000' },
  features: ['Luxury Desert Safari', 'Museum of Islamic Art', 'Pearl Island Tour', 'Souq Waqif Experience', 'Dhow Cruise', 'Fine Dining']
}, {
  name: 'Saudi Arabia Pilgrimage',
  image: '/Images/Tour Cards/Saudi Arabia.jpeg',
  date: 'June 2025',
  location: 'Makkah & Madinah',
  price: 'From $3,500',
  duration: '10 Days / 9 Nights',
  rating: 4.9,
  priceDetails: { usd: '$3,500', naira: '₦5,250,000' },
  features: ['Umrah Performance', "Prophet's Mosque Visit", 'Ziyarat Tours', 'Religious Guidance', 'Comfortable Accommodation', 'Group Activities']
}, {
  name: 'South Africa Safari',
  image: '/Images/Tour Cards/South Africa.jpeg',
  date: 'July 2025',
  location: 'Cape Town & Kruger',
  price: 'From $3,800',
  duration: '9 Days / 8 Nights',
  rating: 4.8,
  priceDetails: { usd: '$3,800', naira: '₦5,700,000' },
  features: ['Big Five Safari', 'Table Mountain Cable Car', 'Wine Tasting Tours', 'Robben Island Visit', 'Penguin Colony', 'Cape Point Tour']
}, {
  name: 'Nigeria Cultural',
  image: '/Images/Tour Cards/Nigeria.jpeg',
  date: 'August 2025',
  location: 'Lagos & Abuja',
  price: 'From $2,200',
  duration: '6 Days / 5 Nights',
  rating: 4.6,
  priceDetails: { usd: '$2,200', naira: '₦3,300,000' },
  features: ['Cultural Heritage Sites', 'Local Markets Tour', 'Traditional Cuisine', 'Art Galleries Visit', 'Music & Dance Shows', 'City Landmarks']
}];

interface UpcomingToursProps {
  onTourClick: (tour: any) => void;
}

export function UpcomingTours({ onTourClick }: UpcomingToursProps) {
  const mobileRef = useRef<HTMLDivElement>(null);

  const handleClick = (tour: typeof tours[0]) =>
    onTourClick({ name: tour.name, image: tour.image, location: tour.location, duration: tour.duration, rating: tour.rating, price: tour.priceDetails, features: tour.features });

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Upcoming Tours
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">Handpicked destinations waiting for you</p>
        </motion.div>
      </div>

      {/* ── Mobile: swipeable scroll-snap carousel ── */}
      <div className="md:hidden">
        <div
          ref={mobileRef}
          className="flex gap-4 px-4 overflow-x-auto pb-4 hide-scrollbar"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {tours.map((tour, index) => (
            <div
              key={tour.name}
              onClick={() => handleClick(tour)}
              className="flex-shrink-0 cursor-pointer"
              style={{ scrollSnapAlign: 'start', width: 'min(78vw, 300px)' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="relative h-[380px] rounded-2xl overflow-hidden shadow-soft active:scale-[0.98] transition-transform"
              >
                <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 rounded-full glass-dark text-white text-xs font-medium">{tour.date}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 text-white/80 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs">{tour.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tour.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[#D4AF37] font-semibold">{tour.price}</span>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-2 pb-2">Swipe to explore</p>
      </div>

      {/* ── Desktop: infinite auto-scroll marquee ── */}
      <div className="hidden md:block relative overflow-hidden">
        <motion.div
          animate={{ x: [0, -(380 + 24) * tours.length] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-6 px-6 lg:px-8 pb-8"
        >
          {[...tours, ...tours].map((tour, index) => (
            <motion.div
              key={`${tour.name}-${index}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % tours.length) * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleClick(tour)}
              className="group flex-shrink-0 w-[320px] lg:w-[380px] cursor-pointer"
            >
              <div className="relative h-[420px] lg:h-[480px] rounded-3xl overflow-hidden shadow-soft">
                <img src={tour.image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 rounded-full glass-dark text-white text-sm font-medium">{tour.date}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 text-white/80 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{tour.location}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">{tour.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[#D4AF37] font-semibold text-lg">{tour.price}</span>
                    <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
