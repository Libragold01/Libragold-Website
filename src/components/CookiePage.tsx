import React from 'react';
import { motion } from 'framer-motion';

export function CookiePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies</h2>
              <p className="text-gray-600">
                Cookies are small text files stored on your device when you visit our website. 
                They help us provide a better user experience and analyze website performance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Essential Cookies</h3>
                  <p className="text-gray-600">Required for basic website functionality and security.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Analytics Cookies</h3>
                  <p className="text-gray-600">Help us understand how visitors use our website.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Preference Cookies</h3>
                  <p className="text-gray-600">Remember your settings and preferences.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-600">
                You can control cookies through your browser settings. Disabling certain cookies 
                may affect website functionality and your user experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600">
                We may use third-party services that set cookies for analytics and payment processing. 
                These are governed by their respective privacy policies.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}