import { motion } from 'framer-motion';

interface Partner {
  name: string;
  logo: string;
}

// Partners and Clients logos
const defaultPartners: Partner[] = [
  { name: 'IATA', logo: '/Images/Partners/IATA Logo.svg' },
  { name: 'Ministry of Hajj KSA', logo: '/Images/Partners/MIN OF HAJJ KSA.png' },
  { name: 'Golden Services for Umrah', logo: '/Images/Partners/Golden Sevices for Umrah co Logo.png' },
  { name: 'NANTA', logo: '/Images/Partners/NANTA Logo.jpg' },
  { name: 'Lagos Chamber of Commerce', logo: '/Images/Partners/Lagos chamber of commerce and industry LCCI Logo.png' },
  { name: 'Nigeria British Chamber of Commerce', logo: '/Images/Partners/Nigeria British Chanber of Commerce NBCC.svg' },
  { name: 'ICAN', logo: '/Images/Partners/ICAN logo.png' },
  { name: 'Lotus Bank', logo: '/Images/Partners/Lotus bank Logo.svg' },
  { name: 'NDPHC', logo: '/Images/Partners/NDPHC logo.png' },
  { name: 'Arit of Africa', logo: '/Images/Partners/Arit of Africa logo.png' },
  { name: 'AHUON', logo: '/Images/Partners/AHUON Logo.jpg' },
  { name: 'Gasum', logo: '/Images/Partners/Gasum Logo.svg' },
  { name: 'See Gas', logo: '/Images/Partners/See Gas Logo.svg' },
  { name: 'Trifecta', logo: '/Images/Partners/Trifecta Logo.png' },
];

interface PartnersClientsProps {
  partners?: Partner[];
  title?: string;
  subtitle?: string;
}

export function PartnersClients({
  partners = defaultPartners,
  title = "Our Trusted Partners & Clients",
  subtitle = "Working with leading organizations worldwide"
}: PartnersClientsProps) {
  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Scrolling Logo Container */}
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling logos */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-8 sm:gap-12 md:gap-16"
              animate={{
                x: [0, -50 * partners.length * 4],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: partners.length * 5,
                  ease: "linear",
                },
              }}
            >
              {duplicatedPartners.map((partner, index) => (
                <motion.div
                  key={`${partner.name}-${index}`}
                  className="flex-shrink-0 w-32 sm:w-40 md:w-48 h-20 sm:h-24 md:h-28 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'placeholder w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm';
                        placeholder.textContent = partner.name;
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Static Grid Alternative for smaller screens or when animation is disabled */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hidden mt-12 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
