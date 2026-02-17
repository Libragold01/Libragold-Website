import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What documents do I need for Umrah?",
    answer: "You need a valid passport (minimum 6 months validity), completed Umrah visa application, passport photos, vaccination certificates, and proof of accommodation."
  },
  {
    question: "How long does visa processing take?",
    answer: "Visa processing typically takes 5-10 working days depending on the destination. We recommend applying at least 2-3 weeks before your travel date."
  },
  {
    question: "What is included in your Umrah packages?",
    answer: "Our packages include visa processing, flights, accommodation in Makkah and Madinah, ground transportation, guided tours, and 24/7 support throughout your journey."
  },
  {
    question: "Can I customize my travel package?",
    answer: "Yes, we offer customizable packages to meet your specific needs and budget. Contact our team to discuss your requirements."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, card payments through our secure Lotus Bank payment system, and installment plans for pilgrimage packages."
  },
  {
    question: "Do you provide travel insurance?",
    answer: "Yes, we offer comprehensive travel insurance options to protect you during your journey. Insurance details are provided with your booking."
  }
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#D4AF37]/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">Our team is here to help you with any additional questions.</p>
            <button className="bg-[#D4AF37] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}