// ─── Libragold Group — Central Configuration ─────────────────────────────────
//
// All API keys and global constants live here.
// When a backend is introduced, replace these values with environment variable
// reads (import.meta.env.VITE_*) or API responses. No other file needs to
// change — just update this file.
//
// ─────────────────────────────────────────────────────────────────────────────

// Web3Forms — handles email notifications for all booking/contact forms.
// Replace with a server-side email service (e.g. Nodemailer, SendGrid) when
// the backend is ready.
export const WEB3FORMS_KEY = 'dc98498a-5066-478d-99f3-8524d9412556';

// Exchange rate used to convert USD prices to Naira across the site.
// Update this value when the rate changes, or fetch it from an API later.
export const USD_TO_NGN_RATE = 1510;

// WhatsApp contact number for customer support links.
export const WHATSAPP_NUMBER = '2348038176535';

// LWA (Libragold Work Ambassador) referral code settings.
// The key used in localStorage to track the sequential code counter.
// Changing this key effectively resets all counters (useful between test runs).
export const LWA_COUNTER_KEY = 'lwa_code_v2';
