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
- **Database**: SQLite via Prisma ORM (instantly swappable to PostgreSQL / Supabase via connection string)
- **Authentication**: Role-based access control (RBAC), bcrypt password hashing, HTTP-only secure JWT cookies
- **Security**: Private document access control, server-side entitlement validation, input sanitization
