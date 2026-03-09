
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';

interface BlogDetailPageProps {
  blog: {
    title: string;
    excerpt: string;
    date: string;
    category: string;
    icon: any;
    gradient: string;
  };
  onBack: () => void;
}

export function BlogDetailPage({ blog, onBack }: BlogDetailPageProps) {
  const IconComponent = blog.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Travel Insights
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className={`absolute inset-0 bg-gradient-to-br ${blog.gradient} opacity-20`}></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 border border-gray-200">
              <IconComponent className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm font-semibold text-gray-700">{blog.category}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">{blog.title}</h1>
            <div className="flex items-center justify-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Libragold Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                {blog.excerpt}
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                At Libragold Group, we are committed to providing exceptional travel experiences that combine spiritual fulfillment, 
                cultural exploration, and unparalleled service. Our {blog.title.toLowerCase()} represents our dedication to making 
                your journey memorable and hassle-free.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What's Included</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                  </div>
                  <span className="text-gray-700">Comprehensive visa processing and documentation support</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                  </div>
                  <span className="text-gray-700">Premium accommodation in carefully selected hotels</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                  </div>
                  <span className="text-gray-700">Professional guidance and 24/7 support throughout your journey</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                  </div>
                  <span className="text-gray-700">Transportation and logistics management</span>
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Choose Libragold?</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                With years of experience in the travel industry, Libragold Group has established itself as a trusted partner 
                for thousands of Nigerian travelers. Our commitment to excellence, attention to detail, and personalized service 
                ensure that every journey with us exceeds expectations.
              </p>

              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#F4E4C1]/10 rounded-xl p-6 border border-[#D4AF37]/20 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to Begin Your Journey?</h3>
                <p className="text-gray-700 mb-4">
                  Contact our team today to learn more about this package and start planning your unforgettable experience.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-lg">
                  Get Started
                </button>
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Share this article:</span>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
