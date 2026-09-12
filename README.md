# SevaDesk — "Government Documents, Made Simple."

> An independent digital public service platform empowering Indian citizens to understand official documents, draft standardized bilingual applications, and connect with verified local Cyber Café operators.

---

## 🇮🇳 Public Service Design & Ethics

SevaDesk is intentionally designed **not** to look like a generic AI or SaaS website:
- **No futuristic AI gradients or neon glows**
- **No floating robot illustrations or gimmicks**
- Clean, accessible, trustworthy Indian public service visual identity with Tricolor accent and high-contrast typography.
- Clear distinction between **Statutory Official Government Portal Fees** vs **Private Cyber Café Service Charges**.
- Visible and consistent statutory legal disclaimers.

---

## 🌟 Key Product Features

1. **Structured Government Services Directory**: 15+ central and state services (Income, Caste, Domicile, EWS, PAN Card, Aadhaar demographic updates, Sarathi Driving Licence, PM-Kisan, Ration Card, Birth certificates) with required proofs checklists, expected timelines, and official portal links.
2. **Standardized Bilingual A4 Document Form Builder**: Live dual-pane preview showing exact standard Indian application formats with formal declarations and signature sections. Print and save as PDF.
3. **Verified Cyber Café Discovery & Rate Cards**: Real-time filtering by state, district, verified status, with transparent pricing tables for typing, printing, scanning, and lamination.
4. **End-to-End Service Request & Secure Chat**: Citizens can initiate requests, share draft applications with explicit privacy consent, chat in real-time, and leave verified 1–5 star reviews.
5. **AdProvider Abstraction (Free vs Premium ₹99/mo)**: Clean ad-network abstraction with demo reward player simulation and server-side entitlement verification, paired with mock Razorpay payment workflow.
6. **Super Admin Suite**: Instant operator verification approvals/rejections, published services catalog, user management, and detailed audit logging.

---

## 👥 Demo Test Accounts

| Role | Email | Password | Details |
|---|---|---|---|
| **Citizen** | `user@sevadesk.in` | `User@123456` | Active Premium subscriber with saved drafts |
| **Verified Cyber Café** | `operator@delhicyber.in` | `Cafe@123456` | Verma Digital Seva Kendra (Central Delhi) |
| **Pending Cyber Café** | `newcafe@biharseva.in` | `Cafe@123456` | Manoj Cyber Point & CSC (Patna, Bihar) |
| **Super Admin** | `admin@sevadesk.in` | `Admin@123456` | National Administrator with audit access |

---

## 🚀 Quick Setup Instructions

### 1. Requirements
- Node.js 18+ or 20+
- npm 9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize & Seed Database
```bash
npx prisma generate
npx prisma db push
node prisma/seed.mjs
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack & Security
- **Frontend & Backend**: Next.js 14 App Router, React, Strict TypeScript, Tailwind CSS
- **Database**: Supabase PostgreSQL via Prisma ORM
- **Authentication**: Role-based access control (RBAC), bcrypt password hashing, HTTP-only secure JWT cookies
- **Security**: Private document access control, server-side entitlement validation, input sanitization

---

## ☁️ Vercel Deployment & Environment Configuration

When deploying to Vercel, configure the following environment variables in **Project Settings > Environment Variables**:

| Variable | Required | Environments | Description |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | Production, Preview, Development | Supabase PostgreSQL Connection Pooler URI (port 6543, with `?pgbouncer=true`) or direct connection URI (port 5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Production, Preview, Development | Supabase Project URL (`https://[YOUR-PROJECT-ID].supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Production, Preview, Development | Supabase Anonymous Public API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Production, Preview, Development | Supabase Service Role Secret Key (Server-only; for seed sync & admin tasks) |
| `NEXT_PUBLIC_APP_URL` | Optional | Production, Preview, Development | Canonical public production URL (e.g. `https://sevadesk.vercel.app`) |
| `JWT_SECRET` | Optional | Production, Preview, Development | Secret key for legacy fallback session signing |

> **Note:** Seed commands are **not** run during Vercel builds to ensure production data is never wiped. Run schema migrations and seeding manually from your terminal using `npx prisma db push` and `node prisma/seed.mjs`.

---

## ⚡ Supabase Dashboard Setup Guide

Follow these steps to configure your Supabase backend for SevaDesk:

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **New Project**.
2. Select an organization, provide a project name (e.g., `sevadesk-prod`), and generate a strong database password.
3. Choose the region closest to your primary user base (e.g., `ap-south-1` Mumbai).

### 2. Locate Your Credentials
- **API Credentials**: Navigate to **Project Settings > API**:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` (Keep secure, never expose in frontend)
- **Database Connection String**: Navigate to **Project Settings > Database**:
  - Under **Connection string > URI**, select **Connection pooling (Transaction mode)** on port `6543`.
  - Copy URI and replace `[YOUR-PASSWORD]` → `DATABASE_URL`.

### 3. Push Prisma Schema
Push the application tables and relations directly to your Supabase PostgreSQL database:
```bash
npx prisma db push
```

### 4. Execute Row Level Security (RLS) Policies
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Open [`supabase/rls_policies.sql`](supabase/rls_policies.sql), paste its contents into a new query, and click **Run**.
3. This secures all public tables (`User`, `CyberCafe`, `UserDocument`, `ServiceRequest`, `Conversation`, `Message`, `Review`, `AuditLog`, etc.) with role-based policies.

### 5. Configure Storage Buckets & Storage Policies
1. In the Supabase Dashboard SQL Editor, open and run [`supabase/storage_setup.sql`](supabase/storage_setup.sql).
2. This creates:
   - `documents` (Private, 15MB limit, signed URLs for citizen proofs and drafted PDFs)
   - `avatars` (Public, 5MB limit, profile pictures)
   - `templates` (Public, 10MB limit, blank government application templates)

### 6. Configure Auth Redirect URLs
In Supabase Dashboard under **Authentication > URL Configuration**:
- **Site URL**: `https://your-domain.vercel.app` (or `http://localhost:3000` for local development)
- **Redirect URLs**:
  - `http://localhost:3000/**`
  - `https://your-domain.vercel.app/**`
  - `https://your-domain.vercel.app/auth/callback`
  - `https://your-domain.vercel.app/auth/reset-password`

### 7. Seed Demo Data (Optional)
To seed initial categories, 15+ central/state government services, document templates, and test accounts:
```bash
node prisma/seed.mjs
```

