
import { motion } from 'framer-motion';
import { Award, Users, Globe, Clock, Heart, Shield, Star, Compass, CheckCircle, Target } from 'lucide-react';
import { SEO } from './SEO';

export function AboutPage() {
  const stats = [
    { icon: Clock, label: '28+', desc: 'Years Experience', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: '5,000+', desc: 'Happy Travelers', color: 'from-green-500 to-emerald-500' },
    { icon: Globe, label: '50+', desc: 'Destinations', color: 'from-purple-500 to-pink-500' },
    { icon: Award, label: '98%', desc: 'Success Rate', color: 'from-orange-500 to-red-500' }
  ];

  const values = [
    { icon: Heart, title: 'Customer First', desc: 'Your satisfaction is our priority' },
    { icon: Shield, title: 'Trust & Safety', desc: 'Secure and reliable travel experiences' },
    { icon: Star, title: 'Excellence', desc: 'Premium quality in every service' },
    { icon: Compass, title: 'Guidance', desc: '24/7 support throughout your journey' }
  ];

  return (
    <>
      <SEO
        title="About Us — Libragold Group"
        description="Learn about Libragold Group, Nigeria's leading travel and pilgrimage company providing Umrah, Hajj, tours, visa and hotel services."
        canonical="/about"
        keywords="Libragold Group, about us, Nigeria travel company, Hajj company Nigeria, Umrah company Nigeria"
      />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-[#D4AF37] to-gray-900 bg-clip-text text-transparent">
                About LibraGold
              </h1>
            </div>
            
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Since <span className="text-[#D4AF37] font-bold">1996</span>, we've been Nigeria's most trusted travel partner, 
              transforming dreams into unforgettable journeys across the globe.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="relative group"
            >
              <div className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white text-center shadow-xl`}>
                <stat.icon className="w-10 h-10 mx-auto mb-4 opacity-90" />
                <div className="text-3xl font-bold mb-2">{stat.label}</div>
                <div className="text-sm opacity-90">{stat.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Founded in 1996</h3>
                  <p className="text-gray-600">Started as a small travel agency with a big vision to serve Nigerian travelers.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Pilgrimage Specialists</h3>
                  <p className="text-gray-600">Became Nigeria's leading Hajj and Umrah service provider with thousands of successful pilgrimages.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Global Expansion</h3>
                  <p className="text-gray-600">Extended services to include worldwide destinations, visa processing, and educational consultancy.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#D4AF37]/20 to-yellow-500/20 rounded-3xl p-8 backdrop-blur-sm border border-[#D4AF37]/20">
                <Target className="w-12 h-12 text-[#D4AF37] mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To provide seamless, reliable, and spiritually enriching travel experiences that connect 
                  Nigerian travelers to their destinations with comfort, safety, and peace of mind.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-xl text-gray-600">The principles that guide everything we do</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}