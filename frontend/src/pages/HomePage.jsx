import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  GraduationCap,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../features/auth/auth.context";

const serif = "font-['Newsreader',Georgia,serif]";
const sans = "font-['IBM_Plex_Sans',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['IBM_Plex_Mono',ui-monospace,SFMono-Regular,monospace]";

const roles = [
  {
    id: "STUDENT",
    title: "Student",
    subtitle: "Personal ledger & online payment",
    icon: GraduationCap,
    accent: "text-[#2F5D4B]",
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
    accent: "text-[#93702F]",
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
    accent: "text-[#93702F]",
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
    accent: "text-[#93702F]",
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

const steps = [
  {
    n: "01",
    title: "Set the structure",
    body: "Define academic years, classes, sections, and the fee structure each class carries.",
  },
  {
    n: "02",
    title: "Assign and collect",
    body: "Ledgers generate automatically. Students pay through eSewa, or the counter takes cash and cheque.",
  },
  {
    n: "03",
    title: "Receipt and report",
    body: "Every payment issues a receipt on the spot, and the dashboard reflects it immediately.",
  },
];

const faqs = [
  {
    q: "How does a student pay online?",
    a: "From the student portal, under “My Fees,” they choose full or partial payment and confirm through eSewa. The ledger updates as soon as the gateway confirms, and a receipt is issued automatically.",
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

const ledgerRows = [
  {
    no: "014",
    name: "Anjali Rai",
    status: "Paid",
    statusClass: "text-[#2F5D4B] bg-[#2F5D4B]/10",
    amount: "12,000",
  },
  {
    no: "015",
    name: "Bikash Thapa",
    status: "Due",
    statusClass: "text-[#8B3A2B] bg-[#8B3A2B]/10",
    amount: "8,500",
  },
  {
    no: "016",
    name: "Sunita Gurung",
    status: "Paid",
    statusClass: "text-[#2F5D4B] bg-[#2F5D4B]/10",
    amount: "12,000",
  },
  {
    no: "017",
    name: "Prakash K.C.",
    status: "Partial",
    statusClass: "text-[#93702F] bg-[#93702F]/10",
    amount: "6,000",
  },
];

function SectionIntro({ eyebrow, title, body }) {
  return (
    <div className="max-w-2xl">
      <p
        className={`${mono} text-[11px] font-medium uppercase tracking-[0.18em] text-[#93702F]`}
      >
        {eyebrow}
      </p>
      <h2
        className={`${serif} mt-3 text-3xl leading-tight tracking-[-0.02em] text-[#17233C] sm:text-4xl`}
      >
        {title}
      </h2>
      {body && (
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#55618A] sm:text-base">
          {body}
        </p>
      )}
    </div>
  );
}

function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [activeRoleTab, setActiveRoleTab] = useState("STUDENT");
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeRole = roles.find((r) => r.id === activeRoleTab) ?? roles[0];
  const ActiveRoleIcon = activeRole.icon;

  const navItems = [
    ["Features", "#features"],
    ["Roles", "#roles"],
    ["How it works", "#how-it-works"],
    ["FAQ", "#faq"],
  ];

  return (
    <div
      className={`min-h-screen overflow-x-hidden bg-[#F7F8FC] text-[#17233C] ${sans} antialiased selection:bg-[#17233C] selection:text-white`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-[#17233C] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#E6E9F0] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            to="/"
            aria-label="Fee Ledger home"
            className="group flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17233C] text-sm text-white shadow-[0_6px_18px_rgba(23,35,60,0.16)] transition-transform duration-200 group-hover:-translate-y-0.5">
              <span className={serif}>रू</span>
            </span>
            <span>
              <span
                className={`${serif} block text-[1.15rem] font-semibold leading-none tracking-[-0.02em] text-[#17233C]`}
              >
                Fee Ledger
              </span>
              <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8991A5] sm:block">
                School finance platform
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#68718A] transition-colors hover:bg-[#F3F5F9] hover:text-[#17233C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93702F]/40"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#17233C] px-4 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(23,35,60,0.14)] transition-all hover:-translate-y-0.5 hover:bg-[#263452] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93702F]"
              >
                Dashboard
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/70">
                  {user?.role}
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex min-h-10 items-center rounded-xl px-3.5 text-[13px] font-semibold text-[#68718A] transition-colors hover:bg-[#F3F5F9] hover:text-[#17233C]"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#17233C] px-4 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(23,35,60,0.14)] transition-all hover:-translate-y-0.5 hover:bg-[#263452]"
                >
                  Get started
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E1E5ED] text-[#17233C] sm:hidden"
          >
            {mobileNavOpen ? (
              <span className="text-lg">×</span>
            ) : (
              <span className="text-lg">☰</span>
            )}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-[#E6E9F0] bg-white px-5 py-4 sm:hidden">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navItems.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[#68718A] hover:bg-[#F5F6F9] hover:text-[#17233C]"
                >
                  {label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#E6E9F0] pt-3">
                <Link
                  to="/login"
                  className="rounded-xl border border-[#DCE1EA] py-3 text-center text-sm font-semibold text-[#17233C]"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-[#17233C] py-3 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#E6E9F0] bg-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#E9EEF8] blur-3xl" />
            <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#F6EFE0] blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#93702F]/35 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:px-10 lg:pb-32 lg:pt-24">
            <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE2EC] bg-[#F8F9FC] px-3 py-1.5 text-[11px] font-semibold text-[#5F6981] shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2F5D4B] shadow-[0_0_0_4px_rgba(47,93,75,0.10)]" />
                  Built for modern school finance teams
                </div>

                <h1
                  className={`${serif} mt-7 max-w-2xl text-[3.15rem] font-medium leading-[0.98] tracking-[-0.045em] text-[#17233C] sm:text-6xl lg:text-[4.65rem]`}
                >
                  School fees,
                  <br />
                  <span className="text-[#68718A]">without the chaos.</span>
                </h1>

                <p className="mt-7 max-w-xl text-[15px] leading-7 text-[#68718A] sm:text-[17px] sm:leading-8">
                  A single source of truth for tuition, discounts, scholarships,
                  payments, receipts, and outstanding balances — with a clear
                  audit trail behind every rupee.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#17233C] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(23,35,60,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#263452] hover:shadow-[0_16px_32px_rgba(23,35,60,0.20)]"
                  >
                    {isAuthenticated ? "Open my dashboard" : "Open the ledger"}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D9DEE8] bg-white px-6 text-sm font-semibold text-[#17233C] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#BFC7D6] hover:bg-[#FAFBFC]"
                  >
                    Register a student
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-medium text-[#7B8499]">
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#2F5D4B]" /> eSewa
                    integrated
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#2F5D4B]" /> Role-based
                    access
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#2F5D4B]" /> Audit-ready
                    records
                  </span>
                </div>
              </div>

              {/* Product preview */}
              <div className="relative mx-auto w-full max-w-2xl">
                <div className="absolute -inset-6 rounded-[2rem] bg-[#DCE5F4]/70 blur-3xl" />
                <div className="relative overflow-hidden rounded-[1.35rem] border border-[#DCE1EA] bg-white shadow-[0_28px_90px_rgba(23,35,60,0.15)]">
                  <div className="flex items-center justify-between border-b border-[#E9ECF1] px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F1F3F8]">
                        <BarChart3 className="h-4 w-4 text-[#17233C]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#17233C]">
                          Fee Register
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#8991A5]">
                          Academic year 2081/82
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF7F1] px-2.5 py-1 text-[10px] font-semibold text-[#2F5D4B]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2F5D4B]" />{" "}
                      Live
                    </span>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-[#EEF0F4] bg-[#FAFBFC] px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:px-6">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8991A5]">
                        Collected
                      </p>
                      <p
                        className={`${mono} mt-1 text-lg font-semibold text-[#17233C]`}
                      >
                        रू 39,20,000
                      </p>
                    </div>
                    <div className="hidden border-l border-[#E5E8EF] pl-5 sm:block">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8991A5]">
                        Students
                      </p>
                      <p
                        className={`${mono} mt-1 text-lg font-semibold text-[#17233C]`}
                      >
                        248
                      </p>
                    </div>
                    <div className="border-l border-[#E5E8EF] pl-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8991A5]">
                        Pending
                      </p>
                      <p
                        className={`${mono} mt-1 text-lg font-semibold text-[#8B3A2B]`}
                      >
                        18
                      </p>
                    </div>
                  </div>

                  <div className="hidden grid-cols-[2.5rem_1fr_auto_6rem] gap-3 border-b border-[#EEF0F4] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#9AA1B1] sm:grid sm:px-6">
                    <span>No.</span>
                    <span>Student</span>
                    <span>Status</span>
                    <span className="text-right">Amount</span>
                  </div>

                  <div>
                    {ledgerRows.map((row) => (
                      <div
                        key={row.no}
                        className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 border-b border-[#F0F2F5] px-5 py-4 last:border-b-0 sm:grid-cols-[2.5rem_1fr_auto_6rem] sm:px-6"
                      >
                        <span className={`${mono} text-[10px] text-[#9A7A3B]`}>
                          {row.no}
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold text-[#26324A]">
                            {row.name}
                          </span>
                          <span className="mt-0.5 block text-[9px] text-[#A0A7B5] sm:hidden">
                            रू {row.amount}
                          </span>
                        </div>
                        <span
                          className={`w-fit rounded-full px-2 py-1 text-[9px] font-bold ${row.statusClass}`}
                        >
                          {row.status}
                        </span>
                        <span
                          className={`${mono} hidden text-right text-[11px] font-semibold text-[#26324A] sm:block`}
                        >
                          रू {row.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between bg-[#17233C] px-5 py-4 sm:px-6">
                    <div>
                      <p className="text-[10px] font-semibold text-white/60">
                        Ledger health
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-white">
                        All entries reconciled
                      </p>
                    </div>
                    <span
                      className={`${mono} rounded-lg bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-white`}
                    >
                      100% TRACEABLE
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-[#DDE2EB] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(23,35,60,0.12)] sm:block">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EDF7F1]">
                      <ShieldCheck className="h-4 w-4 text-[#2F5D4B]" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-[#17233C]">
                        Verified payment
                      </p>
                      <p className="text-[9px] text-[#8991A5]">
                        Receipt issued automatically
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section
          id="features"
          className="border-b border-[#E6E9F0] bg-[#F7F8FC]"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <SectionIntro
              eyebrow="01 / Ledger"
              title="Everything finance teams need. Nothing they don't."
              body="A production-ready fee workflow should make every amount understandable, every adjustment traceable, and every receipt easy to find."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ledgerFeatures.map((feature) => (
                <article
                  key={feature.no}
                  className="group rounded-2xl border border-[#E1E5EC] bg-white p-6 shadow-[0_4px_18px_rgba(23,35,60,0.035)] transition-all duration-200 hover:-translate-y-1 hover:border-[#CDD4E0] hover:shadow-[0_14px_35px_rgba(23,35,60,0.08)]"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`${mono} text-[10px] font-bold text-[#A27D3A]`}
                    >
                      {feature.no}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F6FA] text-[#17233C] transition-colors group-hover:bg-[#17233C] group-hover:text-white">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <h3
                    className={`${serif} mt-7 text-[1.35rem] font-medium tracking-[-0.02em] text-[#17233C]`}
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-6 text-[#737D92]">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="border-b border-[#E6E9F0] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <SectionIntro
                eyebrow="02 / Access"
                title="One ledger. Four precise experiences."
                body="Every role gets the information and actions it needs, while permissions remain enforced at the application layer."
              />
              <div className="hidden rounded-xl border border-[#E1E5EC] bg-[#F8F9FB] px-4 py-3 lg:block">
                <p
                  className={`${mono} text-[9px] font-bold uppercase tracking-[0.14em] text-[#8A93A6]`}
                >
                  Permission model
                </p>
                <p className="mt-1 text-xs font-semibold text-[#17233C]">
                  Role-based · Server enforced
                </p>
              </div>
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-[#DDE2EA] bg-[#F8F9FB] shadow-[0_10px_40px_rgba(23,35,60,0.06)]">
              <div
                role="tablist"
                aria-label="Fee Ledger roles"
                className="grid grid-cols-2 border-b border-[#DDE2EA] bg-white sm:grid-cols-4"
              >
                {roles.map((role) => {
                  const selected = activeRoleTab === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`role-panel-${role.id}`}
                      id={`role-tab-${role.id}`}
                      onClick={() => setActiveRoleTab(role.id)}
                      className={`relative min-h-14 border-b-2 px-3 text-[12px] font-bold transition-all focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#93702F] sm:px-4 ${
                        selected
                          ? "border-[#17233C] bg-[#17233C] text-white"
                          : "border-transparent text-[#6F788D] hover:bg-[#F5F7FA] hover:text-[#17233C]"
                      }`}
                    >
                      {role.title}
                    </button>
                  );
                })}
              </div>

              <div
                role="tabpanel"
                tabIndex={0}
                id={`role-panel-${activeRole.id}`}
                aria-labelledby={`role-tab-${activeRole.id}`}
                className="p-6 outline-none sm:p-9 lg:p-10"
              >
                <div className="flex flex-col gap-6 border-b border-[#DDE2EA] pb-7 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                      <ActiveRoleIcon
                        className={`h-5 w-5 ${activeRole.accent}`}
                        strokeWidth={1.8}
                      />
                    </span>
                    <div>
                      <h3
                        className={`${serif} text-2xl font-medium text-[#17233C]`}
                      >
                        {activeRole.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-[#7A8397]">
                        {activeRole.subtitle}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex w-fit items-center gap-1.5 text-[12px] font-bold text-[#17233C] hover:text-[#93702F]"
                  >
                    Sign in as {activeRole.title}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid gap-3 pt-7 sm:grid-cols-2">
                  {activeRole.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex gap-3 rounded-xl border border-[#E2E6ED] bg-white p-4"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EDF7F1] text-[#2F5D4B]">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span className="text-[13px] leading-6 text-[#4F596F]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section
          id="how-it-works"
          className="border-b border-[#E6E9F0] bg-[#F7F8FC]"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <SectionIntro
              eyebrow="03 / Workflow"
              title="From fee structure to receipt in three steps."
              body="Keep the operational flow simple without compromising financial traceability."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.n}
                  className="relative rounded-2xl border border-[#E1E5EC] bg-white p-7 shadow-[0_4px_18px_rgba(23,35,60,0.035)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17233C] text-[11px] font-bold text-white">
                      {step.n}
                    </span>
                    {index < steps.length - 1 && (
                      <span className="hidden h-px w-10 bg-[#DCE1E9] md:block" />
                    )}
                  </div>
                  <h3
                    className={`${serif} mt-7 text-2xl font-medium text-[#17233C]`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-6 text-[#737D92]">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-b border-[#E6E9F0] bg-white">
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
            <SectionIntro
              eyebrow="04 / FAQ"
              title="Questions from the front office."
            />

            <div className="mt-10 overflow-hidden rounded-2xl border border-[#DDE2EA] bg-white shadow-[0_8px_30px_rgba(23,35,60,0.05)]">
              {faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <div
                    key={faq.q}
                    className="border-b border-[#E8EBF0] last:border-b-0"
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`faq-answer-${index}`}
                      onClick={() => setOpenFaq(open ? null : index)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors hover:bg-[#FAFBFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#93702F] sm:px-7"
                    >
                      <span className="flex items-start gap-4">
                        <span
                          className={`${mono} pt-0.5 text-[9px] font-bold text-[#A27D3A]`}
                        >
                          Q{index + 1}
                        </span>
                        <span
                          className={`${serif} text-[17px] font-medium leading-6 text-[#17233C]`}
                        >
                          {faq.q}
                        </span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#7C8598] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      id={`faq-answer-${index}`}
                      hidden={!open}
                      className="px-5 pb-6 pl-[3.45rem] pr-10 sm:px-7 sm:pl-[4.1rem]"
                    >
                      <p className="max-w-2xl text-[13px] leading-6 text-[#737D92]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#17233C]">
          <div className="relative mx-auto max-w-5xl overflow-hidden px-5 py-20 text-center sm:px-8 sm:py-24">
            <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3E4C6D] blur-3xl opacity-50" />
            <div className="relative">
              <span
                className={`${mono} inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#D7B66E]`}
              >
                Ready when you are
              </span>
              <h2
                className={`${serif} mx-auto mt-5 max-w-2xl text-4xl font-medium tracking-[-0.03em] text-white sm:text-5xl`}
              >
                Make every rupee easier to track.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
                Set up the fee structure once. Let payments, receipts, and
                reports stay synchronized from there.
              </p>
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#17233C] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-[#F7F8FC]"
              >
                {isAuthenticated
                  ? "Open my dashboard"
                  : "Sign in to the portal"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#111A2C] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className={`${serif} text-xl font-medium`}>Fee Ledger</span>
              <p className="mt-3 max-w-xs text-xs leading-5 text-white/45">
                A fee ledger and payment record for schools, built around eSewa
                and a full audit trail.
              </p>
            </div>

            <div>
              <h3 className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/30">
                Product
              </h3>
              <ul className="mt-4 space-y-2.5 text-[12px] text-white/55">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-white">
                    Roles
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/30">
                Portals
              </h3>
              <ul className="mt-4 space-y-2.5 text-[12px] text-white/55">
                <li>
                  <Link to="/login" className="hover:text-white">
                    Student login
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white">
                    Staff & admin login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white">
                    Student registration
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/30">
                Payments
              </h3>
              <div className="mt-4 flex items-center gap-2.5 text-[12px] text-white/55">
                <ShieldCheck
                  className="h-4 w-4 text-[#D7B66E]"
                  strokeWidth={1.75}
                />
                <span>eSewa verified merchant</span>
              </div>
            </div>
          </div>

          <div
            className={`mt-6 flex flex-col items-center justify-between gap-3 text-[9px] text-white/30 sm:flex-row ${mono}`}
          >
            <p>© {new Date().getFullYear()} Fee Ledger</p>
            <p>Every entry logged. Every rupee accounted for.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
