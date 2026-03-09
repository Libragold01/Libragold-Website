# Libragold Backend API + Admin Dashboard

Complete backend server and admin dashboard for the Libragold Group travel website.

## Tech Stack
- **API**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Email**: Nodemailer
- **Admin UI**: React + Vite + TypeScript + Tailwind CSS

---

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 16 running (installed at `C:\Program Files\PostgreSQL\16\data`)
- npm 9+

---

## First-Time Setup

### 1. Create the database

Open **pgAdmin** or run in PowerShell:
```bash
psql -U postgres -c "CREATE DATABASE libragold;"
```

### 2. Configure environment variables

Copy the example file and edit it:
```bash
cd backend
copy .env.example .env
```

Open `.env` and set:
```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/libragold"
JWT_SECRET=your-secret-key-change-this
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

> For Gmail: enable 2FA and create an **App Password** at https://myaccount.google.com/apppasswords

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Run Prisma migrations (creates all tables)

```bash
npm run db:push
# or for full migrations:
npm run db:migrate
```

### 5. Seed the database (creates admin user + default content)

```bash
npm run db:seed
```

This creates:
- Admin login: **username=admin**, **password=libragold2026**
- Default homepage content entries

### 6. Install admin dashboard dependencies

```bash
cd admin
npm install
```

---

## Running in Development

### Start the API server (port 3001)
```bash
# From backend/
npm run dev
```

### Start the admin dashboard (port 5174)
```bash
# From backend/admin/
npm run dev
```

Then visit:
- **API**: http://localhost:3001/health
- **Admin Dashboard**: http://localhost:5174

---

## Running in Production

### Build both
```bash
# Build API
cd backend
npm run build

# Build admin UI
cd admin
npm run build
```

### Start the server (serves both API + admin UI)
```bash
cd backend
NODE_ENV=production npm start
```

The admin UI will be available at: `http://your-server:3001/admin`

---

## API Endpoints

### Public (no auth required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/bookings` | Create a new booking |
| POST | `/api/lwa/register` | Register LWA ambassador |
| GET | `/api/content` | Get all site content |
| GET | `/health` | Health check |

### Protected (require `Authorization: Bearer <token>`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Admin login → returns JWT |
| GET | `/api/auth/me` | Get current admin info |
| GET | `/api/bookings` | List all bookings |
| GET | `/api/bookings/:id` | Get single booking |
| PATCH | `/api/bookings/:id/status` | Update booking status |
| GET | `/api/lwa` | List all ambassadors |
| PATCH | `/api/lwa/:id/status` | Activate/suspend ambassador |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| PUT | `/api/content/:key` | Update content value |

---

## Frontend Integration

To connect your website forms to the API, replace Web3Forms calls with:

### Booking forms
```javascript
await fetch('http://localhost:3001/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    service: 'Pilgrimage',          // required
    customerName: formData.fullName, // required
    email: formData.email,           // required
    phone: formData.phone,           // required
    amount: '₦5,700,000',
    paymentMethod: 'Pay Later',
    referralCode: formData.referralCode,
    details: {                       // any extra fields
      passportNumber: formData.passportNumber,
      dateOfBirth: formData.dateOfBirth,
      // ... etc
    }
  })
});
```

### LWA registration
```javascript
await fetch('http://localhost:3001/api/lwa/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    city: formData.city,
    occupation: formData.occupation,
    socialMedia: formData.socialMedia,
    howHeard: formData.howYouHeard,
  })
});
// Response: { ambassador: { lwaCode: 'LWA01', ... } }
```

---

## Admin Dashboard Pages

| Page | Path | Description |
|------|------|-------------|
| Login | `/login` | Username/password auth |
| Dashboard | `/dashboard` | Stats, charts, recent bookings |
| Bookings | `/bookings` | Full booking management |
| LWA | `/lwa` | Ambassador management |
| Content | `/content` | Edit homepage content |

---

## Default Admin Credentials

```
Username: admin
Password: libragold2026
```

> **Change this password immediately in production!**

To change: update the seed file or use a SQL command:
```sql
-- In psql or pgAdmin:
UPDATE "Admin" SET password = '$2b$12$...' WHERE username = 'admin';
```

Or re-run with a new password in seed.ts and `npm run db:seed`.

---

## File Structure

```
backend/
├── src/
│   ├── index.ts              Express app + server startup
│   ├── middleware/
│   │   └── auth.ts           JWT middleware
│   ├── routes/
│   │   ├── auth.ts           Login + /me
│   │   ├── bookings.ts       CRUD bookings
│   │   ├── lwa.ts            Ambassador CRUD
│   │   ├── dashboard.ts      Stats endpoint
│   │   └── content.ts        Site content
│   └── utils/
│       └── email.ts          Nodemailer templates
├── prisma/
│   ├── schema.prisma         Database schema
│   └── seed.ts               Seed admin + content
├── admin/                    React Vite admin UI
│   ├── src/
│   │   ├── App.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   └── api.ts        API client
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Bookings.tsx
│   │   │   ├── LWA.tsx
│   │   │   └── Content.tsx
│   │   └── components/
│   │       ├── Layout.tsx
│   │       ├── StatsCard.tsx
│   │       ├── StatusBadge.tsx
│   │       └── BookingTable.tsx
│   ├── package.json
│   └── vite.config.ts
├── .env                      Your environment config
├── .env.example              Template
├── package.json
└── tsconfig.json
```

---

## Troubleshooting

**"Can't connect to database"**
- Make sure PostgreSQL is running: check Windows Services for `postgresql-x64-16`
- Verify the password in `.env` matches your PostgreSQL postgres user password

**"CORS error from frontend"**
- Add your frontend origin to `ALLOWED_ORIGINS` in `.env`
- Example: `ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com`

**"Email not sending"**
- Check SMTP credentials in `.env`
- For Gmail: use an App Password, not your regular password
- Email failures are non-blocking — bookings still save to the database

**"Module not found" errors**
- Run `npm install` in both `backend/` and `backend/admin/`
- Run `npm run db:generate` to regenerate Prisma client after schema changes
