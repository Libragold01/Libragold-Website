import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Home, Phone, Mail } from 'lucide-react';
import { SEO } from './SEO';

type PaymentStatus = 'success' | 'failed' | 'pending' | 'loading';

export function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [reference, setReference] = useState('');

  useEffect(() => {
    // Lotus Bank / Paystack return these params on redirect
    const ref = searchParams.get('reference') || searchParams.get('trxref') || searchParams.get('ref') || '';
    const statusParam = searchParams.get('status') || '';

    setReference(ref);

    // Determine status from URL
    if (statusParam === 'success' || statusParam === 'successful' || location.pathname === '/payment/success') {
      setStatus('success');
    } else if (statusParam === 'failed' || statusParam === 'failure' || statusParam === 'cancelled') {
      setStatus('failed');
    } else if (statusParam === 'pending') {
      setStatus('pending');
    } else if (ref) {
      // Has a reference but no explicit status — treat as success (Lotus redirects on success)
      setStatus('success');
    } else {
      setStatus('pending');
    }
  }, [searchParams, location.pathname]);

  const config = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: 'Payment Successful!',
      subtitle: 'Your booking has been confirmed. We will send you a confirmation email shortly.',
      badge: 'bg-green-100 text-green-800',
      badgeText: 'Payment Confirmed',
    },
    failed: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'Payment Failed',
      subtitle: 'Your payment could not be processed. Please try again or contact us for assistance.',
      badge: 'bg-red-100 text-red-800',
      badgeText: 'Payment Failed',
    },
    pending: {
      icon: Clock,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: 'Payment Pending',
      subtitle: 'Your payment is being processed. We will notify you once it is confirmed.',
      badge: 'bg-yellow-100 text-yellow-800',
      badgeText: 'Processing',
    },
    loading: {
      icon: Clock,
      iconColor: 'text-gray-400',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      title: 'Verifying Payment...',
      subtitle: 'Please wait while we confirm your payment.',
      badge: 'bg-gray-100 text-gray-800',
      badgeText: 'Verifying',
    },
  };

  const c = config[status];
  const Icon = c.icon;

  return (
    <>
      <SEO
        title={status === 'success' ? 'Payment Successful — Libragold Group' : 'Payment Status — Libragold Group'}
        description="Payment confirmation page for Libragold Group bookings."
      />

      <div className="min-h-screen bg-gradient-to-b from-[#faf8f3] to-white flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className={`rounded-2xl border-2 ${c.borderColor} ${c.bgColor} p-8 text-center shadow-lg`}>
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="flex justify-center mb-5"
            >
              <Icon className={`w-20 h-20 ${c.iconColor}`} />
            </motion.div>

            {/* Badge */}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${c.badge} mb-4`}>
              {c.badgeText}
            </span>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{c.title}</h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{c.subtitle}</p>

            {/* Reference */}
            {reference && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6 text-left">
                <p className="text-xs text-gray-500 mb-1">Payment Reference</p>
                <p className="font-mono text-sm font-semibold text-gray-800 break-all">{reference}</p>
                <p className="text-xs text-gray-400 mt-1">Keep this for your records</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 w-full bg-[#D4AF37] hover:bg-[#C4A030] text-black font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Back Home
              </motion.button>

              {status === 'failed' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 w-full border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Try Again
                </motion.button>
              )}
            </div>
          </div>

          {/* Contact support */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">Need help? Contact our support team</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <a
                href="tel:+2348000000000"
                className="flex items-center gap-1.5 text-[#D4AF37] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Us
              </a>
              <a
                href="mailto:info@libragoldgroup.com"
                className="flex items-center gap-1.5 text-[#D4AF37] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                Email Us
              </a>
            </div>
          </div>

          {/* Libragold branding */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2">
              <div className="w-6 h-6 bg-[#D4AF37] rounded-md flex items-center justify-center font-black text-black text-xs">L</div>
              <span className="text-gray-400 text-xs font-medium">LIBRAGOLD GROUP</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
