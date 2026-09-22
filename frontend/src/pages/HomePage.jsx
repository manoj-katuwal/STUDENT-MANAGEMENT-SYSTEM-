import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Download,
  ArrowRight,
  School,
  GraduationCap,
  Users,
  BarChart3,
  FileText,
  Lock,
  Zap,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Clock,
  Layers3,
  TrendingUp,
  Receipt,
  Eye,
} from "lucide-react";
import { useAuth } from "../features/auth/auth.context";

function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [activeRoleTab, setActiveRoleTab] = useState("STUDENT");

  const roles = [
    {
      id: "STUDENT",
      title: "Student Portal",
      subtitle: "Personal fee visibility & online payments",
      icon: GraduationCap,
      color: "bg-blue-600 text-white",
      badge: "Self-Service",
      features: [
        "View complete fee ledger breakdown (Gross, Discounts, Net)",
        "Instant online fee payment via eSewa gateway",
        "Download official PDF payment receipts anytime",
        "Track upcoming due dates and outstanding balances",
      ],
    },
    {
      id: "ADMIN",
      title: "Administrator",
      subtitle: "Full institution & financial management",
      icon: ShieldCheck,
      color: "bg-indigo-600 text-white",
      badge: "Full Control",
      features: [
        "Define custom Fee Structures by Class & Academic Year",
        "Manage Users, Students, Classes, and Sections",
        "Assign and customize individual student discounts",
        "Access comprehensive Audit Logs and payment reversal controls",
      ],
    },
    {
      id: "ACCOUNTANT",
      title: "Accountant Desk",
      subtitle: "Daily fee collection & counter operations",
      icon: Receipt,
      color: "bg-emerald-600 text-white",
      badge: "Counter Operations",
      features: [
        "Fast offline fee collection (Cash, Cheque, Bank Transfer)",
        "Instant receipt generation and printing",
        "Track daily and monthly collection balances",
        "Export fee ledgers and reports to Excel / CSV",
      ],
    },
    {
      id: "PRINCIPAL",
      title: "Principal & Management",
      subtitle: "Executive financial overview & reporting",
      icon: BarChart3,
      color: "bg-amber-600 text-white",
      badge: "Executive Analytics",
      features: [
        "Real-time financial health and revenue analytics",
        "View academic year collection comparisons",
        "Monitor student fee dues without modifying financial records",
        "Export administrative reports for board review",
      ],
    },
  ];

  const faqs = [
    {
      q: "How does online fee payment work for students?",
      a: "Students can log in to their student portal, navigate to 'My Fees', and click 'Pay with eSewa'. They can pay the full amount or a partial installment. Upon payment confirmation, the fee ledger updates in real-time and an official PDF receipt is automatically generated.",
    },
    {
      q: "Can the school record cash and bank payments?",
      a: "Yes! Accountants and administrators can record offline payments via Cash, Cheque, or Direct Bank Transfer with custom reference IDs, payment notes, and instant receipt generation.",
    },
    {
      q: "How does Role-Based Access Control (RBAC) protect financial data?",
      a: "The system enforces strict multi-tier permissions. Students can only see their own ledgers, Accountants handle payment collections, Principals get executive read-only analytics, and Admins configure academic and fee policies.",
    },
    {
      q: "Can fee ledgers and reports be exported?",
      a: "Yes, reports including daily collections, monthly revenue, pending dues, and full student rosters can be exported as structured CSV files at any time.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body antialiased flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base shadow-md">
              SFM
            </div>
            <div>
              <span className="font-poppins font-bold text-slate-900 tracking-tight text-lg sm:text-xl block leading-tight">
                Fee Ledger
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase block -mt-0.5">
                School Management System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#features"
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a href="#roles" className="hover:text-blue-600 transition-colors">
              Portals & Roles
            </a>
            <a
              href="#how-it-works"
              className="hover:text-blue-600 transition-colors"
            >
              Workflow
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all"
              >
                <span>Dashboard ({user?.role})</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all"
                >
                  <span>Student Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Glow gradients in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-2xs backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Smart Institutional Fee Ledger with eSewa Integration</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-poppins text-slate-900 tracking-tight leading-[1.15]">
              Intelligent, Transparent & Hassle-Free{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                Student Fee Management
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Empower your school administration with automated fee structures,
              real-time ledger reconciliations, instant eSewa online payments,
              and role-based access for Admins, Accountants, Principals, and
              Students.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl transition-all"
              >
                <span>
                  {isAuthenticated ? "Go to My Dashboard" : "Access Fee Portal"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-blue-600 transition-all"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Register as Student</span>
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>100% Accurate Reconciliations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Instant eSewa Online Pay</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Downloadable PDF Receipts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Granular RBAC Security</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Visual / Dashboard Preview Card */}
          <div className="mt-14 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xl">
            <div className="rounded-xl bg-slate-900 text-white p-4 sm:p-6 shadow-inner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold font-poppins">
                      Institutional Financial Overview
                    </h3>
                    <p className="text-xs text-slate-400">
                      Academic Year 2081/82 • Live Ledger Tracking
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    eSewa Gateway Active
                  </span>
                </div>
              </div>

              {/* Sample Metrics inside card */}
              <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/60">
                  <p className="text-xs text-slate-400 font-medium">
                    Total Fees Assigned
                  </p>
                  <p className="text-xl sm:text-2xl font-bold font-poppins text-white mt-1">
                    रू 4,850,000
                  </p>
                  <span className="text-[11px] text-blue-400 font-medium mt-1 block">
                    All Classes Enrolled
                  </span>
                </div>
                <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/60">
                  <p className="text-xs text-slate-400 font-medium">
                    Collected Revenue
                  </p>
                  <p className="text-xl sm:text-2xl font-bold font-poppins text-emerald-400 mt-1">
                    रू 3,920,000
                  </p>
                  <span className="text-[11px] text-emerald-400/80 font-medium mt-1 block">
                    80.8% Collection Rate
                  </span>
                </div>
                <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/60">
                  <p className="text-xs text-slate-400 font-medium">
                    Pending Dues
                  </p>
                  <p className="text-xl sm:text-2xl font-bold font-poppins text-amber-400 mt-1">
                    रू 930,000
                  </p>
                  <span className="text-[11px] text-amber-400/80 font-medium mt-1 block">
                    120 Students with dues
                  </span>
                </div>
                <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/60">
                  <p className="text-xs text-slate-400 font-medium">
                    Auto PDF Receipts
                  </p>
                  <p className="text-xl sm:text-2xl font-bold font-poppins text-indigo-300 mt-1">
                    1,420 Issued
                  </p>
                  <span className="text-[11px] text-indigo-400 font-medium mt-1 block">
                    Instant Verifiable PDF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Grid */}
      <section
        id="features"
        className="py-16 sm:py-24 bg-white border-t border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 font-poppins">
              Built for Modern Education
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold font-poppins text-slate-900 tracking-tight">
              Everything You Need to Run Fee Operations
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              A comprehensive platform addressing the entire lifecycle of
              educational billing, accounting, and student disbursements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-200 hover:bg-white hover:shadow-lg hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-5">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">
                eSewa Online Payments
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Direct integration with Nepal's premier digital wallet eSewa.
                Students can settle dues securely with automatic ledger
                reconciliations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-200 hover:bg-white hover:shadow-lg hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-5">
                <Layers3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">
                Dynamic Fee Structures
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Configure tuition, lab, library, sports, and exam fees by Class
                and Academic Year. Assign bulk fees or individual customizations
                effortlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-200 hover:bg-white hover:shadow-lg hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mb-5">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">
                Automated PDF Receipts
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Generate tamper-evident, sequential institutional receipts with
                official school header, breakdown items, and instant PDF
                download.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-200 hover:bg-white hover:shadow-lg hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-5">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">
                Live Executive Reports
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Track today's collections, monthly trends, payment method
                distributions, overdue debts, and academic year summaries.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-200 hover:bg-white hover:shadow-lg hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">
                Audit Logs & Security
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Full accountability with immutable audit logs for every payment,
                cancellation, discount assignment, and payment reversal.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-200 hover:bg-white hover:shadow-lg hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700 mb-5">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">
                Role-Based Architecture
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tailored experiences for Admin, Principal, Accountant, and
                Student roles, ensuring data security and zero unauthorized
                modifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Roles & Portals Showcase */}
      <section id="roles" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 font-poppins">
              Role-Based Portals
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold font-poppins text-slate-900 tracking-tight">
              A Tailored Experience for Every Stakeholder
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Choose a role below to explore its specific capabilities and
              workflows.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-xl bg-white p-1.5 border border-slate-200 shadow-xs gap-1">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setActiveRoleTab(r.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    activeRoleTab === r.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{r.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Role Detail Card */}
          {(() => {
            const role = roles.find((r) => r.id === activeRoleTab);
            const Icon = role.icon;
            return (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-lg max-w-4xl mx-auto animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${role.color} shadow-md`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 mb-1">
                        {role.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-poppins text-slate-900">
                        {role.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {role.subtitle}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
                  >
                    <span>Sign In to {role.title}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="mt-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Key Features & Permissions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {role.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100"
                      >
                        <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 5. How It Works / Workflow */}
      <section
        id="how-it-works"
        className="py-16 sm:py-24 bg-white border-t border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 font-poppins">
              Simple 3-Step Workflow
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold font-poppins text-slate-900 tracking-tight">
              Effortless Setup & Daily Operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative rounded-2xl bg-slate-50 border border-slate-200/80 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-md mb-4">
                1
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">
                Setup Academic Structures
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Admin creates academic years, classes, sections, and defines
                standard fee structures with custom discount policies.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl bg-slate-50 border border-slate-200/80 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-md mb-4">
                2
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">
                Assign & Collect Fees
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Fee ledgers are automatically created. Students can pay online
                via eSewa or visit the counter for cash/cheque settlement.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl bg-slate-50 border border-slate-200/80 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold text-lg shadow-md mb-4">
                3
              </div>
              <h3 className="text-lg font-bold font-poppins text-slate-900">
                Instant Receipts & Analytics
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Receipts are generated immediately in PDF format, and management
                dashboards update real-time revenue analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section
        id="faq"
        className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 font-poppins">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-3xl font-extrabold font-poppins text-slate-900 tracking-tight">
              Got Questions? We Have Answers
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
              >
                <h3 className="text-base font-semibold font-poppins text-slate-900 flex items-start gap-2.5">
                  <HelpCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 pl-7 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-poppins tracking-tight">
            Ready to Modernize Your Fee Ledger?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Experience automated billing, instant receipt generation, and
            seamless digital fee payments today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-blue-700 shadow-lg hover:bg-blue-50 transition-all"
            >
              <span>
                {isAuthenticated ? "Open Dashboard" : "Sign In to Portal"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500/30 border border-white/20 px-7 py-3.5 text-sm font-semibold text-white hover:bg-blue-500/40 transition-all"
            >
              <span>Student Registration</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm">
                  SFM
                </div>
                <span className="font-poppins font-bold text-white text-lg">
                  Fee Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart, secure, and transparent fee management and digital
                payment ecosystem for schools and universities.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-poppins">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#roles"
                    className="hover:text-white transition-colors"
                  >
                    Portals & Roles
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    Workflow
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* User Portals */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-poppins">
                User Portals
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Student Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Staff & Admin Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors"
                  >
                    Student Registration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Security & Gateway */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-poppins">
                Payment Gateways
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Securely powered by eSewa digital payment gateway &
                cryptographic signatures.
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 text-[11px] font-semibold text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>eSewa Verified Partner</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              &copy; {new Date().getFullYear()} Student Fee Management System.
              All rights reserved.
            </p>
            <p>Designed with security, precision, and performance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
