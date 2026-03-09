
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { SEO } from './SEO';

export function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Return to Libragold Group homepage."
        canonical="/404"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          <div className="mb-8">
            <motion.h1
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[150px] font-bold text-[#D4AF37] leading-none"
            >
              404
            </motion.h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
              Let us help you find your way back.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
