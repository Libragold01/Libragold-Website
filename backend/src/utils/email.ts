import nodemailer from 'nodemailer';

// Create transporter from environment variables
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
}

const fromAddress = process.env.SMTP_FROM || 'noreply@libragoldgroup.com';
const fromLabel = `Libragold Group <${fromAddress}>`;

// ─── Booking confirmation email ───────────────────────────────────────────────

export async function sendBookingConfirmationEmail(booking: {
  bookingRef: string;
  service: string;
  customerName: string;
  email: string;
  phone: string;
  amount?: string | null;
  paymentMethod?: string | null;
  referralCode?: string | null;
}): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[Email] SMTP not configured, skipping booking confirmation email');
    return;
  }

  const transporter = createTransporter();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: #111827; padding: 32px; text-align: center; }
    .header h1 { color: #D4AF37; margin: 0; font-size: 24px; }
    .header p { color: #9ca3af; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .ref-box { background: #D4AF37; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px; }
    .ref-box .label { font-size: 12px; color: #333; text-transform: uppercase; letter-spacing: 1px; }
    .ref-box .code { font-size: 28px; font-weight: bold; color: #111; letter-spacing: 2px; }
    .details { background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #6b7280; font-size: 14px; }
    .detail-value { color: #111827; font-weight: 600; font-size: 14px; }
    .note { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; font-size: 14px; color: #92400e; }
    .footer { background: #111827; padding: 24px; text-align: center; color: #6b7280; font-size: 12px; }
    .footer a { color: #D4AF37; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LIBRAGOLD GROUP</h1>
      <p>Your Trusted Travel Partner</p>
    </div>
    <div class="body">
      <h2 style="color:#111827;margin-top:0;">Booking Received!</h2>
      <p style="color:#6b7280;">Dear <strong>${booking.customerName}</strong>, thank you for choosing Libragold Group. Your booking has been received and is being processed.</p>

      <div class="ref-box">
        <div class="label">Booking Reference</div>
        <div class="code">${booking.bookingRef}</div>
      </div>

      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">${booking.service}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Name</span>
          <span class="detail-value">${booking.customerName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${booking.phone}</span>
        </div>
        ${booking.amount ? `<div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value">${booking.amount}</span></div>` : ''}
        ${booking.paymentMethod ? `<div class="detail-row"><span class="detail-label">Payment</span><span class="detail-value">${booking.paymentMethod}</span></div>` : ''}
        ${booking.referralCode ? `<div class="detail-row"><span class="detail-label">Referral Code</span><span class="detail-value">${booking.referralCode}</span></div>` : ''}
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="detail-value" style="color:#d97706;">Pending</span>
        </div>
      </div>

      <div class="note">
        <strong>What happens next?</strong><br>
        Our team will review your booking and contact you within 24–48 hours via phone or email with further details and payment instructions.
      </div>
    </div>
    <div class="footer">
      <p>Libragold Group &bull; Lagos, Nigeria</p>
      <p><a href="https://libragoldgroup.com">libragoldgroup.com</a></p>
      <p style="color:#4b5563;font-size:11px;">Save your booking reference: <strong style="color:#D4AF37;">${booking.bookingRef}</strong></p>
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: fromLabel,
    to: booking.email,
    subject: `Booking Received — ${booking.bookingRef} | Libragold Group`,
    html,
  });

  console.log(`[Email] Booking confirmation sent to ${booking.email} (${booking.bookingRef})`);
}

// ─── LWA Welcome email ────────────────────────────────────────────────────────

export async function sendLWAWelcomeEmail(ambassador: {
  lwaCode: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
}): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[Email] SMTP not configured, skipping LWA welcome email');
    return;
  }

  const transporter = createTransporter();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #111827, #1f2937); padding: 32px; text-align: center; }
    .header h1 { color: #D4AF37; margin: 0; font-size: 24px; }
    .header p { color: #9ca3af; margin: 8px 0 0; }
    .body { padding: 32px; }
    .code-box { background: linear-gradient(135deg, #D4AF37, #F4E4C1); border-radius: 16px; padding: 32px; text-align: center; margin: 24px 0; }
    .code-box .label { font-size: 12px; color: #333; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
    .code-box .code { font-size: 48px; font-weight: 900; color: #111; letter-spacing: 4px; }
    .steps { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .step { display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start; }
    .step-num { background: #D4AF37; color: #111; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0; }
    .footer { background: #111827; padding: 24px; text-align: center; color: #6b7280; font-size: 12px; }
    .footer a { color: #D4AF37; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LIBRAGOLD GROUP</h1>
      <p>Libragold Work Ambassador Program</p>
    </div>
    <div class="body">
      <h2 style="color:#111827;margin-top:0;">Welcome, Ambassador! 🎉</h2>
      <p style="color:#6b7280;">Congratulations, <strong>${ambassador.fullName}</strong>! You're now officially a <strong>Libragold Work Ambassador</strong>. Your unique referral code is ready.</p>

      <div class="code-box">
        <div class="label">Your LWA Referral Code</div>
        <div class="code">${ambassador.lwaCode}</div>
      </div>

      <div class="steps">
        <h3 style="margin-top:0;color:#111827;">How to Start Earning:</h3>
        <div class="step">
          <div class="step-num">1</div>
          <div style="font-size:14px;color:#374151;">Share your code <strong>${ambassador.lwaCode}</strong> with friends, family, and your network</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div style="font-size:14px;color:#374151;">Ask them to enter your code when booking any Libragold service (Tours, Hajj, Hotel, Visa, etc.)</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div style="font-size:14px;color:#374151;">Earn your commission for every successful booking made with your code</div>
        </div>
        <div class="step">
          <div class="step-num">4</div>
          <div style="font-size:14px;color:#374151;">Our team will contact you within 24 hours with full ambassador guidelines and commission details</div>
        </div>
      </div>

      <p style="font-size:13px;color:#6b7280;background:#fef3c7;padding:12px;border-radius:8px;border:1px solid #fcd34d;">
        <strong>Important:</strong> Save your code <strong>${ambassador.lwaCode}</strong> safely. You will need it to track your referrals and commissions.
      </p>
    </div>
    <div class="footer">
      <p>Libragold Group &bull; Lagos, Nigeria</p>
      <p><a href="https://libragoldgroup.com">libragoldgroup.com</a></p>
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: fromLabel,
    to: ambassador.email,
    subject: `Welcome to LWA! Your Code: ${ambassador.lwaCode} | Libragold Group`,
    html,
  });

  console.log(`[Email] LWA welcome sent to ${ambassador.email} (${ambassador.lwaCode})`);
}
