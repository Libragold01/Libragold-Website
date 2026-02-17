import React, { Suspense } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { routes } from './routes';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export function App() {
  const location = useLocation();
  const element = useRoutes(routes);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimatePresence mode="wait">
        {React.cloneElement(element as React.ReactElement, { key: location.pathname })}
      </AnimatePresence>
    </Suspense>
  );
}
