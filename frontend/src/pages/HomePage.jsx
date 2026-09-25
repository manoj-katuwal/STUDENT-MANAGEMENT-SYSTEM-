import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Phone,
  Receipt,
  ShieldCheck,
  X,
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
    title: "One fee structure per class",
    body: "Tuition, lab, library, sports, and exam fees are set once per class and academic year, then applied automatically to every student in it.",
  },
  {
    title: "eSewa, built in",
    body: "Students settle a balance in full or in part from their own portal. The ledger reconciles the moment eSewa confirms payment.",
  },
  {
    title: "Receipts that don't need reprinting",
    body: "Every payment — online or at the counter — produces a numbered PDF receipt immediately, ready to download or print.",
  },
  {
    title: "Discounts and scholarships, kept separate",
    body: "A sibling discount and a merit scholarship are recorded as distinct entries against the same fee, so nothing is ever double-counted.",
  },
  {
    title: "Fines that respect a grace period",
    body: "Late fees accrue daily against a configurable policy and cap — never silently, and never past the limit a school has set.",
  },
  {
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
    statusClass: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20",
    amount: "12,000",
  },
  {
    no: "015",
    name: "Bikash Thapa",
    status: "Due",
    statusClass: "text-red-700 bg-red-50 ring-1 ring-red-600/20",
    amount: "8,500",
  },
  {
    no: "016",
    name: "Sunita Gurung",
    status: "Paid",
    statusClass: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20",
    amount: "12,000",
  },
  {
    no: "017",
    name: "Prakash K.C.",
    status: "Partial",
    statusClass: "text-amber-700 bg-amber-50 ring-1 ring-amber-600/20",
    amount: "6,000",
  },
];

const navLinks = [
  ["Features", "#features"],
  ["Roles", "#roles"],
  ["How it works", "#how-it-works"],
  ["FAQ", "#faq"],
];

/* ───────────────────────── Shared primitives ─────────────────────────
   Pulled out so every CTA in the page shares one focus ring, one radius
   scale, and one hover treatment instead of five hand-copied variants. */

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

function Button({
  as: As = Link,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const base = `inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-5 text-sm font-semibold transition-colors ${FOCUS_RING}`;
  const variants = {
    primary:
      "bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700",
    dark: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
    outline:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };
  return (
    <As className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </As>
  );
}

function SectionIntro({ eyebrow, title, body }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-sm font-medium text-blue-600">{eyebrow}</p>
      )}
      <h2
        className={`${serif} mt-3 text-3xl leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-4xl`}
      >
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-base leading-7 text-slate-600">{body}</p>
      )}
    </div>
  );
}

function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [activeRoleTab, setActiveRoleTab] = useState("STUDENT");
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const firstMobileLinkRef = useRef(null);

  const activeRole = roles.find((r) => r.id === activeRoleTab) ?? roles[0];
  const ActiveRoleIcon = activeRole.icon;

  // Lock body scroll while the mobile drawer is open, close on Escape,
  // and move focus into the drawer for keyboard users.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMobileLinkRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileNavOpen]);

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div
      className={`min-h-screen overflow-x-hidden bg-white text-slate-900 ${sans} antialiased selection:bg-blue-600 selection:text-white`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            to="/"
            aria-label="Fee Ledger home"
            className={`group flex items-center gap-2.5 rounded-md ${FOCUS_RING}`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm text-white shadow-sm transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5">
              <span className={serif}>रू</span>
            </span>
            <span
              className={`${serif} text-lg font-medium tracking-[-0.01em] text-slate-900`}
            >
              Fee Ledger
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${FOCUS_RING}`}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                as={Link}
                to="/dashboard"
                variant="dark"
                className="hidden sm:inline-flex"
              >
                Dashboard
                <span className="text-white/40">·</span>
                <span className="max-w-24 truncate text-white/70">
                  {user?.role}
                </span>
              </Button>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="ghost"
                  className="hidden sm:inline-flex"
                >
                  Sign in
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  className="hidden sm:inline-flex"
                >
                  Get started
                </Button>
              </>
            )}

            {/* Mobile menu trigger — the piece the original page was missing */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden ${FOCUS_RING}`}
            >
              <Menu className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobileNav}
            className="absolute inset-0 bg-slate-900/40"
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-200"
          >
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
              <span className={`${serif} text-lg text-slate-900`}>Menu</span>
              <button
                type="button"
                onClick={closeMobileNav}
                aria-label="Close menu"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 ${FOCUS_RING}`}
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            <nav
              aria-label="Mobile"
              className="flex flex-1 flex-col gap-1 px-4 py-5"
            >
              {navLinks.map(([label, href], i) => (
                <a
                  key={href}
                  ref={i === 0 ? firstMobileLinkRef : undefined}
                  href={href}
                  onClick={closeMobileNav}
                  className={`rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 ${FOCUS_RING}`}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-2 border-t border-slate-200 p-4">
              {isAuthenticated ? (
                <Button
                  as={Link}
                  to="/dashboard"
                  variant="dark"
                  onClick={closeMobileNav}
                >
                  Open dashboard
                </Button>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline"
                    onClick={closeMobileNav}
                  >
                    Sign in
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    onClick={closeMobileNav}
                  >
                    Get started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <main id="main-content">
        {/* ───────────────────────── Hero ───────────────────────── */}
        <section className="relative isolate overflow-hidden border-b border-slate-200/70">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.08),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-32 lg:pt-28">
            <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
              <div>
                <h1
                  className={`${serif} max-w-2xl text-[2.75rem] leading-[1.04] tracking-[-0.035em] text-slate-900 sm:text-6xl lg:text-[4.25rem]`}
                >
                  Every fee recorded.
                  <br />
                  <span className="text-slate-400">Every rupee receipted.</span>
                </h1>

                <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  A single ledger for tuition, fines, discounts, and
                  scholarships — with eSewa payments, instant receipts, and a
                  plain audit trail behind every entry.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button
                    as={Link}
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    variant="primary"
                    className="min-h-12 px-6"
                  >
                    {isAuthenticated ? "Open my dashboard" : "Open the ledger"}
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="outline"
                    className="min-h-12 px-6"
                  >
                    Register a student
                  </Button>
                </div>

                <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200 pt-6">
                  {[
                    ["eSewa", "integrated gateway"],
                    ["4 roles", "permission-based"],
                    ["100%", "audit visibility"],
                  ].map(([value, label]) => (
                    <div key={value}>
                      <dt
                        className={`${mono} text-sm font-semibold text-slate-900`}
                      >
                        {value}
                      </dt>
                      <dd className="mt-1 text-xs leading-5 text-slate-500">
                        {label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* App preview */}
              <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-tr from-blue-600/10 via-slate-900/5 to-transparent blur-2xl" />
                <div className="absolute -bottom-8 -left-8 z-10 hidden h-28 w-40 overflow-hidden rounded-2xl border-8 border-white shadow-xl shadow-slate-900/15 xl:block">
                  <img
                    src="/school.jpg"
                    alt="Students and staff on the school campus"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="absolute -right-3 -top-4 z-10 hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg shadow-slate-900/5 sm:flex">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
                    <ShieldCheck
                      className="h-3.5 w-3.5 text-emerald-600"
                      strokeWidth={2}
                    />
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    eSewa verified
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs text-white">
                        <span className={serif}>रू</span>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Fee Register
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Academic year 2081/82
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div
                    className={`${mono} hidden grid-cols-[2.5rem_1fr_auto_5.5rem] gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-2.5 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:grid`}
                  >
                    <span>No.</span>
                    <span>Student</span>
                    <span>Status</span>
                    <span className="text-right">Amount</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {ledgerRows.map((row) => (
                      <div
                        key={row.no}
                        className="grid grid-cols-[2rem_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50/70 sm:grid-cols-[2.5rem_1fr_auto_5.5rem] sm:px-6"
                      >
                        <span className={`${mono} text-xs text-slate-400`}>
                          {row.no}
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-medium text-slate-900">
                            {row.name}
                          </span>
                          <span
                            className={`${mono} mt-0.5 block text-[10px] text-slate-400 sm:hidden`}
                          >
                            रू {row.amount}
                          </span>
                        </div>
                        <span
                          className={`w-fit rounded-md px-2 py-0.5 text-[10px] font-semibold ${row.statusClass}`}
                        >
                          {row.status}
                        </span>
                        <span
                          className={`${mono} hidden text-right text-xs font-medium text-slate-900 sm:block`}
                        >
                          रू {row.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
                    <div>
                      <p className="text-xs font-medium text-slate-600">
                        Collected this month
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Across all active ledgers
                      </p>
                    </div>
                    <span
                      className={`${mono} text-sm font-semibold text-emerald-600`}
                    >
                      रू 39,20,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── Features ───────────────────────── */}
        <section
          id="features"
          className="border-b border-slate-200/70 bg-slate-50/50"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
            <SectionIntro
              eyebrow="The ledger"
              title="The details that make a fee system trustworthy."
              body="A production-ready fee workflow needs more than a payment button. Every amount, adjustment, and receipt should remain understandable after the transaction is over."
            />

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ledgerFeatures.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md hover:shadow-slate-900/5"
                >
                  <h3
                    className={`${serif} text-xl leading-snug tracking-[-0.01em] text-slate-900`}
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── Roles ───────────────────────── */}
        <section id="roles" className="border-b border-slate-200/70">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
            <SectionIntro
              eyebrow="Access"
              title="Four roles. One source of truth."
              body="Everyone works from the same ledger, while permissions determine exactly what each role can view or change."
            />

            <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div
                role="tablist"
                aria-label="Fee Ledger roles"
                className="grid grid-cols-2 border-b border-slate-200 sm:grid-cols-4"
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
                      className={`relative min-h-14 border-b-2 px-4 text-sm font-semibold transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 ${
                        selected
                          ? "border-blue-600 bg-blue-50/50 text-blue-700"
                          : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
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
                <div className="flex flex-col gap-6 border-b border-slate-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900">
                      <ActiveRoleIcon
                        className="h-5 w-5 text-white"
                        strokeWidth={1.8}
                      />
                    </span>
                    <div>
                      <h3 className={`${serif} text-2xl text-slate-900`}>
                        {activeRole.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {activeRole.subtitle}
                      </p>
                    </div>
                  </div>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline"
                    className="w-fit"
                  >
                    Sign in as {activeRole.title}
                  </Button>
                </div>

                <div className="grid gap-4 pt-7 sm:grid-cols-2">
                  {activeRole.features.map((feature) => (
                    <div key={feature} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="text-sm leading-6 text-slate-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── How it works ───────────────────────── */}
        <section
          id="how-it-works"
          className="border-b border-slate-200/70 bg-slate-50/50"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
            <SectionIntro
              eyebrow="Workflow"
              title="A clear path from setup to receipt."
              body="The core workflow stays deliberately simple, so staff can move quickly without losing financial traceability."
            />

            <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
              <div
                className="absolute left-0 right-0 top-6 hidden h-px bg-linear-to-r from-transparent via-slate-300 to-transparent md:block"
                aria-hidden="true"
              />
              {steps.map((step) => (
                <li key={step.n} className="relative">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-900 shadow-sm">
                    {step.n}
                  </span>
                  <h3 className={`${serif} mt-6 text-2xl text-slate-900`}>
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────────────────────── FAQ ───────────────────────── */}
        <section id="faq" className="border-b border-slate-200/70">
          <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28 lg:px-8">
            <SectionIntro
              eyebrow="FAQ"
              title="Questions from the front office."
            />

            <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <div
                    key={faq.q}
                    className="border-b border-slate-200 last:border-b-0"
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`faq-answer-${index}`}
                        onClick={() => setOpenFaq(open ? null : index)}
                        className={`flex w-full items-center justify-between gap-5 px-6 py-5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600`}
                      >
                        <span
                          className={`${serif} text-lg leading-6 text-slate-900`}
                        >
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                            open ? "rotate-180 text-blue-600" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>
                    <div
                      id={`faq-answer-${index}`}
                      hidden={!open}
                      className="px-6 pb-6 pr-12"
                    >
                      <p className="text-sm leading-6 text-slate-600">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────────────── CTA ───────────────────────── */}
        <section className="relative isolate overflow-hidden border-y border-blue-100 bg-blue-50">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.12),transparent_60%)]" />
          <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24 lg:px-8">
            <h2
              className={`${serif} text-3xl tracking-[-0.02em] text-slate-900 sm:text-4xl`}
            >
              Open the ledger for your school.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
              Set up the fee structure once. Let payments, receipts, and reports
              take care of themselves after that.
            </p>
            <Button
              as={Link}
              to={isAuthenticated ? "/dashboard" : "/login"}
              variant="primary"
              className="mt-9 min-h-12 px-6"
            >
              {isAuthenticated ? "Open my dashboard" : "Sign in to the portal"}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </section>
      </main>

      {/* ───────────────────────── Footer ───────────────────────── */}
      <footer className="border-t border-slate-200 bg-white text-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.2fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-base font-semibold text-white">
                  <span className={serif}>रू</span>
                </span>
                <div>
                  <span className={`${serif} block text-2xl tracking-tight`}>
                    Fee Ledger
                  </span>
                  <span className="text-xs text-slate-500">
                    School finance, simplified
                  </span>
                </div>
              </div>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
                A dependable fee ledger for schools that want cleaner records,
                faster collections, and complete visibility from assignment to
                receipt.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Secure records, always available
              </div>
            </div>

            <nav aria-label="Explore">
              <h3 className="text-sm font-semibold text-slate-900">Explore</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {navLinks.map(([label, href]) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="transition-colors hover:text-blue-600"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Portals">
              <h3 className="text-sm font-semibold text-slate-900">Portals</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li>
                  <Link
                    to="/login"
                    className="transition-colors hover:text-blue-600"
                  >
                    Student login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="transition-colors hover:text-blue-600"
                  >
                    Staff &amp; admin login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="transition-colors hover:text-blue-600"
                  >
                    Register a student
                  </Link>
                </li>
              </ul>
            </nav>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">Contact</h3>
              <address className="mt-5 space-y-4 text-sm not-italic text-slate-600">
                <p className="flex items-center gap-3">
                  <MapPin
                    className="h-4 w-4 text-blue-600"
                    aria-hidden="true"
                  />
                  Kathmandu, Nepal
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  <a
                    href="mailto:hello@feeledger.edu.np"
                    className="hover:text-blue-600"
                  >
                    hello@feeledger.edu.np
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  <a href="tel:+977015550101" className="hover:text-blue-600">
                    +977 01 555 0101
                  </a>
                </p>
              </address>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} Fee Ledger. Built for better school
              operations.
            </p>
            <p className="text-slate-600">
              Every entry logged. Every rupee accounted for.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
