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
  features: ['Umrah Performance', 'Prophet\'s Mosque Visit', 'Ziyarat Tours', 'Religious Guidance', 'Comfortable Accommodation', 'Group Activities']
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
  const containerRef = useRef(null);
  return <section ref={containerRef} className="py-16 sm:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Upcoming Tours
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Handpicked destinations waiting for you
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scroll - Responsive */}
      <div className="relative overflow-hidden">
        <motion.div animate={{
        x: [0, -100 * tours.length]
      }} transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }} className="flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 pb-8">
          {[...tours, ...tours].map((tour, index) => <motion.div key={`${tour.name}-${index}`} initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: (index % tours.length) * 0.1
        }} whileHover={{
          y: -8,
          scale: 1.02
        }} onClick={() => onTourClick({
          name: tour.name,
          image: tour.image,
          location: tour.location,
          duration: tour.duration,
          rating: tour.rating,
          price: tour.priceDetails,
          features: tour.features
        })} className="group flex-shrink-0 w-[260px] sm:w-[320px] lg:w-[380px] cursor-pointer">
              <div className="relative h-[360px] sm:h-[420px] lg:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-soft">
                <img src={tour.image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-dark text-white text-xs sm:text-sm font-medium">
                    {tour.date}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-white/80 mb-2 sm:mb-3">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{tour.location}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
                    {tour.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-[#D4AF37] font-semibold text-base sm:text-lg">
                      {tour.price}
                    </span>
                    <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
}