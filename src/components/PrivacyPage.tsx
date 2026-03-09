
import { motion } from 'framer-motion';
import { SEO } from './SEO';

export function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy — Libragold Group"
        description="Privacy policy for Libragold Group. Learn how we collect, use and protect your personal information."
        canonical="/privacy"
        keywords="Libragold privacy policy, data protection, personal information"
      />
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-600">
                We collect personal information necessary for travel bookings including names, 
                contact details, passport information, and payment data to process your reservations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600">
                Your information is used to process bookings, communicate travel updates, 
                provide customer support, and improve our services. We do not sell personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600">
                We implement industry-standard security measures to protect your personal information. 
                Payment processing is handled through secure, encrypted systems.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Sharing</h2>
              <p className="text-gray-600">
                We share information only with trusted partners necessary for travel services 
                including airlines, hotels, and visa processing authorities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600">
                You have the right to access, update, or delete your personal information. 
                Contact us to exercise these rights or for privacy-related questions.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}