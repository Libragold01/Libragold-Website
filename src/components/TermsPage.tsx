import React from 'react';
import { motion } from 'framer-motion';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Booking and Payment</h2>
              <p className="text-gray-600">
                All bookings require a deposit to secure your reservation. Full payment must be completed 
                before travel dates. Cancellation policies vary by package type and destination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Travel Documents</h2>
              <p className="text-gray-600">
                Travelers are responsible for ensuring valid passports and required visas. LibraGold 
                assists with visa processing but cannot guarantee approval by embassy authorities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Health and Safety</h2>
              <p className="text-gray-600">
                Travelers must meet health requirements for destinations including vaccinations. 
                Travel insurance is recommended for all international trips.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Liability</h2>
              <p className="text-gray-600">
                LibraGold acts as an agent for travel services. We are not liable for delays, 
                cancellations, or changes by airlines, hotels, or other service providers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Changes and Cancellations</h2>
              <p className="text-gray-600">
                Package changes may incur additional fees. Cancellation terms depend on timing 
                and package type. Refunds are subject to supplier policies.
              </p>
            </section>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Last updated: January 2025. For questions about these terms, contact us at info@libragoldtravels.com
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}