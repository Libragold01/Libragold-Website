import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
export function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        e.currentTarget.reset();
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }}>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 sm:mb-8">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Stay Updated</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Get exclusive travel deals, destination guides, and insider tips
            delivered to your inbox
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <input type="hidden" name="access_key" value="dc98498a-5066-478d-99f3-8524d9412556" />
            <input type="hidden" name="subject" value="Newsletter Subscription" />
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="email" name="email" placeholder="Enter your email" required className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base" />
              <motion.button type="submit" disabled={isSubmitting} whileHover={{
              scale: isSubmitting ? 1 : 1.05
            }} whileTap={{
              scale: isSubmitting ? 1 : 0.95
            }} className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#D4AF37] font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                {isSubmitting ? 'Subscribing...' : submitStatus === 'success' ? 'Subscribed!' : 'Subscribe'}
              </motion.button>
            </div>
          </form>

          {submitStatus === 'success' && <motion.p initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mt-4 sm:mt-6 text-sm sm:text-base text-white/90">
              Thank you for subscribing! Check your inbox for updates.
            </motion.p>}
          {submitStatus === 'error' && <motion.p initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mt-4 sm:mt-6 text-sm sm:text-base text-red-300">
              Failed to subscribe. Please try again.
            </motion.p>}
        </motion.div>
      </div>
    </section>;
}