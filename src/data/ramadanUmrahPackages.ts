import { UmrahPackage } from './types';

/**
 * Ramadan Umrah 2026 packages — Last 15/10 days
 * (2/3 days in Medina; last 10 days in Makkah)
 *
 * Updated: February 2026
 */

const HERO_IMAGE = '/Images/Hero Section/makkah-pilgrimage.jpeg';

// ─── BASIC & STANDARD (flight ticket included) ─────────────────────────

const basicPackage: UmrahPackage = {
  name: 'Basic Umrah Package',
  duration: '15-19 Days',
  dates: '5/6 - 21/24 March, 2026',
  image: HERO_IMAGE,
  description: 'Essential Ramadan Umrah experience — 2/3 days in Medina, last 10 days in Makkah',
  features: [
    'Umrah Visa',
    'Economy hotel in Medina in front of Haram',
    'Emmar Al Khair Golden hotel by Misfala bridge (15/18 mins walk to Haram)',
    'Nigeria meal for Iftar only',
    'Shared bus transportation JED MAK MED',
    'Visitation to Historical sites in Makkah and Medina',
    'Spiritual guidance',
    'Excellent welfarism',
    'Economy class flight ticket',
  ],
  pricing: {
    quad: '₦5.7M',
    triple: '₦6.1M',
    double: '₦6.8M',
    single: '₦9M',
  },
  flightIncluded: true,
};

const standardPackage: UmrahPackage = {
  name: 'Standard Umrah Package',
  duration: '15-19 Days',
  dates: '5/6 - 21/24 March, 2026',
  image: HERO_IMAGE,
  description: 'Comfortable Ramadan Umrah with 3-star accommodations — 2/3 days in Medina, last 10 days in Makkah',
  features: [
    'Umrah Visa',
    '3 star hotel in Medina',
    '3 Star Badr Al Massa Hotel, Makkah (7/8 mins walk to Haram)',
    'Shared bus Transportation',
    'African meals for Iftar and Sahor',
    'Visitation to Historical sites in Makkah and Medina',
    'Spiritual guidance',
    'Excellent welfarism',
    'Economy class flight ticket',
  ],
  pricing: {
    quad: '₦6.7M',
    triple: '₦7.1M',
    double: '₦8.1M',
    single: '₦11.3M',
  },
  flightIncluded: true,
};

// ─── EXECUTIVE PACKAGES (flight ticket NOT included) ────────────────────

const executiveBPackage: UmrahPackage = {
  name: "Executive Umrah Package 'B'",
  duration: '13-14 Days',
  dates: '6/7 - 19/20 March, 2026',
  image: HERO_IMAGE,
  description: 'Premium Ramadan Umrah with Movenpick Makkah Clock hotel — flight ticket not included',
  features: [
    'Umrah Visa',
    '4 star Leader Muna Kareem Hotel in Medina',
    'Movenpick Makkah Clock hotel',
    'Buffet Iftar & Sahor',
    'Airport transfers',
    'Economy class train service MED MAK',
    'Visitation to Historical sites in Makkah and Medina',
    'Spiritual guidance',
    'Excellent welfarism',
  ],
  pricing: {
    quad: '₦9.5M',
    triple: '₦10.5M',
    double: '₦12.5M',
  },
  flightIncluded: false,
};

const executiveBPeninsulaPackage: UmrahPackage = {
  name: "Executive 'B' — Peninsula Upgrade",
  duration: '13-14 Days',
  dates: '6/7 - 19/20 March, 2026',
  image: HERO_IMAGE,
  description: 'Movenpick Makkah Clock hotel with 5-star Peninsula worth hotel in Medina — flight ticket not included',
  features: [
    'Umrah Visa',
    '5 star Peninsula worth hotel in Medina',
    'Movenpick Makkah Clock hotel',
    'Buffet Iftar & Sahor',
    'Airport transfers',
    'Economy class train service MED MAK',
    'Visitation to Historical sites in Makkah and Medina',
    'Spiritual guidance',
    'Excellent welfarism',
  ],
  pricing: {
    quad: '₦10M',
    triple: '₦10.5M',
    double: '₦13M',
  },
  flightIncluded: false,
};

const executiveAPackage: UmrahPackage = {
  name: "Executive Umrah Package 'A'",
  duration: '13-14 Days',
  dates: '6/7 - 19/20 March, 2026',
  image: HERO_IMAGE,
  description: 'Luxury Ramadan Umrah with Swissmaqam Makkah Clock hotel — flight ticket not included',
  features: [
    'Umrah Visa',
    '4 star Leader Muna Kareem Hotel in Medina',
    'Swissmaqam Makkah Clock hotel',
    'Buffet Iftar & Sahor',
    'Airport transfers',
    'Economy class train service MED MAK',
    'Visitation to Historical sites in Makkah and Medina',
    'Spiritual guidance',
    'Excellent welfarism',
  ],
  pricing: {
    quad: '₦10M',
    triple: '₦11.25M',
    double: '₦13.5M',
  },
  flightIncluded: false,
};

const executiveAPeninsulaPackage: UmrahPackage = {
  name: "Executive 'A' — Peninsula Upgrade",
  duration: '13-14 Days',
  dates: '6/7 - 19/20 March, 2026',
  image: HERO_IMAGE,
  description: 'Swissmaqam Makkah Clock hotel with 5-star Peninsula worth hotel in Medina — flight ticket not included',
  features: [
    'Umrah Visa',
    '5 star Peninsula worth hotel in Medina',
    'Swissmaqam Makkah Clock hotel',
    'Buffet Iftar & Sahor',
    'Airport transfers',
    'Economy class train service MED MAK',
    'Visitation to Historical sites in Makkah and Medina',
    'Spiritual guidance',
    'Excellent welfarism',
  ],
  pricing: {
    quad: '₦10.5M',
    triple: '₦11.5M',
    double: '₦14M',
  },
  flightIncluded: false,
};

// ─── VIP PACKAGE (flight ticket NOT included) ───────────────────────────

const vipPackage: UmrahPackage = {
  name: 'VIP Umrah Package',
  duration: '13-14 Days',
  dates: '6/7 - 19/20 March, 2026',
  image: HERO_IMAGE,
  description: 'Ultimate luxury Ramadan Umrah with Fairmont Makkah Clock hotel — flight ticket not included',
  features: [
    'Umrah Visa',
    '5 star Peninsula worth Hotel in Medina',
    'Fairmont Makkah Clock hotel',
    'Buffet Iftar & Sahor',
    'Airport transfers',
    'Economy class train service MED MAK',
    'Visitation to Historical sites in Makkah and Medina',
    'Spiritual guidance',
    'Excellent welfarism',
  ],
  pricing: {
    quad: '₦15M',
    triple: '₦17M',
    double: '₦21.5M',
  },
  flightIncluded: false,
};

// ─── EXPORTED ARRAY (ordered from Basic → VIP) ─────────────────────────

export const ramadanUmrahPackages: UmrahPackage[] = [
  basicPackage,
  standardPackage,
  executiveBPackage,
  executiveBPeninsulaPackage,
  executiveAPackage,
  executiveAPeninsulaPackage,
  vipPackage,
];
