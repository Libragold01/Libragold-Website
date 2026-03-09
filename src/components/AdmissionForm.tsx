import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, User, FileText, Globe, Users, FileCheck, Award, Plane } from 'lucide-react';
import { WEB3FORMS_KEY } from '../config';
import { apiService } from '../services/api';
import { SEO } from './SEO';

interface AdmissionFormProps {
  onFormSubmitted?: () => void;
}

export function AdmissionForm({ onFormSubmitted }: AdmissionFormProps) {
  const [showCharges, setShowCharges] = useState(false);

  async function submitToBackend(formData: FormData) {
    try {
      await apiService.createBooking({
        service: 'Admission',
        customerName: (formData.get('fullName') as string) || '',
        email: (formData.get('email') as string) || '',
        phone: (formData.get('phone') as string) || '',
        referralCode: (formData.get('referralCode') as string) || undefined,
        details: {
          preferredCountry: (formData.get('preferredCountry') as string) || '',
          levelOfStudy: (formData.get('levelOfStudy') as string) || '',
          preferredUniversity: (formData.get('preferredUniversity') as string) || '',
          courseOfStudy: (formData.get('courseOfStudy') as string) || '',
          intendedStartDate: (formData.get('intendedStartDate') as string) || '',
        },
      });
    } catch { /* non-fatal */ }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('access_key', WEB3FORMS_KEY);
    formData.append('subject', 'New Admission Application');

    try {
      await Promise.all([
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData }),
        submitToBackend(formData),
      ]);
    } catch (error) {
      console.error('Form submission error:', error);
    }

    setShowCharges(true);
  };

  const handleProceedToPayment = () => {
    if (onFormSubmitted) {
      onFormSubmitted();
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('admission-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (showCharges) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Award className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-white font-semibold">Premium Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your
              <span className="block bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] bg-clip-text text-transparent">
                Success Package
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Invest in your future with our comprehensive admission support packages
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Standard Package */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Standard Package</h3>
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                    <span className="text-blue-300 text-sm font-medium">Popular</span>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">$500</span>
                    <span className="text-gray-400">USD</span>
                  </div>
                  <p className="text-gray-300 mt-2">Perfect for first-time applicants</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    { text: "University Selection & Guidance", icon: "🎯" },
                    { text: "Document Preparation Support", icon: "📋" },
                    { text: "Application Submission", icon: "🚀" },
                    { text: "Basic Email Support", icon: "📧" },
                    { text: "Application Tracking", icon: "📊" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-200">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-2xl border border-white/30 transition-all duration-300 group-hover:border-[#D4AF37]/50">
                  Choose Standard
                </button>
              </div>
            </motion.div>

            {/* Premium Package */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-gradient-to-br from-[#D4AF37]/20 to-[#F4E4C1]/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Premium Package</h3>
                  <div className="px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] rounded-full">
                    <span className="text-black text-sm font-bold">RECOMMENDED</span>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] bg-clip-text text-transparent">$800</span>
                    <span className="text-gray-400">USD</span>
                  </div>
                  <p className="text-gray-300 mt-2">Complete success guarantee package</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    { text: "Everything in Standard Package", icon: "✨" },
                    { text: "Personal Interview Coaching", icon: "🎤" },
                    { text: "Scholarship Application Support", icon: "💰" },
                    { text: "Complete Visa Processing", icon: "✈️" },
                    { text: "24/7 Priority Support", icon: "🚨" },
                    { text: "Pre-departure Orientation", icon: "🎓" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-200">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] hover:from-[#F4E4C1] hover:to-[#D4AF37] text-black font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  Choose Premium
                </button>
              </div>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">98%</div>
                <p className="text-gray-300">Success Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">10,000+</div>
                <p className="text-gray-300">Students Placed</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">500+</div>
                <p className="text-gray-300">Partner Universities</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#F4E4C1]/20 backdrop-blur-sm rounded-3xl p-8 border border-[#D4AF37]/30">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
              <p className="text-gray-300 mb-6">Join thousands of successful students who chose Libragold</p>
              <motion.button
                onClick={handleProceedToPayment}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-bold rounded-full hover:from-[#F4E4C1] hover:to-[#D4AF37] transition-all duration-300 shadow-2xl hover:shadow-[#D4AF37]/25"
              >
                Proceed to Secure Payment
              </motion.button>
              <p className="text-gray-400 text-sm mt-4">🔒 Secure payment powered by industry-leading encryption</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="School Admission Services — Libragold Group"
        description="Apply for school admission abroad with Libragold Group. University and college placement services for Nigerian students."
        canonical="/admission"
        keywords="school admission abroad Nigeria, study abroad application, university placement Nigeria, Libragold admission"
      />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#F4E4C1] to-[#FFE5B4] py-20">
        <div className="absolute inset-0">
          <img 
            src="/Images/Hero Section/Diverse International Students With Diplomas Celebrating Graduation.jpeg" 
            alt="Education Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/80 via-[#F4E4C1]/80 to-[#FFE5B4]/80"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-300/30 rounded-full blur-lg"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <GraduationCap className="w-6 h-6 text-black" />
                <span className="text-black font-semibold">Study Abroad Excellence</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight"
            >
              Achieve Your
              <span className="block bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                Study Abroad Dreams
              </span>
              <span className="block text-4xl md:text-5xl mt-2">with Libragold</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-black/70 max-w-4xl mx-auto leading-relaxed mb-10"
            >
              Transform your academic journey with our expert guidance. From course selection to visa approval, we make studying abroad seamless and successful.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button 
                onClick={scrollToForm}
                className="px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Your Journey
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-black font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300">
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Why Choose Libragold?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience excellence in every step of your academic journey</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Global Destinations", desc: "Access to 500+ top universities across UK, US, Canada, Australia & more", color: "from-blue-500 to-cyan-500" },
              { icon: Users, title: "Expert Guidance", desc: "Personalized support from certified education consultants with 10+ years experience", color: "from-purple-500 to-pink-500" },
              { icon: FileCheck, title: "Seamless Process", desc: "AI-powered application system with 98% success rate and zero errors", color: "from-green-500 to-emerald-500" },
              { icon: Award, title: "Scholarship Hub", desc: "Access to $50M+ in scholarships and financial aid opportunities", color: "from-yellow-500 to-orange-500" },
              { icon: Plane, title: "Visa Success", desc: "99.2% visa approval rate with dedicated immigration support team", color: "from-red-500 to-pink-500" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How Libragold Makes Admission Easy</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Course and University Selection</h3>
                <p className="text-gray-600">Based on your career goals, interests, and budget, we help you choose the best program and institution.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Document Preparation</h3>
                <p className="text-gray-600">Our experts assist with gathering and organizing all required documents, such as transcripts, recommendation letters, and personal statements.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Application Submission</h3>
                <p className="text-gray-600">We ensure your application is error-free and submitted on time to meet university deadlines.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Interview Preparation</h3>
                <p className="text-gray-600">For programs that require interviews, we provide tips and mock sessions to boost your confidence.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Acceptance and Visa Support</h3>
                <p className="text-gray-600">Once you receive your offer letter, we help you fulfill the requirements for visa processing and prepare for your journey.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-[#D4AF37]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Your Path to Global Education Starts Here</h2>
          <p className="text-xl text-black/80 mb-8">
            At Libragold, we're dedicated to making your study abroad dreams a reality. With our proven track record and commitment to excellence, we've helped countless students embark on life-changing academic journeys.
          </p>
        </div>
      </div>

      {/* Application Form */}
      <div id="admission-form" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border"
          >
            {/* Header */}
            <div className="bg-[#D4AF37] px-8 py-6">
              <h1 className="text-3xl font-bold text-black flex items-center gap-3">
                <GraduationCap className="w-8 h-8" />
                Admission Application
              </h1>
            </div>

            <div className="p-8">
              {/* Section 1: Personal Information */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter your full address"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Information */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#D4AF37]" />
                  Academic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Country *
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent">
                      <option value="">Select Country</option>
                      <option value="canada">Canada</option>
                      <option value="uk">United Kingdom</option>
                      <option value="usa">United States</option>
                      <option value="australia">Australia</option>
                      <option value="germany">Germany</option>
                      <option value="france">France</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      1st Preferred University *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter 1st preferred university"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      1st Course of Study *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter 1st course/program name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      2nd Preferred University
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter 2nd preferred university"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      2nd Course of Study
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter 2nd course/program name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      3rd Preferred University
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter 3rd preferred university"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      3rd Course of Study
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Enter 3rd course/program name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level of Study *
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent">
                      <option value="">Select Level</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="postgraduate">Postgraduate</option>
                      <option value="phd">PhD</option>
                      <option value="diploma">Diploma</option>
                      <option value="certificate">Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intended Start Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      English Test Score
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="IELTS/TOEFL score (if available)"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Education *
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="Describe your previous education background"
                    />
                  </div>
                </div>
              </div>

              {/* Referral Code */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Code <span className="text-gray-400 font-normal">(Optional — enter your LWA ambassador code)</span>
                </label>
                <input
                  type="text"
                  name="referralCode"
                  placeholder="e.g. LWA01"
                  pattern="LWA[0-9]{2,4}"
                  title="Enter a valid LWA code (e.g. LWA01)"
                  className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent uppercase"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F4E4C1] transition-colors shadow-lg"
                >
                  Submit Application
                </motion.button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
    </>
  );
}