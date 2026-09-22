# 🎓 Student Fee Management System (SFM)

An enterprise-grade, full-stack institutional fee ledger and digital payment reconciliation system designed for modern schools and colleges. Built with **React 19**, **Node.js / Express 5**, **MongoDB**, **Tailwind CSS v4**, and native **eSewa Online Payment Gateway** integration.

---

## 🌟 Highlights

- 🔒 **Granular Role-Based Access Control (RBAC)** — Tailored portals and strict server-side authorization for **Admin**, **Principal**, **Accountant**, and **Student**.
- 💳 **Integrated eSewa Payment Gateway** — Cryptographic HMAC-SHA256 signed requests, instant transaction verification, and automatic ledger settlement.
- 📑 **Comprehensive Fee Ledgers** — Automatic calculation of gross fees, separate tracking for scholarships/discounts, fine rules with grace periods, and net payables.
- 🖨️ **Automated PDF Receipts** — Instant, verifiable, sequence-numbered receipts generated via PDFKit with institutional branding.
- 📊 **Executive Dashboards & Analytics** — Real-time revenue tracking (Today's till, monthly collection, overdue aging, payment method distribution).
- 📥 **Export to Excel / CSV** — One-click export of collection summaries, pending dues, and full student rosters.
- 🛡️ **Audit Trails & Security** — Immutable audit logs for every adjustment, reversal, and payment with JWT auth & HTTP-only cookies.

---

## 👥 Role & Permissions Matrix

| Module / Feature                              |           Admin           |      Principal      |     Accountant     |       Student       |
| :-------------------------------------------- | :-----------------------: | :-----------------: | :----------------: | :-----------------: |
| **System Dashboard**                          |        Full Access        | Read-Only Analytics |    Full Access     |  Personal Overview  |
| **Academic Setup (Years, Classes, Sections)** |        Full (CRUD)        |         ❌          |         ❌         |         ❌          |
| **User & Staff Management**                   |        Full (CRUD)        |         ❌          |         ❌         |         ❌          |
| **Fee Structure Configuration**               |        Full (CRUD)        |         ❌          |         ❌         |         ❌          |
| **Student Profiles**                          |        Full (CRUD)        |      Read-Only      |    Full (CRUD)     | Own Profile (`/me`) |
| **Fee Ledger Assignment**                     | Full (Assign/Edit/Cancel) |      Read-Only      | Full (Assign/Edit) |  Own Ledgers Only   |
| **Offline Fee Collection (Cash/Cheque/Bank)** |            ✅             |         ❌          |         ✅         |         ❌          |
| **eSewa Online Payment**                      |            ❌             |         ❌          |         ❌         |    ✅ (Own Fees)    |
| **Payment Reversals & Refunds**               |    ✅ (Admin Approved)    |         ❌          |         ❌         |         ❌          |
| **Receipt Generation & PDF Download**         |            ✅             |         ✅          |         ✅         |  ✅ (Own Receipts)  |
| **Financial Reports & CSV Export**            |            ✅             |   ✅ (Read-Only)    |         ✅         |         ❌          |

---

## 🏗️ Architecture & Tech Stack

```
STUDENT-FEE-MANAGEMENT/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── config/           # Database, JWT, Logger config
│   │   ├── middleware/       # Auth, RBAC, Validation, Error handling
│   │   ├── modules/          # Domain-driven feature modules
│   │   │   ├── auth/         # Auth, Refresh Tokens, Email Verification
│   │   │   ├── users/        # User accounts & role management
│   │   │   ├── students/     # Student roster & profiles
│   │   │   ├── classes/      # Classes & grade levels
│   │   │   ├── sections/     # Class sections
│   │   │   ├── academicYear/ # Academic calendar years
│   │   │   ├── feeStructure/ # Standardized fee definitions
│   │   │   ├── studentFee/   # Assigned ledgers & ledger balances
│   │   │   ├── payment/      # Offline & eSewa payment processing
│   │   │   ├── receipt/      # Sequence counters & PDF generation
│   │   │   ├── reports/      # Financial summaries & CSV analytics
│   │   │   └── auditLog/     # Activity tracking & audit trails
│   │   └── shared/           # Utilities, helpers, API response formatters
│   └── index.js
│
└── frontend/                 # React 19 + Vite SPA
    ├── src/
    │   ├── api/              # Axios instance & interceptors
    │   ├── app/              # Router & Route guards (RoleRoute, ProtectedRoute)
    │   ├── components/       # Common, layout, & dashboard UI components
    │   ├── config/           # Navigation & role matrices
    │   ├── features/         # Feature-specific state, API, and hooks
    │   │   ├── auth/         # Context, store, hooks
    │   │   ├── students/     # Student queries & mutations
    │   │   ├── studentFee/   # Fee assignment & student personal ledgers
    │   │   ├── payments/     # Payment recording & eSewa initiation
    │   │   └── reports/      # Analytics queries
    │   └── pages/            # Page-level components
```

### Technology Breakdown

- **Frontend**: React 19, Vite, Tailwind CSS v4, TanStack Query v5, React Router v7, Lucide Icons, Axios.
- **Backend**: Node.js, Express v5, MongoDB + Mongoose v9, JWT, bcryptjs, PDFKit, ExcelJS, Joi, Winston, Node-Cron.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** >= 6.x (Local instance or MongoDB Atlas)
- **npm** or **pnpm** / **yarn**

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

#### Backend Environment Variables (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/student-fee-management

# JWT Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_key_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_min_32_chars
JWT_REFRESH_EXPIRES_IN=30d

# Frontend Base URL (for CORS and redirects)
FRONTEND_URL=http://localhost:5173

# eSewa Payment Gateway Config (Test / Production)
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_PAYMENT_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_STATUS_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_SUCCESS_URL=http://localhost:5000/api/v1/payments/online/esewa/success
ESEWA_FAILURE_URL=http://localhost:5000/api/v1/payments/online/esewa/failure
```

Start the backend development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api/v1`.

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 📡 API Endpoints Overview

### Authentication (`/api/v1/auth`)

- `POST /register` — Register a new student account
- `POST /login` — Authenticate user & issue tokens
- `POST /refresh` — Refresh access token using HTTP-only cookie
- `GET /me` — Get current logged-in user profile
- `POST /logout` — Invalidate session and clear refresh cookies

### Students (`/api/v1/students`)

- `GET /me` — Logged-in student's personal profile _(Student only)_
- `GET /` — List students with filters, search, and pagination _(Admin, Principal, Accountant)_
- `POST /` — Create student record _(Admin, Accountant)_
- `GET /:id` — Get student details
- `PATCH /:id` — Update student profile
- `GET /export/csv` — Export student directory to CSV

### Fee Structures (`/api/v1/fee-structures`)

- `GET /` — List fee structures
- `POST /` — Create fee structure by Class & Academic Year _(Admin)_
- `PATCH /:id` — Update fee structure _(Admin)_

### Student Fees & Ledgers (`/api/v1/student-fees`)

- `GET /my-fees` — Current student's fee ledgers _(Student only)_
- `GET /my-summary` — Current student's fee summary _(Student only)_
- `GET /my-fees/:id` — Specific student fee details _(Student only)_
- `GET /` — List all student fee ledgers _(Admin, Principal, Accountant)_
- `POST /` — Assign fee structure to student _(Admin, Accountant)_
- `PATCH /:id/cancel` — Cancel fee record _(Admin)_

### Payments & eSewa (`/api/v1/payments`)

- `POST /offline` — Record Cash, Cheque, or Bank Transfer payment _(Admin, Accountant)_
- `POST /online/esewa/initiate` — Initiate online payment with signature _(Student)_
- `GET /online/esewa/success` — eSewa callback & automatic settlement
- `GET /my-payments` — Current student's payment history _(Student only)_
- `GET /student-fee/:id` — Payment history for a specific fee record
- `POST /:id/reverse` — Reverse payment with audit trail _(Admin, Accountant)_

### Receipts (`/api/v1/receipts`)

- `GET /payment/:paymentId` — Fetch receipt details
- `GET /:id/pdf` — Stream / Download official receipt PDF

### Reports & Analytics (`/api/v1/reports`)

- `GET /dashboard` — Consolidated executive financial summary _(Admin, Principal, Accountant)_
- `GET /today-collection` — Today's total till collection
- `GET /monthly-collection` — Monthly revenue breakdown
- `GET /student-dues` — Outstanding fee dues list
- `GET /export/csv` — Export financial reports to CSV

---

## 🔒 Security Architecture

1. **Strict Ownership Validation**: Student routes enforce ownership (`studentFee.studentId === req.user.studentProfile._id`), preventing horizontal authorization bypasses.
2. **Double-Spend & Overpayment Prevention**: eSewa payments lock against pending transactions and reject amounts exceeding remaining dues.
3. **Cryptographic Signatures**: Online payment integrity verified using HMAC-SHA256 hashing against eSewa security parameters.
4. **Token Security**: Short-lived Access Tokens (memory/header) + Secure, HTTP-only, SameSite Refresh Tokens with rotation.
5. **MongoDB Transactions**: Atomic multi-document transactions ensure ledger balance updates and receipt creations never get out of sync.

---

## 📄 License

This project is licensed under the **ISC License**.
