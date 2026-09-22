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

  const activeRole = roles.find((r) => r.id === activeRoleTab) ?? roles[0];
  const ActiveRoleIcon = activeRole.icon;

  return (
    <div
      className={`min-h-screen overflow-x-hidden bg-[#F6F3EA] text-[#17233C] ${sans} antialiased selection:bg-[#17233C] selection:text-[#F6F3EA]`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#17233C] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-[#DAD2BC]/80 bg-[#F6F3EA]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            to="/"
            aria-label="Fee Ledger home"
            className="group flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17233C] text-sm text-[#F6F3EA] shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
              <span className={serif}>रू</span>
            </span>
            <span
              className={`${serif} text-xl font-medium tracking-[-0.02em] text-[#17233C]`}
            >
              Fee Ledger
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 text-sm text-[#55618A] md:flex"
          >
            {[
              ["Features", "#features"],
              ["Roles", "#roles"],
              ["How it works", "#how-it-works"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="relative py-2 transition-colors hover:text-[#17233C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93702F]/50 focus-visible:ring-offset-2"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#17233C] px-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#232F4B] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93702F] focus-visible:ring-offset-2 sm:px-4"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Open</span>
                <span className="hidden text-white/60 sm:inline">·</span>
                <span className="max-w-24 truncate text-white/80">
                  {user?.role}
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden min-h-10 items-center rounded-lg px-3 text-sm font-medium text-[#55618A] transition-colors hover:text-[#17233C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93702F]/50 focus-visible:ring-offset-2 sm:inline-flex"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#17233C] px-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#232F4B] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93702F] focus-visible:ring-offset-2 sm:px-4"
                >
                  Get started <ArrowUpRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(147,112,47,0.10),transparent_30%),radial-gradient(circle_at_15%_30%,rgba(47,93,75,0.06),transparent_25%)]" />
          <div className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:px-10 lg:pb-32 lg:pt-24">
            <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DAD2BC] bg-white/60 px-3 py-1.5 text-xs font-medium text-[#55618A] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[#93702F]" />
                  School fee management, simplified
                </div>

                <h1
                  className={`${serif} max-w-3xl text-[2.75rem] leading-[1.03] tracking-[-0.035em] text-[#17233C] sm:text-6xl lg:text-[4.55rem]`}
                >
                  Every fee recorded.
                  <br />
                  <span className="text-[#55618A]">Every rupee receipted.</span>
                </h1>

                <p className="mt-7 max-w-xl text-base leading-7 text-[#55618A] sm:text-lg sm:leading-8">
                  A single ledger for tuition, fines, discounts, and
                  scholarships — with eSewa payments, instant receipts, and a
                  plain audit trail behind every entry.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#17233C] px-6 text-sm font-semibold text-white shadow-lg shadow-[#17233C]/10 transition-all hover:-translate-y-0.5 hover:bg-[#232F4B] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93702F] focus-visible:ring-offset-2"
                  >
                    {isAuthenticated ? "Open my dashboard" : "Open the ledger"}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#17233C]/15 bg-white/50 px-6 text-sm font-semibold text-[#17233C] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#17233C]/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93702F] focus-visible:ring-offset-2"
                  >
                    Register a student
                  </Link>
                </div>

                <div className="mt-10 grid max-w-xl grid-cols-3 border-y border-[#DAD2BC] py-5">
                  {[
                    ["eSewa", "integrated gateway"],
                    ["4 roles", "permission-based"],
                    ["100%", "audit visibility"],
                  ].map(([value, label], index) => (
                    <div
                      key={value}
                      className={`${index > 0 ? "border-l border-[#DAD2BC] pl-4 sm:pl-6" : ""} ${index < 2 ? "pr-4 sm:pr-6" : ""}`}
                    >
                      <p
                        className={`${mono} text-sm font-medium text-[#93702F]`}
                      >
                        {value}
                      </p>
                      <p className="mt-1 text-[11px] leading-4 text-[#55618A] sm:text-xs">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-[#93702F]/5 blur-2xl" />

                <div className="absolute -right-2 -top-5 z-10 hidden h-20 w-20 rotate-[-10deg] items-center justify-center rounded-full border-2 border-[#8B3A2B]/60 bg-[#F6F3EA] shadow-sm sm:flex">
                  <span
                    className={`${mono} text-[9px] font-medium leading-3 tracking-[0.08em] text-[#8B3A2B]`}
                  >
                    VERIFIED
                    <br />
                    ESEWA
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#DAD2BC] bg-white shadow-[0_20px_70px_rgba(23,35,60,0.10)]">
                  <div className="flex items-center justify-between border-b border-[#E8E3D5] px-5 py-5 sm:px-7">
                    <div>
                      <p className={`${serif} text-xl text-[#17233C]`}>
                        Fee Register
                      </p>
                      <p className="mt-1 text-xs text-[#55618A]">
                        Academic year 2081/82
                      </p>
                    </div>
                    <span className="rounded-full border border-[#2F5D4B]/15 bg-[#2F5D4B]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#2F5D4B]">
                      Live
                    </span>
                  </div>

                  <div
                    className={`${mono} hidden grid-cols-[2.5rem_1fr_auto_5rem] gap-3 border-b border-[#E8E3D5] px-5 py-3 text-[10px] uppercase tracking-wider text-[#7A8298] sm:grid sm:px-7`}
                  >
                    <span>No.</span>
                    <span>Student</span>
                    <span>Status</span>
                    <span className="text-right">Amount</span>
                  </div>

                  <div>
                    {ledgerRows.map((row) => (
                      <div
                        key={row.no}
                        className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-[#EFEADC] px-5 py-4 last:border-b-0 sm:grid-cols-[2.5rem_1fr_auto_5rem] sm:px-7"
                      >
                        <span className={`${mono} text-xs text-[#93702F]`}>
                          {row.no}
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-medium text-[#17233C]">
                            {row.name}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-[#7A8298] sm:hidden">
                            Amount · रू {row.amount}
                          </span>
                        </div>
                        <span
                          className={`w-fit rounded-full px-2 py-1 text-[10px] font-semibold ${row.statusClass}`}
                        >
                          {row.status}
                        </span>
                        <span
                          className={`${mono} hidden text-right text-xs font-medium text-[#17233C] sm:block`}
                        >
                          रू {row.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between bg-[#F5F1E6] px-5 py-5 sm:px-7">
                    <div>
                      <p className="text-xs font-medium text-[#55618A]">
                        Collected this month
                      </p>
                      <p className="mt-1 text-[10px] text-[#7A8298]">
                        Across all active ledgers
                      </p>
                    </div>
                    <span
                      className={`${mono} text-sm font-semibold text-[#2F5D4B]`}
                    >
                      रू 39,20,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-[#DAD2BC] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <SectionIntro
              eyebrow="01 / Ledger"
              title="The details that make a fee system trustworthy."
              body="A production-ready fee workflow needs more than a payment button. Every amount, adjustment, and receipt should remain understandable after the transaction is over."
            />

            <div className="mt-14 grid gap-x-12 gap-y-0 md:grid-cols-2">
              {ledgerFeatures.map((feature) => (
                <article
                  key={feature.no}
                  className="group border-t border-[#DAD2BC] py-7"
                >
                  <div className="flex gap-5">
                    <span
                      className={`${mono} shrink-0 pt-1 text-[11px] font-medium text-[#93702F]`}
                    >
                      {feature.no}
                    </span>
                    <div>
                      <h3
                        className={`${serif} text-xl tracking-[-0.01em] text-[#17233C]`}
                      >
                        {feature.title}
                      </h3>
                      <p className="mt-2.5 max-w-lg text-sm leading-6 text-[#55618A]">
                        {feature.body}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="roles" className="border-b border-[#DAD2BC]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <SectionIntro
              eyebrow="02 / Access"
              title="Four roles. One source of truth."
              body="Everyone works from the same ledger, while permissions determine exactly what each role can view or change."
            />

            <div className="mt-12 overflow-hidden rounded-2xl border border-[#DAD2BC] bg-white shadow-sm">
              <div
                role="tablist"
                aria-label="Fee Ledger roles"
                className="grid grid-cols-2 border-b border-[#DAD2BC] sm:grid-cols-4"
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
                      className={`relative min-h-14 border-b-2 px-4 text-sm font-semibold transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#93702F] ${
                        selected
                          ? "border-[#17233C] bg-[#17233C] text-white"
                          : "border-transparent bg-white text-[#55618A] hover:bg-[#F8F6EF] hover:text-[#17233C]"
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
                className="p-6 outline-none sm:p-9"
              >
                <div className="flex flex-col gap-6 border-b border-[#DAD2BC] pb-7 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F1E6]">
                      <ActiveRoleIcon
                        className={`h-5 w-5 ${activeRole.accent}`}
                        strokeWidth={1.8}
                      />
                    </span>
                    <div>
                      <h3 className={`${serif} text-2xl text-[#17233C]`}>
                        {activeRole.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#55618A]">
                        {activeRole.subtitle}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#17233C] transition-colors hover:text-[#93702F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93702F]/50 focus-visible:ring-offset-4"
                  >
                    Sign in as {activeRole.title}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid gap-4 pt-7 sm:grid-cols-2">
                  {activeRole.features.map((feature) => (
                    <div key={feature} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2F5D4B]/10 text-[#2F5D4B]">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm leading-6 text-[#17233C]/85">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-b border-[#DAD2BC] bg-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <SectionIntro
              eyebrow="03 / Workflow"
              title="A clear path from setup to receipt."
              body="The core workflow stays deliberately simple, so staff can move quickly without losing financial traceability."
            />

            <div className="mt-14 grid gap-0 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.n}
                  className={`relative py-7 md:px-9 md:py-2 ${
                    index > 0
                      ? "border-t border-[#DAD2BC] md:border-l md:border-t-0"
                      : ""
                  } ${index === 0 ? "md:pl-0" : ""}`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#17233C] text-sm font-medium text-[#17233C]">
                    {step.n}
                  </span>
                  <h3 className={`${serif} mt-5 text-2xl text-[#17233C]`}>
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-sm text-sm leading-6 text-[#55618A]">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-b border-[#DAD2BC]">
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
            <SectionIntro
              eyebrow="04 / FAQ"
              title="Questions from the front office."
            />

            <div className="mt-12 overflow-hidden rounded-2xl border border-[#DAD2BC] bg-white">
              {faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <div
                    key={faq.q}
                    className="border-b border-[#DAD2BC] last:border-b-0"
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`faq-answer-${index}`}
                      onClick={() => setOpenFaq(open ? null : index)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors hover:bg-[#FAF8F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#93702F] sm:px-7"
                    >
                      <span className="flex items-start gap-4">
                        <span
                          className={`${mono} pt-0.5 text-[10px] font-medium text-[#93702F]`}
                        >
                          Q{index + 1}
                        </span>
                        <span
                          className={`${serif} text-lg leading-6 text-[#17233C]`}
                        >
                          {faq.q}
                        </span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#55618A] transition-transform duration-200 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      id={`faq-answer-${index}`}
                      hidden={!open}
                      className="px-5 pb-6 pl-[3.55rem] pr-10 sm:px-7 sm:pl-[4.15rem]"
                    >
                      <p className="max-w-2xl text-sm leading-6 text-[#55618A]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#17233C]">
          <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-24">
            <div className="mx-auto h-px w-12 bg-[#93702F]" />
            <p
              className={`${mono} mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#93702F]`}
            >
              Ready when you are
            </p>
            <h2
              className={`${serif} mt-4 text-3xl tracking-[-0.02em] text-[#F6F3EA] sm:text-4xl`}
            >
              Open the ledger for your school.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#F6F3EA]/65 sm:text-base">
              Set up the fee structure once. Let payments, receipts, and reports
              take care of themselves after that.
            </p>
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#F6F3EA] px-6 text-sm font-semibold text-[#17233C] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93702F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17233C]"
            >
              {isAuthenticated ? "Open my dashboard" : "Sign in to the portal"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#17233C]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className={`${serif} text-xl text-[#F6F3EA]`}>
                Fee Ledger
              </span>
              <p className="mt-3 max-w-xs text-xs leading-5 text-[#F6F3EA]/50">
                A fee ledger and payment record for schools, built around eSewa
                and a full audit trail.
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F6F3EA]/35">
                On this page
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#F6F3EA]/65">
                <li>
                  <a
                    href="#features"
                    className="transition-colors hover:text-white"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#roles"
                    className="transition-colors hover:text-white"
                  >
                    Roles
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="transition-colors hover:text-white"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="transition-colors hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F6F3EA]/35">
                Portals
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#F6F3EA]/65">
                <li>
                  <Link
                    to="/login"
                    className="transition-colors hover:text-white"
                  >
                    Student login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="transition-colors hover:text-white"
                  >
                    Staff & admin login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="transition-colors hover:text-white"
                  >
                    Student registration
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F6F3EA]/35">
                Payments
              </h3>
              <div className="mt-4 flex items-center gap-2.5 text-sm text-[#F6F3EA]/65">
                <ShieldCheck
                  className="h-4 w-4 text-[#93702F]"
                  strokeWidth={1.75}
                />
                <span>eSewa verified merchant</span>
              </div>
            </div>
          </div>

          <div
            className={`mt-6 flex flex-col items-center justify-between gap-3 text-[10px] text-[#F6F3EA]/35 sm:flex-row ${mono}`}
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
