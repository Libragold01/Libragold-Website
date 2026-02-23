import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ThankYouModalProps {
  message: string;
}

export function ThankYouModal({ message }: ThankYouModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
      >
        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Submitted!</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{message}</p>
        <p className="text-sm text-gray-500 mb-6">
          Our team will reach out to you shortly via email or phone.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors shadow-lg"
        >
          <Home className="w-5 h-5" />
          Go Back Home
        </button>
      </motion.div>
    </div>
  );
}
