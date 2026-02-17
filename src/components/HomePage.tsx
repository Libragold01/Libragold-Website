import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from './Hero';
import { OurServices } from './OurServices';
import { SEO } from './SEO';

const WhyChoose = lazy(() => import('./WhyChoose').then(m => ({ default: m.WhyChoose })));
const GoWithLibraGold = lazy(() => import('./GoWithLibraGold').then(m => ({ default: m.GoWithLibraGold })));
const PartnersClients = lazy(() => import('./PartnersClients').then(m => ({ default: m.PartnersClients })));
const UpcomingTours = lazy(() => import('./UpcomingTours').then(m => ({ default: m.UpcomingTours })));
const TravelTips = lazy(() => import('./TravelTips').then(m => ({ default: m.TravelTips })));
const Testimonials = lazy(() => import('./Testimonials').then(m => ({ default: m.Testimonials })));
const Newsletter = lazy(() => import('./Newsletter').then(m => ({ default: m.Newsletter })));

export function HomePage() {
  const navigate = useNavigate();

  const handleServiceClick = (service: string) => {
    switch (service) {
      case 'Hajj & Umrah':
        navigate('/pilgrimages');
        break;
      case 'Visa Processing':
        navigate('/visas');
        break;
      case 'Hotel Booking':
      case 'Ramadan Umrah':
        navigate('/hotels');
        break;
      case 'Tour Packages':
        navigate('/tours');
        break;
      case 'Study Abroad':
        navigate('/admission');
        break;
      default:
        break;
    }
  };

  const handleTourClick = (tour: any) => {
    // Navigate to tour detail with the tour ID
    const tourId = tour.id || tour.name?.toLowerCase().replace(/\s+/g, '-');
    navigate(`/tours/${tourId}`);
  };

  return (
    <>
      <SEO
        title="Home"
        description="Libragold Group - Your trusted partner for unforgettable journeys. Hajj & Umrah packages, visa processing, hotel booking, tour packages, and study abroad services since 1996."
        canonical="/"
        keywords="travel agency Nigeria, Hajj packages, Umrah packages, visa processing, hotel booking, tour packages, study abroad"
      />
      <Hero
        onExploreDestinations={() => navigate('/tours')}
        onBookNow={() => navigate('/pilgrimages')}
      />
      <OurServices onServiceClick={handleServiceClick} />
      <Suspense fallback={<div className="h-96"></div>}>
        <WhyChoose />
        <PartnersClients />
        <GoWithLibraGold />
        <UpcomingTours onTourClick={handleTourClick} />
        <TravelTips />
        <Testimonials />
        <Newsletter />
      </Suspense>
    </>
  );
}
