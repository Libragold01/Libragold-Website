import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';

// Lazy load all page components for code splitting
const HomePage = lazy(() => import('../components/HomePage').then(m => ({ default: m.HomePage })));
const PilgrimagesPage = lazy(() => import('../components/PilgrimagesPage').then(m => ({ default: m.PilgrimagesPage })));
const MouludUmrahPage = lazy(() => import('../components/MouludUmrahPage').then(m => ({ default: m.MouludUmrahPage })));
const DecemberUmrahPage = lazy(() => import('../components/DecemberUmrahPage').then(m => ({ default: m.DecemberUmrahPage })));
const RamadanUmrahPage = lazy(() => import('../components/RamadanUmrahPage').then(m => ({ default: m.RamadanUmrahPage })));
const MonthlyUmrahPage = lazy(() => import('../components/MonthlyUmrahPage').then(m => ({ default: m.MonthlyUmrahPage })));
const HajjPage = lazy(() => import('../components/HajjPage').then(m => ({ default: m.HajjPage })));
const HajjPackagePage = lazy(() => import('../components/HajjPackagePage').then(m => ({ default: m.HajjPackagePage })));
const VisaPage = lazy(() => import('../components/VisaPage').then(m => ({ default: m.VisaPage })));
const SaudiVisaPage = lazy(() => import('../components/SaudiVisaPage').then(m => ({ default: m.SaudiVisaPage })));
const UAEVisaPage = lazy(() => import('../components/UAEVisaPage').then(m => ({ default: m.UAEVisaPage })));
const SchengenVisaPage = lazy(() => import('../components/SchengenVisaPage').then(m => ({ default: m.SchengenVisaPage })));
const QatarVisaPage = lazy(() => import('../components/QatarVisaPage').then(m => ({ default: m.QatarVisaPage })));
const HotelPage = lazy(() => import('../components/HotelPage').then(m => ({ default: m.HotelPage })));
const HotelDetailPage = lazy(() => import('../components/HotelDetailPage').then(m => ({ default: m.HotelDetailPage })));
const TourPackagesPage = lazy(() => import('../components/TourPackagesPage').then(m => ({ default: m.TourPackagesPage })));
const TourDetailPage = lazy(() => import('../components/TourDetailPage').then(m => ({ default: m.TourDetailPage })));
const TicketingForm = lazy(() => import('../components/TicketingForm').then(m => ({ default: m.TicketingForm })));
const AdmissionForm = lazy(() => import('../components/AdmissionForm').then(m => ({ default: m.AdmissionForm })));
const GalleryPage = lazy(() => import('../components/GalleryPage').then(m => ({ default: m.GalleryPage })));
const AboutPage = lazy(() => import('../components/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('../components/ServicesPage').then(m => ({ default: m.ServicesPage })));
const DestinationsPage = lazy(() => import('../components/DestinationsPage').then(m => ({ default: m.DestinationsPage })));
const ContactPage = lazy(() => import('../components/ContactPage').then(m => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('../components/FAQPage').then(m => ({ default: m.FAQPage })));
const PrivacyPage = lazy(() => import('../components/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('../components/TermsPage').then(m => ({ default: m.TermsPage })));
const CookiePage = lazy(() => import('../components/CookiePage').then(m => ({ default: m.CookiePage })));
const LWAForm = lazy(() => import('../components/LWAForm').then(m => ({ default: m.LWAForm })));
const NotFoundPage = lazy(() => import('../components/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Home
      { index: true, element: <HomePage /> },

      // Pilgrimages
      {
        path: 'pilgrimages',
        children: [
          { index: true, element: <PilgrimagesPage /> },
          { path: 'moulud-umrah', element: <MouludUmrahPage /> },
          { path: 'december-umrah', element: <DecemberUmrahPage /> },
          { path: 'ramadan-umrah', element: <RamadanUmrahPage /> },
          { path: 'monthly-umrah', element: <MonthlyUmrahPage /> },
          { path: 'hajj', element: <HajjPage /> },
          { path: 'hajj-packages/:tier', element: <HajjPackagePage /> },
        ],
      },

      // Visas
      {
        path: 'visas',
        children: [
          { index: true, element: <VisaPage /> },
          { path: 'saudi', element: <SaudiVisaPage /> },
          { path: 'uae', element: <UAEVisaPage /> },
          { path: 'schengen', element: <SchengenVisaPage /> },
          { path: 'qatar', element: <QatarVisaPage /> },
        ],
      },

      // Hotels
      {
        path: 'hotels',
        children: [
          { index: true, element: <HotelPage /> },
          { path: ':hotelId', element: <HotelDetailPage /> },
        ],
      },

      // Tours
      {
        path: 'tours',
        children: [
          { index: true, element: <TourPackagesPage /> },
          { path: ':tourId', element: <TourDetailPage /> },
          { path: ':tourId/:packageType', element: <TourDetailPage /> },
        ],
      },

      // Other Services
      { path: 'lwa', element: <LWAForm /> },
      { path: 'ticketing', element: <TicketingForm /> },
      { path: 'admission', element: <AdmissionForm /> },
      { path: 'gallery', element: <GalleryPage /> },

      // Informational Pages
      { path: 'about', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'destinations', element: <DestinationsPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'cookies', element: <CookiePage /> },

      // 404 catch-all
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
