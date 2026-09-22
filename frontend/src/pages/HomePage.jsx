import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  GraduationCap,
  ShieldCheck,
  Receipt,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../features/auth/auth.context";

/*
  Fonts used below: Newsreader (serif — headlines & the ledger numerals),
  IBM Plex Sans (body/UI), IBM Plex Mono (entry numbers & currency figures).
  Add this to index.html <head> once:

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  >
*/

const serif = "font-['Newsreader',Georgia,serif]";
const sans = "font-['IBM_Plex_Sans',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['IBM_Plex_Mono',ui-monospace,SFMono-Regular,monospace]";

// Palette (kept as literal values throughout via Tailwind's arbitrary syntax
// so this file is a drop-in replacement with no tailwind.config changes)
//   ink        #17233C  primary text / lines
//   ink-soft   #55618A  secondary text
//   paper      #F6F3EA  page background
//   paper-deep #EEE8D8  recessed panels
//   line       #DAD2BC  hairline rules / borders
//   brass      #93702F  accents, entry numbers
//   green      #2F5D4B  paid / collected
//   rust       #8B3A2B  due / overdue

function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [activeRoleTab, setActiveRoleTab] = useState("STUDENT");

  const roles = [
    {
      id: "STUDENT",
      title: "Student",
      subtitle: "Personal ledger & online payment",
      icon: GraduationCap,
      features: [
        "Full fee breakdown — gross, discounts, scholarships, net",
        "Pay outstanding balances instantly through eSewa",
        "Download a signed PDF receipt after every payment",
        "See the next due date before a fine is charged",
      ],
    },
    {
      id: "ADMIN",
      title: "Administrator",
      subtitle: "Institution & fee-policy control",
      icon: ShieldCheck,
      features: [
        "Set fee structures per class and academic year",
        "Manage students, classes, sections, and staff accounts",
        "Approve individual discounts and scholarship awards",
        "Read the audit log behind every entry in the ledger",
      ],
    },
    {
      id: "ACCOUNTANT",
      title: "Accountant",
      subtitle: "Counter collection & receipting",
      icon: Receipt,
      features: [
        "Record cash, cheque, or bank-transfer payments on the spot",
        "Print a receipt the moment a payment is entered",
        "Watch the day's till against the ledger in real time",
        "Export any collection period to Excel",
      ],
    },
    {
      id: "PRINCIPAL",
      title: "Principal",
      subtitle: "Read-only financial oversight",
      icon: BarChart3,
      features: [
        "Compare collection across academic years at a glance",
        "See which classes are carrying outstanding dues",
        "Review reports without the power to alter a single entry",
        "Pull board-ready exports on demand",
      ],
    },
  ];

  const ledgerFeatures = [
    {
      no: "01",
      title: "One fee structure per class",
      body: "Tuition, lab, library, sports, and exam fees are set once per class and academic year, then applied automatically to every student in it.",
    },
    {
      no: "02",
      title: "eSewa, built in",
      body: "Students settle a balance in full or in part from their own portal. The ledger reconciles the moment eSewa confirms payment.",
    },
    {
      no: "03",
      title: "Receipts that don't need reprinting",
      body: "Every payment — online or at the counter — produces a numbered PDF receipt immediately, ready to download or print.",
    },
    {
      no: "04",
      title: "Discounts and scholarships, kept separate",
      body: "A sibling discount and a merit scholarship are recorded as distinct entries against the same fee, so nothing is ever double-counted.",
    },
    {
      no: "05",
      title: "Fines that respect a grace period",
      body: "Late fees accrue daily against a configurable policy and cap — never silently, and never past the limit a school has set.",
    },
    {
      no: "06",
      title: "An audit trail on everything",
      body: "Every reversal, discount, and adjustment is logged against the fee it touched, so a question about any entry has an answer.",
    },
  ];

  const faqs = [
    {
      q: "How does a student pay online?",
      a: "From the student portal, under \u201cMy Fees,\u201d they choose full or partial payment and confirm through eSewa. The ledger updates as soon as the gateway confirms, and a receipt is issued automatically.",
    },
    {
      q: "Can the school still take cash at the counter?",
      a: "Yes. Accountants record cash, cheque, or bank-transfer payments directly against a student's ledger, with a reference note and an instant printed receipt.",
    },
    {
      q: "What stops one role from seeing another's data?",
      a: "Access is enforced by role at the server, not just hidden in the interface. A student can only open their own ledger; a principal can read every ledger but change none of them.",
    },
    {
      q: "Can I get the numbers out for a board meeting?",
      a: "Collection reports, pending dues, and full student rosters export to Excel from the reports screen, filtered by class, date range, or academic year.",
    },
  ];

  const activeRole = roles.find((r) => r.id === activeRoleTab);

  return (
    <div
      className={`min-h-screen bg-[#F6F3EA] text-[#17233C] ${sans} antialiased`}
    >
      {/* 1. Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#DAD2BC] bg-[#F6F3EA]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-sm bg-[#17233C] text-[#F6F3EA] text-sm ${serif}`}
            >
              रू
            </div>
            <span
              className={`${serif} font-medium text-[#17233C] text-lg tracking-tight`}
            >
              Fee Ledger
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm text-[#55618A]">
            <a
              href="#features"
              className="hover:text-[#17233C] transition-colors"
            >
              Features
            </a>
            <a href="#roles" className="hover:text-[#17233C] transition-colors">
              Roles
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[#17233C] transition-colors"
            >
              How it works
            </a>
            <a href="#faq" className="hover:text-[#17233C] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-sm bg-[#17233C] px-4 py-2 text-sm font-medium text-[#F6F3EA] hover:bg-[#232F4B] transition-colors"
              >
                Dashboard &middot; {user?.role}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-sm px-3 py-2 text-sm text-[#55618A] hover:text-[#17233C] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-[#17233C] px-4 py-2 text-sm font-medium text-[#F6F3EA] hover:bg-[#232F4B] transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-10 items-center">
          {/* Copy */}
          <div>
            <h1
              className={`${serif} text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.12] text-[#17233C]`}
            >
              Every fee recorded.
              <br />
              Every rupee receipted.
            </h1>
            <p className="mt-6 text-base sm:text-[1.05rem] text-[#55618A] leading-relaxed max-w-md">
              A single ledger for tuition, fines, discounts, and scholarships
              &mdash; with eSewa payments, instant receipts, and a plain audit
              trail behind every entry.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center gap-1.5 rounded-sm bg-[#17233C] px-6 py-3 text-sm font-medium text-[#F6F3EA] hover:bg-[#232F4B] transition-colors"
              >
                {isAuthenticated ? "Open my dashboard" : "Open the ledger"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-[#17233C]/25 px-6 py-3 text-sm font-medium text-[#17233C] hover:border-[#17233C]/60 transition-colors"
              >
                Register a student
              </Link>
            </div>

            <div className="mt-11 pt-6 border-t border-[#DAD2BC] flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <p className={`${mono} text-sm text-[#93702F]`}>eSewa</p>
                <p className="text-xs text-[#55618A] mt-0.5">
                  integrated gateway
                </p>
              </div>
              <div>
                <p className={`${mono} text-sm text-[#93702F]`}>4 roles</p>
                <p className="text-xs text-[#55618A] mt-0.5">
                  admin, accountant, principal, student
                </p>
              </div>
              <div>
                <p className={`${mono} text-sm text-[#93702F]`}>every entry</p>
                <p className="text-xs text-[#55618A] mt-0.5">
                  logged to an audit trail
                </p>
              </div>
            </div>
          </div>

          {/* Ledger visual */}
          <div className="relative">
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 h-16 w-16 rounded-full border-2 border-[#8B3A2B]/70 flex items-center justify-center rotate-[-12deg] bg-[#F6F3EA]">
              <span
                className={`${mono} text-[10px] tracking-wide text-[#8B3A2B] text-center leading-tight`}
              >
                VERIFIED
                <br />
                ESEWA
              </span>
            </div>

            <div className="rounded-sm border border-[#DAD2BC] bg-white shadow-[0_1px_0_#DAD2BC] rotate-[-0.4deg]">
              <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-[#DAD2BC]">
                <p className={`${serif} text-lg text-[#17233C]`}>
                  Fee Register
                </p>
                <p className="text-xs text-[#55618A] mt-0.5">
                  Academic year 2081/82
                </p>
              </div>

              <div
                className={`grid grid-cols-[2.2rem_1fr_3.2rem_4.2rem] gap-2 px-5 sm:px-6 py-2 text-[11px] text-[#55618A] border-b border-[#DAD2BC] ${mono}`}
              >
                <span>No.</span>
                <span>Student</span>
                <span>Status</span>
                <span className="text-right">Amount</span>
              </div>

              {[
                {
                  no: "014",
                  name: "Anjali Rai",
                  status: "Paid",
                  color: "#2F5D4B",
                  amount: "12,000",
                },
                {
                  no: "015",
                  name: "Bikash Thapa",
                  status: "Due",
                  color: "#8B3A2B",
                  amount: "8,500",
                },
                {
                  no: "016",
                  name: "Sunita Gurung",
                  status: "Paid",
                  color: "#2F5D4B",
                  amount: "12,000",
                },
                {
                  no: "017",
                  name: "Prakash K.C.",
                  status: "Partial",
                  color: "#93702F",
                  amount: "6,000",
                },
              ].map((row) => (
                <div
                  key={row.no}
                  className="grid grid-cols-[2.2rem_1fr_3.2rem_4.2rem] gap-2 px-5 sm:px-6 py-3 text-sm border-b border-[#EFEADC] last:border-b-0"
                >
                  <span className={`${mono} text-xs text-[#93702F]`}>
                    {row.no}
                  </span>
                  <span className="text-[#17233C] truncate">{row.name}</span>
                  <span className="text-xs" style={{ color: row.color }}>
                    {row.status}
                  </span>
                  <span className={`${mono} text-right text-xs text-[#17233C]`}>
                    {row.amount}
                  </span>
                </div>
              ))}

              <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-[#EFEADC]/60">
                <span className="text-xs text-[#55618A]">
                  Collected this month
                </span>
                <span className={`${mono} text-sm text-[#2F5D4B]`}>
                  &#2352;&#2370; 39,20,000
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features — ledger index */}
      <section id="features" className="border-t border-[#DAD2BC] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="max-w-xl mb-12">
            <h2 className={`${serif} text-2xl sm:text-3xl text-[#17233C]`}>
              What the ledger keeps track of
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#55618A]">
              Six things a school's fee ledger has to get right, in the order a
              new admin usually asks about them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {ledgerFeatures.map((f) => (
              <div key={f.no} className="pt-6 border-t border-[#DAD2BC]">
                <span className={`${mono} text-xs text-[#93702F]`}>
                  No. {f.no}
                </span>
                <h3 className={`${serif} text-lg text-[#17233C] mt-2`}>
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-[#55618A] leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Roles — registrar index */}
      <section id="roles" className="border-t border-[#DAD2BC]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="max-w-xl mb-10">
            <h2 className={`${serif} text-2xl sm:text-3xl text-[#17233C]`}>
              Four registers, one ledger
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#55618A]">
              Everyone touches the same ledger, but only sees the part of it
              their role is meant to see.
            </p>
          </div>

          {/* Tabs styled as index-card tabs */}
          <div className="flex flex-wrap gap-1">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRoleTab(r.id)}
                className={`rounded-t-sm px-4 py-2.5 text-sm border-x border-t transition-colors ${
                  activeRoleTab === r.id
                    ? "bg-white border-[#DAD2BC] text-[#17233C] font-medium"
                    : "bg-[#EFEADC]/60 border-transparent text-[#55618A] hover:text-[#17233C]"
                }`}
              >
                {r.title}
              </button>
            ))}
          </div>

          <div className="rounded-sm rounded-tl-none border border-[#DAD2BC] bg-white p-6 sm:p-9">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DAD2BC]">
              <div className="flex items-center gap-3.5">
                <activeRole.icon
                  className="h-6 w-6 text-[#93702F]"
                  strokeWidth={1.75}
                />
                <div>
                  <h3 className={`${serif} text-xl text-[#17233C]`}>
                    {activeRole.title}
                  </h3>
                  <p className="text-sm text-[#55618A]">
                    {activeRole.subtitle}
                  </p>
                </div>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#17233C] hover:text-[#93702F] transition-colors"
              >
                Sign in as {activeRole.title}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 mt-6">
              {activeRole.features.map((feat, idx) => (
                <div key={idx} className="flex items-baseline gap-2.5">
                  <span className="text-[#93702F] text-sm leading-none">
                    &mdash;
                  </span>
                  <span className="text-sm text-[#17233C]/85 leading-snug">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. How it works */}
      <section id="how-it-works" className="border-t border-[#DAD2BC] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="max-w-xl mb-14">
            <h2 className={`${serif} text-2xl sm:text-3xl text-[#17233C]`}>
              Three entries to get started
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
            {[
              {
                n: "1",
                title: "Set the structure",
                body: "Define academic years, classes, sections, and the fee structure each class carries.",
              },
              {
                n: "2",
                title: "Assign and collect",
                body: "Ledgers generate automatically. Students pay through eSewa, or the counter takes cash and cheque.",
              },
              {
                n: "3",
                title: "Receipt and report",
                body: "Every payment issues a receipt on the spot, and the dashboard reflects it immediately.",
              },
            ].map((step, idx) => (
              <div
                key={step.n}
                className={`md:px-8 ${idx > 0 ? "md:border-l md:border-[#DAD2BC]" : ""} ${idx === 0 ? "md:pl-0" : ""}`}
              >
                <div
                  className={`h-9 w-9 rounded-full border border-[#17233C] flex items-center justify-center ${serif} text-[#17233C] text-sm`}
                >
                  {step.n}
                </div>
                <h3 className={`${serif} text-lg text-[#17233C] mt-4`}>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[#55618A] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="border-t border-[#DAD2BC]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <h2 className={`${serif} text-2xl sm:text-3xl text-[#17233C] mb-10`}>
            Questions from the front office
          </h2>

          <div>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="py-6 border-t border-[#DAD2BC] first:border-t-0"
              >
                <h3 className={`${serif} text-lg text-[#17233C] flex gap-3`}>
                  <span className={`${mono} text-sm text-[#93702F] pt-0.5`}>
                    Q{idx + 1}
                  </span>
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-2.5 text-sm text-[#55618A] leading-relaxed pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Closing */}
      <section className="bg-[#17233C]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
          <div className="h-px w-10 bg-[#93702F] mx-auto mb-6" />
          <h2 className={`${serif} text-2xl sm:text-3xl text-[#F6F3EA]`}>
            Open the ledger for your school
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#F6F3EA]/65 max-w-md mx-auto">
            Set up the fee structure once. Let payments, receipts, and reports
            take care of themselves after that.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="mt-8 inline-flex items-center gap-1.5 rounded-sm bg-[#F6F3EA] px-6 py-3 text-sm font-medium text-[#17233C] hover:bg-white transition-colors"
          >
            {isAuthenticated ? "Open my dashboard" : "Sign in to the portal"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-[#17233C] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-8 border-b border-white/10">
            <div>
              <span className={`${serif} text-lg text-[#F6F3EA]`}>
                Fee Ledger
              </span>
              <p className="mt-3 text-xs text-[#F6F3EA]/55 leading-relaxed max-w-[22ch]">
                A fee ledger and payment record for schools, built around eSewa
                and a full audit trail.
              </p>
            </div>

            <div>
              <h4 className="text-xs text-[#F6F3EA]/40 mb-3">On this page</h4>
              <ul className="space-y-2 text-sm text-[#F6F3EA]/70">
                <li>
                  <a
                    href="#features"
                    className="hover:text-[#F6F3EA] transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#roles"
                    className="hover:text-[#F6F3EA] transition-colors"
                  >
                    Roles
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-[#F6F3EA] transition-colors"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="hover:text-[#F6F3EA] transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs text-[#F6F3EA]/40 mb-3">Portals</h4>
              <ul className="space-y-2 text-sm text-[#F6F3EA]/70">
                <li>
                  <Link
                    to="/login"
                    className="hover:text-[#F6F3EA] transition-colors"
                  >
                    Student login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-[#F6F3EA] transition-colors"
                  >
                    Staff & admin login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-[#F6F3EA] transition-colors"
                  >
                    Student registration
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs text-[#F6F3EA]/40 mb-3">Payments</h4>
              <div className="flex items-center gap-2 text-sm text-[#F6F3EA]/70">
                <ShieldCheck
                  className="h-4 w-4 text-[#93702F]"
                  strokeWidth={1.75}
                />
                <span>eSewa verified merchant</span>
              </div>
            </div>
          </div>

          <div
            className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F6F3EA]/45 ${mono}`}
          >
            <p>&copy; {new Date().getFullYear()} Fee Ledger</p>
            <p>Every entry logged. Every rupee accounted for.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
