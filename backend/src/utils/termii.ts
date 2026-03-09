/**
 * Termii API integration
 * Collects customer emails and phone numbers by adding them to a Termii phonebook.
 * Also sends SMS booking confirmations to customers.
 * Docs: https://developers.termii.com/
 */

const TERMII_BASE = 'https://v3.api.termii.com';
const API_KEY = process.env.TERMII_API_KEY || '';
const PHONEBOOK_ID = process.env.TERMII_PHONEBOOK_ID || '';
const SENDER_ID = process.env.TERMII_SENDER_ID || 'Libragold';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TermiiContact {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  company?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Normalize a Nigerian phone number to international format (234XXXXXXXXXX) */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0')) return '234' + digits.slice(1);
  return digits;
}

/** Split a full name into first/last */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || fullName;
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Add a contact to the Termii phonebook.
 * Non-fatal — if Termii is unreachable, we log and continue.
 */
export async function addTermiiContact(contact: TermiiContact): Promise<void> {
  if (!API_KEY || !PHONEBOOK_ID) return; // Not configured — skip silently

  const phone = normalizePhone(contact.phone);

  try {
    const res = await fetch(
      `${TERMII_BASE}/api/phonebook/${PHONEBOOK_ID}/contacts`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: API_KEY,
          phone_number: phone,
          email_address: contact.email || '',
          first_name: contact.firstName,
          last_name: contact.lastName || '',
          company: contact.company || 'Libragold',
        }),
      }
    );
    const data = await res.json() as { message?: string };
    if (!res.ok) {
      console.warn('[Termii] Add contact failed:', data.message);
    } else {
      console.log(`[Termii] Contact added: ${phone}`);
    }
  } catch (err) {
    console.warn('[Termii] Add contact error (non-fatal):', err);
  }
}

/**
 * Send an SMS confirmation to the customer via Termii.
 * Non-fatal — if Termii is unreachable, we log and continue.
 */
export async function sendTermiiSMS(phone: string, message: string): Promise<void> {
  if (!API_KEY) return; // Not configured — skip silently

  const normalizedPhone = normalizePhone(phone);

  try {
    const res = await fetch(`${TERMII_BASE}/api/sms/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: normalizedPhone,
        from: SENDER_ID,
        sms: message,
        type: 'plain',
        api_key: API_KEY,
        channel: 'generic',
      }),
    });
    const data = await res.json() as { message?: string };
    if (!res.ok) {
      console.warn('[Termii] SMS send failed:', data.message);
    } else {
      console.log(`[Termii] SMS sent to ${normalizedPhone}`);
    }
  } catch (err) {
    console.warn('[Termii] SMS send error (non-fatal):', err);
  }
}

/**
 * Convenience: add contact + send booking confirmation SMS.
 * Called from the bookings route when a new booking is created.
 */
export async function notifyBookingViaTermii(params: {
  customerName: string;
  email: string;
  phone: string;
  service: string;
  bookingRef: string;
}): Promise<void> {
  const { firstName, lastName } = splitName(params.customerName);

  // 1. Add to phonebook (collect the contact)
  await addTermiiContact({
    firstName,
    lastName,
    email: params.email,
    phone: params.phone,
    company: `Libragold - ${params.service}`,
  });

  // 2. Send SMS confirmation
  const sms =
    `Hi ${firstName}! Your Libragold booking request (${params.service}) has been received. ` +
    `Ref: ${params.bookingRef}. Our team will contact you shortly. Thank you!`;

  await sendTermiiSMS(params.phone, sms);
}

/**
 * Notify an LWA ambassador registration via Termii.
 */
export async function notifyLWAViaTermii(params: {
  fullName: string;
  email: string;
  phone: string;
  lwaCode: string;
}): Promise<void> {
  const { firstName, lastName } = splitName(params.fullName);

  await addTermiiContact({
    firstName,
    lastName,
    email: params.email,
    phone: params.phone,
    company: 'Libragold LWA Ambassador',
  });

  const sms =
    `Welcome to Libragold's LWA Ambassador Program, ${firstName}! ` +
    `Your ambassador code is ${params.lwaCode}. Start sharing and earning today!`;

  await sendTermiiSMS(params.phone, sms);
}
