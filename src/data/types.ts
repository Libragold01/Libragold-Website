/**
 * Shared types for pilgrimage packages across the Libragold website.
 *
 * These interfaces are used by:
 * - PilgrimagesPage (summary cards)
 * - RamadanUmrahPage, DecemberUmrahPage, etc. (detail pages)
 * - PilgrimageBookingForm (booking flow)
 */

/** Pricing by room occupancy type. All fields optional since not every package offers every tier. */
export interface OccupancyPricing {
  quad?: string;
  triple?: string;
  double?: string;
  single?: string;
}

/** A full Umrah package with all details — used on detail pages like RamadanUmrahPage. */
export interface UmrahPackage {
  name: string;
  duration: string;
  dates: string;
  image: string;
  description: string;
  features: string[];
  pricing: OccupancyPricing;
  flightIncluded: boolean;
}

/** Summary card shown on the main PilgrimagesPage — no pricing, just an overview. */
export interface UmrahCardSummary {
  name: string;
  slug: string;
  duration: string;
  image: string;
  description: string;
  features: string[];
}

/** Hajj card shown on the main PilgrimagesPage — includes pricing. */
export interface HajjCardSummary {
  name: string;
  slug: string;
  duration: string;
  image: string;
  description: string;
  features: string[];
  pricing: OccupancyPricing;
}

/** The shape passed to PilgrimageBookingForm when a user selects a package + occupancy. */
export interface SelectedBookingPackage {
  service: string;
  package: string;
  priceType: string;
  price: {
    naira: string;
    usd: string;
  };
}
