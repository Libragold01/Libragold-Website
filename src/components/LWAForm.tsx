import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, CheckCircle, Copy, ArrowLeft, Loader, Users, DollarSign, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WEB3FORMS_KEY, LWA_COUNTER_KEY } from '../config';

// ─── Referral code generator ─────────────────────────────────────────────────
// Uses localStorage to maintain a per-device sequential counter.
// Each submission is also recorded via Web3Forms so the admin can track all codes.
// The counter key lives in src/config/index.ts — changing the key there resets counters.

function getNextLWACode(): string {
  const stored = localStorage.getItem(LWA_COUNTER_KEY);
  const next = stored ? parseInt(stored, 10) : 1;
  localStorage.setItem(LWA_COUNTER_KEY, String(next + 1));
  return 'LWA' + String(next).padStart(2, '0');
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LWAForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    occupation: '',
    socialMedia: '',
    howYouHeard: '',
    agreeTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lwaCode, setLwaCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions to continue.');
      return;
    }
    setIsSubmitting(true);

    const code = getNextLWACode();

    const web3FormData = new FormData();
    web3FormData.append('access_key', WEB3FORMS_KEY);
    web3FormData.append('subject', `New LWA Registration: ${code} — ${formData.fullName}`);
    web3FormData.append('referralCode', code);
    web3FormData.append('fullName', formData.fullName);
    web3FormData.append('email', formData.email);
    web3FormData.append('phone', formData.phone);
    web3FormData.append('city', formData.city);
    web3FormData.append('occupation', formData.occupation);
    web3FormData.append('socialMedia', formData.socialMedia);
    web3FormData.append('howYouHeard', formData.howYouHeard);
    web3FormData.append('registrationDate', new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }));

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormData,
      });
    } catch {
      // Non-critical — still show the code to the user
    } finally {
      setIsSubmitting(false);
      setLwaCode(code);
    }
  };

  const copyCode = () => {
    if (lwaCode) {
      navigator.clipboard.writeText(lwaCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ─── Success Screen ─────────────────────────────────────────────────────────

  if (lwaCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Ambassador!</h2>
          <p className="text-gray-600 mb-8">
            You're officially a <strong>Libragold Work Ambassador</strong>. Your unique referral code is:
          </p>

          {/* LWA Code Display */}
          <div className="bg-gradient-to-r from-[#D4AF37] to-amber-500 rounded-2xl p-6 mb-6">
            <div className="text-4xl font-black text-black tracking-widest mb-3">{lwaCode}</div>
            <button
              onClick={copyCode}
              className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/30 text-black font-semibold px-4 py-2 rounded-full text-sm transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-2">What to do next:</p>
            <p>✅ Share your code with friends, family & colleagues</p>
            <p>✅ Ask them to mention <strong>{lwaCode}</strong> when booking any Libragold service</p>
            <p>✅ Earn your commission after each successful booking</p>
            <p>✅ Our team will contact you within 24 hours with full ambassador details</p>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            A confirmation has been sent to your email. Save your code safely!
          </p>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-full hover:bg-amber-500 transition-colors"
          >
            Go Back Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Registration Form ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
      {/* Back button */}
      <div className="bg-black/40 border-b border-white/10 sticky top-20 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: Benefits sidebar */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32"
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-6">
                <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-sm font-semibold">LWA Program</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                Libragold Work{' '}
                <span className="text-[#D4AF37]">Ambassador</span>
              </h1>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Register today, get your unique LWA referral code, and start earning by sharing Libragold's world-class travel services with your network.
              </p>

              <div className="space-y-4">
                {[
                  { icon: DollarSign, title: 'Earn Commission', desc: 'Get credited for every successful booking made with your code' },
                  { icon: Users, title: 'Grow Your Network', desc: 'The more you refer, the more you earn — no cap' },
                  { icon: Layers, title: 'All Services', desc: 'Earn from Tours, Hotels, Pilgrimage, Visa, Ticketing bookings' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{item.title}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Register as Ambassador</h2>
              <p className="text-gray-500 text-sm mb-6">Fill in your details below to receive your unique LWA referral code instantly.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                    <input
                      type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                      placeholder="08012345678"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* City & Occupation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City / State *</label>
                    <input
                      type="text" name="city" value={formData.city} onChange={handleChange} required
                      placeholder="e.g. Lagos, Nigeria"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation *</label>
                    <input
                      type="text" name="occupation" value={formData.occupation} onChange={handleChange} required
                      placeholder="e.g. Business Owner, Teacher"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Social Media Handle (Optional)</label>
                  <input
                    type="text" name="socialMedia" value={formData.socialMedia} onChange={handleChange}
                    placeholder="@yourhandle on Instagram / WhatsApp number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                  />
                </div>

                {/* How did you hear */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">How did you hear about us? *</label>
                  <select
                    name="howYouHeard" value={formData.howYouHeard} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="">Select an option</option>
                    <option value="Social Media">Social Media (Instagram, Facebook, TikTok)</option>
                    <option value="Friend or Family">Friend or Family Referral</option>
                    <option value="Existing Ambassador">Existing Libragold Ambassador</option>
                    <option value="Website">Libragold Website</option>
                    <option value="Word of Mouth">Word of Mouth</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <input
                    type="checkbox" name="agreeTerms" id="agreeTerms"
                    checked={formData.agreeTerms} onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-[#D4AF37] flex-shrink-0"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                    I agree to act as a Libragold Work Ambassador in good faith, refer genuine customers, and abide by Libragold's ambassador program terms and conditions.
                  </label>
                </div>

                <AnimatePresence>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`w-full py-4 font-bold rounded-full text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black shadow-xl hover:shadow-[#D4AF37]/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Generating your LWA code...
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-5 h-5" />
                        Register & Get My LWA Code
                      </>
                    )}
                  </motion.button>
                </AnimatePresence>

                <p className="text-xs text-center text-gray-400">
                  Your referral code is generated instantly upon submission and sent to your email.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
