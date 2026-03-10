import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PageLayout } from './PageLayout';
import { WhatsAppButton } from '../components/WhatsAppButton';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatePresence mode="wait">
          <PageLayout key={location.pathname}>
            <Outlet />
          </PageLayout>
        </AnimatePresence>
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
