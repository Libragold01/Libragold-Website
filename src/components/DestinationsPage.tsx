
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { SEO } from './SEO';

const destinations = [
  { name: 'Saudi Arabia', description: 'Holy cities of Makkah and Madinah for Umrah and Hajj', rating: 4.9, trips: '2,500+' },
  { name: 'UAE', description: 'Dubai and Abu Dhabi business and leisure travel', rating: 4.8, trips: '1,200+' },
  { name: 'Turkey', description: 'Istanbul cultural and historical tours', rating: 4.7, trips: '800+' },
  { name: 'Egypt', description: 'Cairo and ancient wonders exploration', rating: 4.6, trips: '600+' },
  { name: 'Qatar', description: 'Doha modern city and cultural experiences', rating: 4.8, trips: '400+' },
  { name: 'South Africa', description: 'Cape Town and Johannesburg adventures', rating: 4.5, trips: '300+' }
];

export function DestinationsPage() {
  return (
    <>
      <SEO
        title="Destinations — Libragold Group"
        description="Explore our travel destinations including Saudi Arabia, UAE, Turkey, Egypt, Qatar and more. Libragold Group offers curated journeys worldwide."
        canonical="/destinations"
        keywords="travel destinations Nigeria, Saudi Arabia tours, UAE tours, Turkey tours, Egypt tours, Qatar tours"
      />
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Destinations</h1>
          <p className="text-xl text-gray-600 mb-12">
            Discover amazing destinations with our expertly crafted travel packages
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">{destination.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{destination.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{destination.trips} trips completed</span>
                  <button className="text-[#D4AF37] font-semibold hover:text-[#B8941F] transition-colors">
                    View Packages
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}