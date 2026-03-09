import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('libragold2026', 12);
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });
    console.log('Default admin created: username=admin, password=libragold2026');
  } else {
    console.log('Admin already exists, skipping...');
  }

  // Seed default site content
  const contentItems = [
    {
      key: 'hero_title',
      value: 'Your Trusted Travel Partner',
      section: 'hero',
    },
    {
      key: 'hero_subtitle',
      value: 'Libragold Group — Pilgrimage, Tours, Hotels, Visa & More',
      section: 'hero',
    },
    {
      key: 'hero_cta',
      value: 'Explore Our Services',
      section: 'hero',
    },
    {
      key: 'about_title',
      value: 'About Libragold Group',
      section: 'about',
    },
    {
      key: 'about_description',
      value:
        'Libragold Group is a premium travel and tourism company based in Nigeria, specializing in Hajj & Umrah packages, international tours, hotel bookings, visa processing, and air ticketing. We are committed to providing exceptional travel experiences at competitive prices.',
      section: 'about',
    },
    {
      key: 'contact_phone',
      value: '+234 800 000 0000',
      section: 'contact',
    },
    {
      key: 'contact_email',
      value: 'info@libragoldgroup.com',
      section: 'contact',
    },
    {
      key: 'contact_address',
      value: 'Lagos, Nigeria',
      section: 'contact',
    },
    {
      key: 'whatsapp_number',
      value: '+2348000000000',
      section: 'contact',
    },
    {
      key: 'pilgrimage_tagline',
      value: 'Experience the Journey of a Lifetime',
      section: 'pilgrimage',
    },
    {
      key: 'lwa_commission_rate',
      value: '5%',
      section: 'lwa',
    },
    {
      key: 'lwa_tagline',
      value: 'Earn While You Travel — Join the Libragold Work Ambassador Program',
      section: 'lwa',
    },
  ];

  for (const item of contentItems) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }

  console.log('Site content seeded successfully.');

  // ─── PILGRIMAGES ────────────────────────────────────────────────────────────

  const pilgrimages = [
    // Ramadan Umrah 2026
    {
      slug: 'ramadan-umrah-basic-2026',
      title: 'Basic Umrah Package',
      type: 'Umrah', category: 'Economy', season: 'Ramadan', year: 2026,
      duration: '15-19 Days',
      description: 'Last 15/10 days of Ramadan 2026 (5/6 – 21/24 March). Economy class flight included.',
      features: ['Umrah Visa','Economy class flight (included)','Economy hotel in Medina','Emmar Al Khair hotel in Makkah','Nigeria meal for Iftar','Shared bus transportation','Visitation to historical sites','Spiritual guidance','Excellent welfarism'],
      occupancyOptions: [{type:'Quad',priceNGN:5700000},{type:'Triple',priceNGN:6100000},{type:'Double',priceNGN:6800000},{type:'Single',priceNGN:9000000}],
      priceFromNGN: 5700000, priceFromUSD: 0, isFeatured: false, sortOrder: 1,
    },
    {
      slug: 'ramadan-umrah-standard-2026',
      title: 'Standard Umrah Package',
      type: 'Umrah', category: 'Standard', season: 'Ramadan', year: 2026,
      duration: '15-19 Days',
      description: 'Last 15/10 days of Ramadan 2026. Economy flight included. 3-star hotels in Makkah and Medina, African meals for Iftar & Sahor.',
      features: ['Umrah Visa','Economy class flight (included)','3-star hotel in Medina','3-star Badr Al Massa in Makkah','African meals for Iftar & Sahor','Shared bus transportation','Visitation to historical sites','Spiritual guidance','Excellent welfarism'],
      occupancyOptions: [{type:'Quad',priceNGN:6700000},{type:'Triple',priceNGN:7100000},{type:'Double',priceNGN:8100000},{type:'Single',priceNGN:11300000}],
      priceFromNGN: 6700000, priceFromUSD: 0, isFeatured: true, sortOrder: 2,
    },
    {
      slug: 'ramadan-umrah-executive-b-2026',
      title: "Executive Umrah Package 'B'",
      type: 'Umrah', category: 'Premium', season: 'Ramadan', year: 2026,
      duration: '13-14 Days',
      description: 'Last 10 days of Ramadan 2026. 4-star Leader Muna Kareem Hotel in Medina, Movenpick Makkah Clock hotel. Flight NOT included.',
      features: ['Umrah Visa','Flight NOT included','4-star Leader Muna Kareem Hotel in Medina','Movenpick Makkah Clock hotel','Buffet Iftar & Sahor','Airport transfers','Economy train service MED-MAK','Visitation to historical sites','Spiritual guidance','Excellent welfarism'],
      occupancyOptions: [{type:'Quad',priceNGN:9500000},{type:'Triple',priceNGN:10500000},{type:'Double',priceNGN:12500000}],
      priceFromNGN: 9500000, priceFromUSD: 0, isFeatured: false, sortOrder: 3,
    },
    {
      slug: 'ramadan-umrah-executive-b-peninsula-2026',
      title: "Executive 'B' — Peninsula Upgrade",
      type: 'Umrah', category: 'Premium', season: 'Ramadan', year: 2026,
      duration: '13-14 Days',
      description: '5-star Peninsula Worth hotel in Medina + Movenpick Makkah Clock hotel. Flight NOT included.',
      features: ['Umrah Visa','Flight NOT included','5-star Peninsula Worth hotel in Medina','Movenpick Makkah Clock hotel','Buffet Iftar & Sahor','Airport transfers','Economy train service MED-MAK','Visitation to historical sites','Spiritual guidance','Excellent welfarism'],
      occupancyOptions: [{type:'Quad',priceNGN:10000000},{type:'Triple',priceNGN:10500000},{type:'Double',priceNGN:13000000}],
      priceFromNGN: 10000000, priceFromUSD: 0, isFeatured: false, sortOrder: 4,
    },
    {
      slug: 'ramadan-umrah-executive-a-2026',
      title: "Executive Umrah Package 'A'",
      type: 'Umrah', category: 'Premium', season: 'Ramadan', year: 2026,
      duration: '13-14 Days',
      description: 'Last 10 days of Ramadan 2026. 4-star Leader Muna Kareem Hotel in Medina, Swissmaqam Makkah Clock hotel. Flight NOT included.',
      features: ['Umrah Visa','Flight NOT included','4-star Leader Muna Kareem Hotel in Medina','Swissmaqam Makkah Clock hotel','Buffet Iftar & Sahor','Airport transfers','Economy train service MED-MAK','Visitation to historical sites','Spiritual guidance','Excellent welfarism'],
      occupancyOptions: [{type:'Quad',priceNGN:10000000},{type:'Triple',priceNGN:11250000},{type:'Double',priceNGN:13500000}],
      priceFromNGN: 10000000, priceFromUSD: 0, isFeatured: true, sortOrder: 5,
    },
    {
      slug: 'ramadan-umrah-executive-a-peninsula-2026',
      title: "Executive 'A' — Peninsula Upgrade",
      type: 'Umrah', category: 'Premium', season: 'Ramadan', year: 2026,
      duration: '13-14 Days',
      description: '5-star Peninsula Worth hotel in Medina + Swissmaqam Makkah Clock hotel. Flight NOT included.',
      features: ['Umrah Visa','Flight NOT included','5-star Peninsula Worth hotel in Medina','Swissmaqam Makkah Clock hotel','Buffet Iftar & Sahor','Airport transfers','Economy train service MED-MAK','Visitation to historical sites','Spiritual guidance','Excellent welfarism'],
      occupancyOptions: [{type:'Quad',priceNGN:10500000},{type:'Triple',priceNGN:11500000},{type:'Double',priceNGN:14000000}],
      priceFromNGN: 10500000, priceFromUSD: 0, isFeatured: false, sortOrder: 6,
    },
    {
      slug: 'ramadan-umrah-vip-2026',
      title: 'VIP Umrah Package',
      type: 'Umrah', category: 'VIP', season: 'Ramadan', year: 2026,
      duration: '13-14 Days',
      description: 'Ultimate Ramadan Umrah — 5-star Peninsula Worth in Medina, Fairmont Makkah Clock hotel. Flight NOT included.',
      features: ['Umrah Visa','Flight NOT included','5-star Peninsula Worth hotel in Medina','Fairmont Makkah Clock hotel','Buffet Iftar & Sahor','Airport transfers','Economy train service MED-MAK','Visitation to historical sites','Spiritual guidance','Excellent welfarism'],
      occupancyOptions: [{type:'Quad',priceNGN:15000000},{type:'Triple',priceNGN:17000000},{type:'Double',priceNGN:21500000}],
      priceFromNGN: 15000000, priceFromUSD: 0, isFeatured: true, sortOrder: 7,
    },
    // December Umrah 2025/2026
    {
      slug: 'december-umrah-standard-2025',
      title: 'Standard December Umrah',
      type: 'Umrah', category: 'Standard', season: 'December', year: 2025,
      duration: '12 Days (Dec 23 – Jan 4)',
      description: 'Umrah during the festive season via Qatar Airways. 3-star hotel in Makkah, ApartHotel in Medina, daily meals.',
      features: ['Umrah VISA','Qatar Airways flight ticket','3-star Hotel in Makkah','ApartHotel in Medina','Daily meals','Shared bus transportation','Airport transfers','Tour of Makkah & Medina','Spiritual guidance','Excellent welfarism'],
      occupancyOptions: [{type:'Quad',priceNGN:3900000},{type:'Triple',priceNGN:4100000},{type:'Double',priceNGN:4500000},{type:'Single',priceNGN:5200000}],
      priceFromNGN: 3900000, priceFromUSD: 0, isFeatured: false, sortOrder: 10,
    },
    {
      slug: 'december-umrah-vip-swissmaqam-2025',
      title: 'VIP December Umrah — SwissMaqam',
      type: 'Umrah', category: 'Premium', season: 'December', year: 2025,
      duration: '12 Days (Dec 23 – Jan 4)',
      description: 'SwissMaqam Hotel Makkah Clock Tower with breakfast, 4/5-star hotel in Medina, Qatar Airways flight included.',
      features: ['Umrah VISA','Qatar Airways flight ticket','SwissMaqam Hotel Makkah Clock Tower with breakfast','4/5-star hotel in Medina','Train service MED-MAK (or executive transportation)','Airport transfers','Tour of Makkah & Medina','Spiritual guidance','Excellent welfarism'],
      occupancyOptions: [{type:'Quad',priceNGN:6650000},{type:'Triple',priceNGN:6900000},{type:'Double',priceNGN:8000000},{type:'Single',priceNGN:11500000}],
      priceFromNGN: 6650000, priceFromUSD: 0, isFeatured: true, sortOrder: 11,
    },
    {
      slug: 'december-umrah-vip-fairmont-2025',
      title: 'VIP December Umrah — Fairmont',
      type: 'Umrah', category: 'VIP', season: 'December', year: 2025,
      duration: '12 Days (Dec 23 – Jan 4)',
      description: 'Fairmont Hotel Makkah Clock Tower with breakfast, 5-star hotel in Medina, Qatar Airways flight included.',
      features: ['Umrah VISA','Qatar Airways flight ticket','Fairmont Hotel Makkah Clock Tower with breakfast','5-star hotel in Medina','Train service MED-MAK (or executive transportation)','Airport transfers','Tour of Makkah & Medina','Spiritual guidance','Excellent welfarism'],
      occupancyOptions: [{type:'Triple',priceNGN:7500000},{type:'Double',priceNGN:9000000},{type:'Single',priceNGN:12000000}],
      priceFromNGN: 7500000, priceFromUSD: 0, isFeatured: true, sortOrder: 12,
    },
    // Moulud Umrah
    {
      slug: 'moulud-umrah-2025',
      title: 'Moulud Umrah',
      type: 'Umrah', category: 'Standard', season: 'Moulud', year: 2025,
      duration: '10 Days',
      description: "Celebrate the Prophet's birthday (Moulud) with a spiritual Umrah journey. Luxury accommodation and guided tours.",
      features: ['Luxury accommodation','Guided tours','Transportation','Visa processing','Moulud celebration events','Spiritual guidance'],
      occupancyOptions: [],
      priceFromNGN: 3800000, priceFromUSD: 0, isFeatured: false, sortOrder: 20,
    },
    {
      slug: 'moulud-umrah-dubai-2025',
      title: 'Moulud Umrah + 4 Days in Dubai',
      type: 'Umrah', category: 'Premium', season: 'Moulud', year: 2025,
      duration: '14 Days',
      description: 'Spiritual Umrah during Moulud combined with a 4-day Dubai vacation.',
      features: ['Luxury accommodation','Guided tours','Transportation','Visa processing','Moulud celebration events','4 days Dubai vacation','Dubai city tours','Desert adventures','Spiritual guidance'],
      occupancyOptions: [],
      priceFromNGN: 4900000, priceFromUSD: 0, isFeatured: true, sortOrder: 21,
    },
    // Hajj 2027
    {
      slug: 'hajj-budget-2027',
      title: 'Budget Hajj 2027',
      type: 'Hajj', category: 'Budget', season: null, year: 2027,
      duration: '18 Days (May 13–31)',
      description: 'Registration closes Nov 30th, 2026. Economy flight included. Economy hotel in Makkah, one meal daily, shared transport.',
      features: ['Hajj Visa','Economy class flight (included)','Economy hotel in Makkah (18/25 mins to Haram)','Economy hotel in Medina','One meal daily','Shared transportation','Tent D in Mina & Arafat','Collective guidance and lectures','Travel/Health Insurance','Group travel only'],
      occupancyOptions: [{type:'Quad',priceNGN:8500000},{type:'Triple',priceNGN:9000000},{type:'Double',priceNGN:10000000}],
      priceFromNGN: 8500000, priceFromUSD: 0, isFeatured: false, sortOrder: 30,
    },
    {
      slug: 'hajj-comfort-2027',
      title: 'Comfort Hajj 2027',
      type: 'Hajj', category: 'Standard', season: null, year: 2027,
      duration: '18 Days (May 13–31)',
      description: 'Registration closes Nov 30th, 2026. Economy flight, budget hotel 8/10 mins to Haram, 2 meals daily. VIP upgrade available (+₦7.5M).',
      features: ['Hajj Visa','Economy class flight (included)','Budget Hotel in Makkah (8/10 mins to Haram)','Economy Hotel in Medina','Two meals daily','Max 4 in room','AC transportation','Ziara in Makkah & Medina','Economy Tent D with additional services','Daily spiritual lectures','Travel/Health Insurance'],
      occupancyOptions: [{type:'Quad',priceNGN:10000000},{type:'Triple',priceNGN:11000000},{type:'Double',priceNGN:12500000}],
      priceFromNGN: 10000000, priceFromUSD: 0, isFeatured: false, sortOrder: 31,
    },
    {
      slug: 'hajj-executive-2027',
      title: 'Executive Hajj 2027',
      type: 'Hajj', category: 'Premium', season: null, year: 2027,
      duration: '16 Days (May 15–31)',
      description: 'Registration closes Nov 30th, 2026. Economy flight, 5-star SWISSOTEL/SWISSMAQAM Makkah Clock Tower, executive luxury transportation.',
      features: ['Hajj Visa','Economy class flight (included)','4-star hotel in Medina with breakfast','5-star SWISSOTEL/SWISSMAQAM Makkah Clock Tower','Regular Tent D in Mina & Arafat','5-star hotel in Aziziya','Airport transfers with meet & greet','Train service MED-MAK','Executive luxury transportation','Ziara','Daily spiritual lectures','Travel/Health Insurance'],
      occupancyOptions: [{type:'Quad',priceNGN:15500000},{type:'Triple',priceNGN:16000000},{type:'Double',priceNGN:17500000},{type:'Single',priceNGN:25000000}],
      priceFromNGN: 15500000, priceFromUSD: 0, isFeatured: true, sortOrder: 32,
    },
    {
      slug: 'hajj-vip-2027',
      title: 'VIP Hajj 2027',
      type: 'Hajj', category: 'VIP', season: null, year: 2027,
      duration: '13 Days (May 18–31)',
      description: 'Registration closes Nov 30th, 2026. Economy flight, VIP A+ Kidana towers in Mina & Arafat, 5-star SWISSOTEL/SWISSMAQAM Makkah.',
      features: ['Hajj Visa','Economy class flight (included)','4-star hotel in Medina with breakfast','5-star SWISSOTEL/SWISSMAQAM Makkah','VIP A+ Kidana towers in Mina & Arafat','Airport transfers with meet & greet','Train service MED-MAK','Executive luxury transportation','Ziara','Daily spiritual lectures','Travel/Health Insurance'],
      occupancyOptions: [{type:'Quad',priceNGN:26000000},{type:'Triple',priceNGN:26500000},{type:'Double',priceNGN:30000000},{type:'Single',priceNGN:36000000}],
      priceFromNGN: 26000000, priceFromUSD: 0, isFeatured: true, sortOrder: 33,
    },
    {
      slug: 'hajj-vvip-2027',
      title: 'VVIP Hajj 2027',
      type: 'Hajj', category: 'VVIP', season: null, year: 2027,
      duration: '13 Days (May 28 – Jun 10)',
      description: 'Ultimate Hajj — FAIRMONT MAKKAH CLOCK HOTEL, VIP Tent A in Mina & Arafat, business class train. FLIGHT NOT INCLUDED.',
      features: ['Hajj Visa','Flight NOT included','Airport meet & greet','5-star Hotel in Medina','FAIRMONT MAKKAH CLOCK HOTEL','Buffet breakfast & dinner','Executive luxury transportation','Business class train service MED-MAK','Ziara','VIP Tent A in Mina & Arafat','Spiritual lectures','Excellent welfarism','Travel/Health Insurance'],
      occupancyOptions: [{type:'Quad',priceNGN:27000000},{type:'Triple',priceNGN:29000000},{type:'Double',priceNGN:33000000}],
      priceFromNGN: 27000000, priceFromUSD: 0, isFeatured: true, sortOrder: 34,
    },
  ];

  console.log('📿 Seeding pilgrimages...');
  for (const p of pilgrimages) {
    const data = { ...p, isActive: true };
    await prisma.pilgrimage.upsert({ where: { slug: p.slug }, update: data, create: data });
  }
  console.log(`   ✓ ${pilgrimages.length} pilgrimages seeded`);

  // ─── TOURS ──────────────────────────────────────────────────────────────────

  const tours = [
    {
      slug: 'egypt-explorer', title: 'Egypt Explorer',
      destination: 'Cairo, Luxor, Aswan', country: 'Egypt', category: 'Africa', duration: '7 Days',
      description: 'Discover the wonders of ancient Egypt — Pyramids of Giza, Nile River Cruise, Valley of Kings.',
      highlights: ['Pyramids of Giza','Nile River Cruise','Valley of Kings','Karnak Temple','Abu Simbel'],
      includes: ['All meals included','Expert guide','Airport transfers','Accommodation','Visa assistance'],
      priceUSD: 1200, priceNGN: 1800000, maxGroupSize: 20, requiresVisa: true, isFeatured: true, sortOrder: 1,
    },
    {
      slug: 'turkey-adventure', title: 'Turkey Adventure',
      destination: 'Istanbul, Cappadocia, Pamukkale', country: 'Turkey', category: 'Europe', duration: '10 Days',
      description: 'Experience the magic of Turkey — from Istanbul minarets to Cappadocia fairy chimneys.',
      highlights: ['Hot air balloon ride','Hagia Sophia','Blue Mosque','Turkish baths','Cappadocia caves'],
      includes: ['Cultural experiences','Airport transfers','Accommodation','Guided tours','Visa assistance'],
      priceUSD: 1800, priceNGN: 2700000, maxGroupSize: 20, requiresVisa: true, isFeatured: true, sortOrder: 2,
    },
    {
      slug: 'qatar-luxury', title: 'Qatar Luxury',
      destination: 'Doha, Al Wakrah', country: 'Qatar', category: 'Middle East', duration: '5 Days',
      description: "Indulge in the opulence of Qatar — luxury hotels, desert safaris, world-class museums.",
      highlights: ['Luxury hotels','Desert safari','Museum of Islamic Art','Souq Waqif','Pearl-Qatar'],
      includes: ['Shopping experiences','Fine dining','Airport transfers','Accommodation','City tours'],
      priceUSD: 2500, priceNGN: 3750000, maxGroupSize: 15, requiresVisa: false, isFeatured: false, sortOrder: 3,
    },
    {
      slug: 'saudi-heritage', title: 'Saudi Heritage',
      destination: 'Riyadh, Jeddah, Al-Ula', country: 'Saudi Arabia', category: 'Middle East', duration: '8 Days',
      description: 'Explore Saudi Arabia — from modern Riyadh to ancient Nabataean rock tombs of Al-Ula.',
      highlights: ['Historical sites','Al-Ula rock formations','Jeddah old city','Heritage villages','Modern attractions'],
      includes: ['Cultural tours','Traditional cuisine','Airport transfers','Accommodation','Visa assistance'],
      priceUSD: 1600, priceNGN: 2400000, maxGroupSize: 20, requiresVisa: true, isFeatured: false, sortOrder: 4,
    },
    {
      slug: 'south-africa-safari', title: 'South Africa Safari',
      destination: 'Cape Town, Kruger, Johannesburg', country: 'South Africa', category: 'Africa', duration: '12 Days',
      description: 'Big Five safaris, Table Mountain, penguin colonies, and the Cape Winelands.',
      highlights: ['Big Five safari','Table Mountain','Penguin colony','Cape Winelands','Cultural townships'],
      includes: ['Wine tours','Airport transfers','Game drives','Accommodation','Park fees'],
      priceUSD: 3200, priceNGN: 4800000, maxGroupSize: 12, requiresVisa: false, isFeatured: true, sortOrder: 5,
    },
    {
      slug: 'nigeria-discovery', title: 'Nigeria Discovery',
      destination: 'Lagos, Abuja, Calabar', country: 'Nigeria', category: 'Africa', duration: '6 Days',
      description: "Discover vibrant Nigeria — rich culture, stunning landscapes, diverse cuisine.",
      highlights: ['Cultural festivals','Local cuisine','Art galleries','Music experiences','National monuments'],
      includes: ['Historical site visits','Airport transfers','Accommodation','Guided tours','Local experiences'],
      priceUSD: 800, priceNGN: 1200000, maxGroupSize: 25, requiresVisa: false, isFeatured: false, sortOrder: 6,
    },
  ];

  console.log('✈️  Seeding tours...');
  for (const t of tours) {
    const data = { ...t, isActive: true };
    await prisma.tour.upsert({ where: { slug: t.slug }, update: data, create: data });
  }
  console.log(`   ✓ ${tours.length} tours seeded`);

  // ─── VISA PACKAGES ───────────────────────────────────────────────────────────

  const visaPackages = [
    {
      slug: 'saudi-umrah-visa', name: 'Saudi Umrah Visa',
      country: 'Saudi Arabia', flag: '🇸🇦', priceUSD: 0, priceNGN: 1000000,
      processingTime: 'Fast Processing', validity: '30 Days',
      requirements: ['International passport (valid 6+ months)','Passport photograph (white background)','Bank statement (last 3 months)','Hotel booking confirmation','Flight itinerary','Vaccination certificate (Meningitis)'],
      description: 'Quick processing Saudi Umrah Visa for immediate travel needs.',
      isFeatured: true, sortOrder: 1,
    },
    {
      slug: 'uae-transit-visa', name: '96 Hours Dubai Transit Visa',
      country: 'United Arab Emirates', flag: '🇦🇪', priceUSD: 0, priceNGN: 200000,
      processingTime: '5 working days', validity: '96 hours (4 nights)',
      requirements: ['International passport (valid 6+ months from departure)','Passport photograph (white background)','Return flight ticket','Hotel booking in UAE','Bank statement','Travel insurance'],
      description: 'Transit visa allowing up to 4 nights in UAE. Perfect for stopovers.',
      isFeatured: false, sortOrder: 2,
    },
    {
      slug: 'schengen-visa', name: 'Schengen Visa (6 Months)',
      country: 'Europe (Schengen Area)', flag: '🇪🇺', priceUSD: 0, priceNGN: 350000,
      processingTime: '15 working days', validity: '6 Months',
      requirements: ['Valid international passport','Passport photographs','Bank statements (6 months)','Proof of accommodation','Return flight tickets','Travel insurance','Employment letter / business registration','Invitation letter (if applicable)'],
      description: 'Access 26 European Schengen countries. Processing fee ₦200,000 + visa center fee ₦150,000.',
      isFeatured: true, sortOrder: 3,
    },
    {
      slug: 'qatar-visa', name: 'Qatar Visa',
      country: 'Qatar', flag: '🇶🇦', priceUSD: 750, priceNGN: 0,
      processingTime: '5-7 working days', validity: '30 Days',
      requirements: ['International passport (valid 6+ months from departure)','Passport photograph (white background)','Return flight ticket','Hotel booking confirmation','Bank statement','Vaccination records (if required)'],
      description: 'Tourist and business visa processing for Qatar.',
      isFeatured: false, sortOrder: 4,
    },
  ];

  console.log('🛂 Seeding visa packages...');
  for (const v of visaPackages) {
    const data = { ...v, isActive: true };
    await prisma.visaPackage.upsert({ where: { slug: v.slug }, update: data, create: data });
  }
  console.log(`   ✓ ${visaPackages.length} visa packages seeded`);

  // ─── HOTELS ─────────────────────────────────────────────────────────────────

  const hotels = [
    // ── Makkah Hotels ────────────────────────────────────────────────────────
    {
      slug: 'fairmont-makkah',
      name: 'Fairmont Makkah Clock Hotel',
      location: 'Makkah',
      country: 'Saudi Arabia',
      stars: 5,
      image: '/Images/Hotels/Fairmont Makkah Clock Hotel.jpg',
      description: 'Iconic 5-star luxury hotel in the Abraj Al-Bait Clock Tower complex, directly overlooking the Grand Mosque. Offering premium rooms with Haram views, world-class dining, and all-inclusive Iftar & Suhur during Ramadan.',
      amenities: ['Free WiFi', 'Iftar & Suhur Included', 'Haram View Rooms', 'Spa & Wellness', 'Room Service', 'Concierge', 'Airport Shuttle', 'Fitness Center', 'Multiple Restaurants', 'Air Conditioning', 'Daily Housekeeping'],
      roomTypes: [
        { type: 'Single/Double', priceUSD: 10200, priceNGN: 0, capacity: 2 },
        { type: 'Triple', priceUSD: 7600, priceNGN: 0, capacity: 3 },
      ],
      distanceFromHaram: 'Clock Tower — directly attached to Masjid Al Haram',
      isFeatured: true, sortOrder: 1,
    },
    {
      slug: 'swissmaqam-makkah',
      name: 'Swissmaqam Hotel',
      location: 'Makkah',
      country: 'Saudi Arabia',
      stars: 5,
      image: '/Images/Hotels/Swissotel Al Maqam Hotel.jpg',
      description: '5-star Swissôtel property in the Abraj Al-Bait complex with panoramic Haram views. Includes Iftar & Suhur buffet during Ramadan. Walking distance to Masjid Al Haram.',
      amenities: ['Free WiFi', 'Iftar & Suhur Included', 'Haram View Rooms', 'Spa & Wellness', 'Room Service', 'Concierge', 'Airport Shuttle', 'Fitness Center', 'Restaurant', 'Air Conditioning', 'Daily Housekeeping'],
      roomTypes: [
        { type: 'Single/Double', priceUSD: 5900, priceNGN: 0, capacity: 2 },
        { type: 'Triple', priceUSD: 4570, priceNGN: 0, capacity: 3 },
        { type: 'Quad', priceUSD: 3900, priceNGN: 0, capacity: 4 },
      ],
      distanceFromHaram: 'Clock Tower — steps from Masjid Al Haram',
      isFeatured: true, sortOrder: 2,
    },
    {
      slug: 'movenpick-makkah',
      name: 'Movenpick Makkah Clock Hotel',
      location: 'Makkah',
      country: 'Saudi Arabia',
      stars: 5,
      image: '/Images/Hotels/Movenpick Makkah Clock Hotel.jfif',
      description: '5-star Mövenpick hotel in the Clock Tower complex offering exceptional service with Iftar & Suhur during Ramadan. Stunning views of the Grand Mosque and easy access to the Haram.',
      amenities: ['Free WiFi', 'Iftar & Suhur Included', 'Haram View Rooms', 'Spa', 'Room Service', 'Concierge', 'Airport Shuttle', 'Fitness Center', 'Restaurant', 'Air Conditioning', 'Daily Housekeeping'],
      roomTypes: [
        { type: 'Single/Double', priceUSD: 5495, priceNGN: 0, capacity: 2 },
        { type: 'Triple', priceUSD: 4400, priceNGN: 0, capacity: 3 },
        { type: 'Quad', priceUSD: 3825, priceNGN: 0, capacity: 4 },
      ],
      distanceFromHaram: 'Clock Tower — steps from Masjid Al Haram',
      isFeatured: true, sortOrder: 3,
    },
    {
      slug: 'al-shoada-makkah',
      name: 'Al Shoada Hotel',
      location: 'Ajyad Road, Makkah',
      country: 'Saudi Arabia',
      stars: 5,
      image: '/Images/Hotels/Anjum Hotel Makkah.jpg',
      description: '5-star hotel on Ajyad Road offering premium comfort and spirituality. Includes Iftar & Suhur during the last 10 days of Ramadan. Excellent value for a luxury Ramadan Umrah experience.',
      amenities: ['Free WiFi', 'Iftar & Suhur Included', 'Room Service', 'Concierge', 'Airport Shuttle', 'Fitness Center', 'Restaurant', 'Air Conditioning', 'Daily Housekeeping', 'Prayer Facilities'],
      roomTypes: [
        { type: 'Single/Double', priceUSD: 3420, priceNGN: 0, capacity: 2 },
        { type: 'Triple', priceUSD: 2460, priceNGN: 0, capacity: 3 },
        { type: 'Quad', priceUSD: 1980, priceNGN: 0, capacity: 4 },
      ],
      distanceFromHaram: '5-7 mins walk to Haram',
      isFeatured: false, sortOrder: 4,
    },
    {
      slug: 'badr-al-massa-makkah',
      name: 'Badr Al Massa Hotel',
      location: 'Makkah',
      country: 'Saudi Arabia',
      stars: 3,
      image: '/Images/Hotels/Badr Al Massa Hotel.jpg',
      description: 'Standard 3-star hotel in Makkah during the last 10 days of Ramadan. Room only — no meals included. A comfortable and affordable option for pilgrims.',
      amenities: ['Free WiFi', 'Air Conditioning', 'Daily Housekeeping', 'Prayer Facilities', 'Airport Shuttle'],
      roomTypes: [
        { type: 'Single', priceUSD: 0, priceNGN: 6000000, capacity: 1 },
        { type: 'Double', priceUSD: 0, priceNGN: 3000000, capacity: 2 },
        { type: 'Triple', priceUSD: 0, priceNGN: 2000000, capacity: 3 },
        { type: 'Quad', priceUSD: 0, priceNGN: 1500000, capacity: 4 },
      ],
      distanceFromHaram: '7-8 mins walk to Haram',
      isFeatured: false, sortOrder: 5,
    },
    {
      slug: 'emaar-al-khair-makkah',
      name: 'Emaar Al Khair Grand Hotel',
      location: 'Misfala Bridge, Makkah',
      country: 'Saudi Arabia',
      stars: 2,
      image: '/Images/Hotels/Emaar Al Khair Grand Hotel.jpg',
      description: 'Economy hotel at Misfala Bridge for the last 10 days of Ramadan. Room only — no meals included. Budget-friendly option for pilgrims seeking affordable accommodation.',
      amenities: ['Free WiFi', 'Air Conditioning', 'Daily Housekeeping', 'Prayer Facilities', 'Airport Shuttle'],
      roomTypes: [
        { type: 'Single', priceUSD: 0, priceNGN: 3800000, capacity: 1 },
        { type: 'Double', priceUSD: 0, priceNGN: 1900000, capacity: 2 },
        { type: 'Triple', priceUSD: 0, priceNGN: 1270000, capacity: 3 },
        { type: 'Quad', priceUSD: 0, priceNGN: 950000, capacity: 4 },
      ],
      distanceFromHaram: '15-18 mins walk to Haram',
      isFeatured: false, sortOrder: 6,
    },
    // ── Medina Hotels ─────────────────────────────────────────────────────────
    {
      slug: 'peninsula-worth-medina',
      name: 'Peninsula Worth Hotel',
      location: 'Medina',
      country: 'Saudi Arabia',
      stars: 5,
      image: '/Images/Hotels/Peninsula Worth Hotel.jpg',
      description: "Newest 5-star hotel in Medina — 4-5 minutes walk North of the Prophet's Mosque (Haram). Complimentary airport pickup for groups of 3+. Premium breakfast included.",
      amenities: ['Free WiFi', 'Breakfast Included', 'Airport Pickup', 'Room Service', 'Concierge', 'Fitness Center', 'Restaurant', 'Air Conditioning', 'Daily Housekeeping', 'Prayer Facilities'],
      roomTypes: [
        { type: 'Single/Double', priceUSD: 940, priceNGN: 0, capacity: 2 },
        { type: 'Triple', priceUSD: 700, priceNGN: 0, capacity: 3 },
        { type: 'Quad', priceUSD: 580, priceNGN: 0, capacity: 4 },
      ],
      distanceFromHaram: "4-5 mins walk North of Prophet's Mosque",
      isFeatured: true, sortOrder: 7,
    },
    {
      slug: 'leader-muna-kareem-medina',
      name: 'Leader Muna Kareem Medina Hotel',
      location: 'Medina',
      country: 'Saudi Arabia',
      stars: 4,
      image: '/Images/Hotels/Leader Muna Kareem Medina Hotel.jfif',
      description: "Standard 4-star hotel in Medina — 4-5 minutes walk North of the Prophet's Mosque. Complimentary airport pickup for groups of 3+. Comfortable rooms with meals included.",
      amenities: ['Free WiFi', 'Breakfast Included', 'Airport Pickup', 'Room Service', 'Restaurant', 'Air Conditioning', 'Daily Housekeeping', 'Prayer Facilities'],
      roomTypes: [
        { type: 'Single/Double', priceUSD: 575, priceNGN: 0, capacity: 2 },
        { type: 'Triple', priceUSD: 445, priceNGN: 0, capacity: 3 },
        { type: 'Quad', priceUSD: 380, priceNGN: 0, capacity: 4 },
      ],
      distanceFromHaram: "4-5 mins walk North of Prophet's Mosque",
      isFeatured: false, sortOrder: 8,
    },
    {
      slug: 'green-plaza-medina',
      name: 'Green Plaza Hotel',
      location: 'Medina',
      country: 'Saudi Arabia',
      stars: 3,
      image: '/Images/Hotels/Green Plaza Hotel.jpg',
      description: "Standard 3-star hotel in Medina — 5 minutes walk North of the Prophet's Mosque. Room only. Complimentary airport pickup for groups of 3+.",
      amenities: ['Free WiFi', 'Airport Pickup', 'Air Conditioning', 'Daily Housekeeping', 'Prayer Facilities'],
      roomTypes: [
        { type: 'Single', priceUSD: 0, priceNGN: 1400000, capacity: 1 },
        { type: 'Double', priceUSD: 0, priceNGN: 700000, capacity: 2 },
        { type: 'Triple', priceUSD: 0, priceNGN: 470000, capacity: 3 },
        { type: 'Quad', priceUSD: 0, priceNGN: 350000, capacity: 4 },
      ],
      distanceFromHaram: "5 mins walk North of Prophet's Mosque",
      isFeatured: false, sortOrder: 9,
    },
    {
      slug: 'diyar-l-huda-medina',
      name: 'Diyar l Huda Hotel',
      location: 'Medina',
      country: 'Saudi Arabia',
      stars: 2,
      image: '/Images/Hotels/Diyar l Huda Hotel.jpg',
      description: "Economy hotel in Medina located directly in front of the Bab Salaam Gate of the Prophet's Mosque. Room only. Complimentary airport pickup for groups of 3+.",
      amenities: ['Free WiFi', 'Airport Pickup', 'Air Conditioning', 'Daily Housekeeping', 'Prayer Facilities'],
      roomTypes: [
        { type: 'Single', priceUSD: 0, priceNGN: 1200000, capacity: 1 },
        { type: 'Double', priceUSD: 0, priceNGN: 600000, capacity: 2 },
        { type: 'Triple', priceUSD: 0, priceNGN: 400000, capacity: 3 },
        { type: 'Quad', priceUSD: 0, priceNGN: 300000, capacity: 4 },
      ],
      distanceFromHaram: "Directly in front of Bab Salaam Gate of Prophet's Mosque",
      isFeatured: false, sortOrder: 10,
    },
  ];

  console.log('🏨 Seeding hotels...');
  for (const h of hotels) {
    const data = { ...h, isActive: true };
    await prisma.hotel.upsert({ where: { slug: h.slug }, update: data, create: data });
  }
  console.log(`   ✓ ${hotels.length} hotels seeded`);

  console.log('\n✅ Database seeding complete!');
  console.log(`   📿 ${pilgrimages.length} Pilgrimages | ✈️  ${tours.length} Tours | 🛂 ${visaPackages.length} Visa Packages | 🏨 ${hotels.length} Hotels`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
