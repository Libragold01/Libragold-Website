import { UmrahCardSummary, HajjCardSummary } from './types';

/**
 * Summary card data for the main Pilgrimages page (/pilgrimages).
 * These are overview cards — full package details live in each page's own data file.
 */

const HERO_IMAGE = '/Images/Hero Section/makkah-pilgrimage.jpeg';

// ─── UMRAH CARDS ────────────────────────────────────────────────────────

export const umrahCards: UmrahCardSummary[] = [
  {
    name: 'Moulud Umrah',
    slug: 'moulud-umrah',
    duration: '10 Days',
    image: HERO_IMAGE,
    description: 'Special Umrah package during the blessed month of Moulud',
    features: ['Luxury accommodation', 'Guided tours', 'Transportation', 'Visa processing'],
  },
  {
    name: 'December Umrah',
    slug: 'december-umrah',
    duration: '7 Days',
    image: HERO_IMAGE,
    description: 'End-of-year spiritual journey with comfortable arrangements',
    features: ['Luxury accommodation', 'Group guidance', 'Airport transfers', 'Meals included'],
  },
  {
    name: 'Ramadan Umrah',
    slug: 'ramadan-umrah',
    duration: 'Last 15/10 Days',
    image: HERO_IMAGE,
    description: 'Experience the blessed last 15/10 days of Ramadan 2026 in Makkah — packages from Basic to VIP',
    features: ['Premium hotels near Haram', 'Iftar & Suhur included', 'Spiritual guidance', 'Multiple package tiers'],
  },
  {
    name: 'Monthly Umrah',
    slug: 'monthly-umrah',
    duration: '5 Days',
    image: HERO_IMAGE,
    description: 'Regular monthly Umrah packages available year-round',
    features: ['Flexible dates', 'Luxury accommodation', 'Group guidance', 'All-inclusive package'],
  },
];

// ─── HAJJ CARDS ─────────────────────────────────────────────────────────

export const hajjCards: HajjCardSummary[] = [
  {
    name: 'Budget Hajj',
    slug: 'budget',
    duration: 'May 12/15 - June 2/4, 2026',
    image: HERO_IMAGE,
    description: 'Affordable Hajj package with essential services',
    features: ['Economy hotels', 'One meal daily', 'Shared transportation', 'Economy flight included'],
    pricing: { quad: '₦8.5M', triple: '₦9M', double: '₦10M' },
  },
  {
    name: 'Comfort Hajj',
    slug: 'comfort',
    duration: 'May 12/15 - June 2/4, 2026',
    image: HERO_IMAGE,
    description: 'Comfortable pilgrimage with budget hotels near Haram',
    features: ['Budget hotels (8-10 mins to Haram)', 'Two meals daily', 'AC transportation', 'Economy flight'],
    pricing: { quad: '₦10M', triple: '₦11M', double: '₦12.5M' },
  },
  {
    name: 'Executive Standard Hajj',
    slug: 'executive',
    duration: 'May 15/17 - 30/31, 2026',
    image: HERO_IMAGE,
    description: '5-star Swissotel Makkah Clock Tower with premium services',
    features: ['5★ Swissotel Makkah Clock Tower', '4★ Medina hotel', 'Train service MED-MAK', 'Economy flight'],
    pricing: { quad: '₦15.5M', triple: '₦16M', double: '₦17.5M', single: '₦25M' },
  },
  {
    name: 'VIP Hajj',
    slug: 'vip',
    duration: 'May 17/18 - 30/31, 2026',
    image: HERO_IMAGE,
    description: 'Premium VIP experience with VIP A+ Kidana towers and luxury services',
    features: ['5★ Swissotel Makkah Clock Tower', 'VIP A+ Kidana towers', 'Executive transportation', 'Economy flight'],
    pricing: { quad: '₦26M', triple: '₦26.5M', double: '₦30M', single: '₦36M' },
  },
  {
    name: 'VVIP Hajj',
    slug: 'vvip',
    duration: 'May 17/18 - 30/31, 2026',
    image: HERO_IMAGE,
    description: 'Ultimate luxury with Fairmont Makkah Clock Hotel (flight not included)',
    features: ['Fairmont Makkah Clock Hotel', 'VIP Tent A', 'Biz class train', 'Airport meet & greet'],
    pricing: { quad: '₦27M', triple: '₦29M', double: '₦33M' },
  },
];
