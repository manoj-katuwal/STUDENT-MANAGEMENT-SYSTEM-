# 🎓 Student Fee Management System - Backend API

A robust, enterprise-grade RESTful API built with **Node.js**, **Express.js**, and **MongoDB** designed to automate school fee collection, scholarship allocations, fine calculations, payment gateway integrations, and financial reporting.

---

## 🚀 Features & Modules

### 🔐 1. Authentication & Role-Based Access Control (RBAC)
- **JWT & Cookie Security**: Dual token system (short-lived access tokens & secure HTTP-only refresh tokens).
- **Roles Supported**: `ADMIN`, `ACCOUNTANT`, `PRINCIPAL`, `TEACHER`, `PARENT`, `STUDENT`.
- **Account Management**: Password reset flows, email verification, session revocation.

### 🏫 2. Academic Management
- **Academic Years**: Define active/inactive academic sessions.
- **Classes & Sections**: Hierarchical mapping of classes and sections with validation checks.

### 👨‍🎓 3. Student Management
- Student profile creation, updates, guardian details, and active status tracking.
- Linked user account mapping with partial index indexing to prevent duplicate null errors.

### 💰 4. Fee Structures & Student Fees
- **Fee Structures**: Define custom fees per class (e.g., Tuition, Transport, Exam, Computer lab fees).
- **Student Fee Generation**: Auto-generate fee bills per academic year and class/section.
- **Dynamic Calculation**: Automatic recalculation of total, discount, scholarship, fine, paid, and net due amounts.

### 🎁 5. Discounts & Scholarships
- **Discounts**: Award fixed or percentage-based discounts to students.
- **Scholarships**: Award Merit, Need-Based, or Sponsor scholarships (`FIXED` or `PERCENTAGE`).
- **Allocation Engine**: Cap validation preventing total discounts/scholarships from exceeding the net bill amount or dipping below already paid amounts.

### ⚠️ 6. Fine Policy & Calculation Engine
- **Flexible Fine Policies**: Create `FIXED` or `DAILY_FIXED` fine policies per fee type (`TUITION`, `TRANSPORT`, etc.).
- **Grace Periods & Fine Caps**: Configurable grace period days and maximum fine caps.
- **Calculation Engine**: `POST /api/v1/fines/calculate` automatically scans overdue bills and computes accurate fines.

### 💳 7. Payment Processing & eSewa Gateway
- **Multi-channel Payments**: Record Cash, Bank Transfer, and Online Payments.
- **eSewa Payment Gateway Integration**: Native integration with eSewa v2 EPAY API for online digital payments.
- **Partial & Full Payments**: Automatically updates student fee status (`PENDING`, `PARTIAL`, `PAID`).
- **Receipts**: Auto-generate payment receipts and track transaction IDs.

### 📊 8. Reports, Exports & Audit Logs
- **Financial Reports**: Overview of total revenue, collection summary, outstanding dues, and discounts awarded.
- **PDF & Excel Exports**: Download fee receipts (PDFKit) and financial collection reports (ExcelJS).
- **Audit Logging**: Immutable tracking of critical administrative actions.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`
- **Validation**: Joi
- **Security**: Helmet, CORS, Custom Request Logger, Request IDs
- **Payment Gateway**: eSewa API v2
- **Document Generation**: PDFKit (PDF), ExcelJS (Excel)
- **Logging**: Winston logger & custom request middleware

---

## 📁 Project Architecture

```
STUDENT FEE MANAGEMENT/
├── backend/
│   ├── src/
│   │   ├── app.js                   # Express application setup & global middlewares
│   │   ├── index.js                 # Database connection & server entry point
│   │   ├── config/                  # DB and app config
│   │   ├── middleware/              # Authentication, authorization, validation, error handler
│   │   ├── routes/                  # Central API router mapping
│   │   ├── shared/                  # Utilities, logger (Winston), AppError, API responses
│   │   └── modules/                 # Modular Domain Architecture
│   │       ├── academicYear/        # Academic Years module
│   │       ├── auditLog/            # Audit logging module
│   │       ├── auth/                # Authentication & Password Reset
│   │       ├── classes/             # Class management module
│   │       ├── discounts/           # Discount allocation module
│   │       ├── export/              # PDF & Excel export module
│   │       ├── feeStructure/        # Fee Structure definition module
│   │       ├── fines/               # Fine policies & calculation engine
│   │       ├── notification/        # System notifications module
│   │       ├── payment/             # Payment processing & eSewa integration
│   │       ├── paymentReversal/     # Payment reversal module
│   │       ├── receipt/             # Payment receipt generation
│   │       ├── reports/             # Financial & summary reports
│   │       ├── scholarships/        # Scholarship & allocation module
│   │       ├── section/             # Section management module
│   │       ├── studentFee/          # Student Fee collection & tracking
│   │       ├── students/            # Student management module
│   │       └── users/               # User account management module
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example environment variables template
│   └── package.json                 # Project dependencies & npm scripts
└── README.md
```

---

## ⚙️ Environment Variables Configuration

Create a `.env` file inside the `backend/` directory based on the following template:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/student-management

# JWT Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# eSewa Payment Gateway Integration
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_STATUS_URL=https://rc.esewa.com.np/api/epay/transaction/status/
ESEWA_PAYMENT_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_SUCCESS_URL=http://localhost:5000/api/payments/esewa/success
ESEWA_FAILURE_URL=http://localhost:5000/api/payments/esewa/failure
```

---

## 🚦 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Running locally or MongoDB Atlas connection string)

### 2. Installation
Clone the repository and install the backend dependencies:

```bash
cd backend
npm install
```

### 3. Running the Server
Start the development server with live reload:

```bash
npm run dev
```

The API will start running at: `http://localhost:5000/api/v1`

---

## 📡 API Endpoints Cheat Sheet

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/api/v1/health` | API Health Check |
| **Auth** | `POST` | `/api/v1/auth/login` | User Login & Cookie Token |
| **Auth** | `POST` | `/api/v1/auth/refresh-token` | Refresh Access Token |
| **Users** | `POST` | `/api/v1/users` | Create User Account |
| **Students** | `POST` | `/api/v1/students` | Register New Student |
| **Students** | `GET` | `/api/v1/students` | List & Filter Students |
| **Classes** | `POST` | `/api/v1/classes` | Create Class |
| **Sections** | `POST` | `/api/v1/sections` | Create Section |
| **Academic Years** | `POST` | `/api/v1/academic-years` | Create Academic Year |
| **Fee Structure** | `POST` | `/api/v1/fee-structures` | Define Fee Structure |
| **Student Fees** | `POST` | `/api/v1/student-fees` | Generate Student Fee Bill |
| **Discounts** | `POST` | `/api/v1/discounts` | Award Discount to Student |
| **Scholarships** | `POST` | `/api/v1/scholarships` | Award Scholarship |
| **Scholarships** | `POST` | `/api/v1/scholarship-allocations` | Allocate Scholarship to Fee |
| **Fine Policy** | `POST` | `/api/v1/fine-policies` | Create Fine Policy |
| **Fines** | `POST` | `/api/v1/fines/calculate` | Run Fine Engine for Overdue Bills |
| **Payments** | `POST` | `/api/v1/payments` | Process Offline Payment (Cash/Bank) |
| **Payments** | `POST` | `/api/v1/payments/esewa/initiate` | Initiate eSewa Online Payment |
| **Receipts** | `GET` | `/api/v1/receipts/:id` | Fetch Payment Receipt |
| **Reports** | `GET` | `/api/v1/reports/summary` | Fetch Financial Summary Report |

---

## 🧪 Postman Testing Workflow

### 1️⃣ Scholarship Award & Allocation Flow
1. **Award Scholarship**: `POST /api/v1/scholarships` (Pass `studentId`, `academicYearId`, `type`, `valueType`, `value`).
2. **Allocate to Bill**: `POST /api/v1/scholarship-allocations` (Pass `scholarshipId` & `studentFeeId`). *Note: Both must belong to the exact same student.*

### 2️⃣ Fine Policy & Auto-Calculation Flow
1. **Create Fine Policy**: `POST /api/v1/fine-policies` (Define `type`, `amount`, `gracePeriodDays`, `applicableFeeTypes`).
2. **Trigger Fine Engine**: `POST /api/v1/fines/calculate` (Scans past-due `studentFee` bills and recalculates fine amounts).

---

## 📄 License
This project is licensed under the **ISC License**.

