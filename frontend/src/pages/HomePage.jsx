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

/* ───────────────────────── Design tokens ─────────────────────────
   Ledger / passbook language: warm paper, ink navy, ledger green,
   brass for stamped emphasis, debit red reserved for money that's
   actually owed. Every numeral renders in tabular mono, the way a
   real register lines figures up in columns. */

const serif = "font-['Spectral',Georgia,serif]";
const sans = "font-['IBM_Plex_Sans',ui-sans-serif,system-ui,sans-serif]";
const mono =
  "font-['IBM_Plex_Mono',ui-monospace,SFMono-Regular,monospace] tabular-nums";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F5EE]";

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
    tone: "text-[#1E4D3B]",
    amount: "12,000",
  },
  {
    no: "015",
    name: "Bikash Thapa",
    status: "Due",
    tone: "text-[#9B3242]",
    amount: "8,500",
  },
  {
    no: "016",
    name: "Sunita Gurung",
    status: "Paid",
    tone: "text-[#1E4D3B]",
    amount: "12,000",
  },
  {
    no: "017",
    name: "Prakash K.C.",
    status: "Partial",
    tone: "text-[#A9832F]",
    amount: "6,000",
  },
];

const navLinks = [
  ["Features", "#features"],
  ["Roles", "#roles"],
  ["How it works", "#how-it-works"],
  ["FAQ", "#faq"],
];

function Button({
  as: As = Link,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const base = `inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm px-5 text-sm font-semibold tracking-[-0.01em] transition-colors ${FOCUS_RING}`;
  const variants = {
    primary: "bg-[#1E4D3B] text-[#F7F5EE] hover:bg-[#173B2D]",
    outline:
      "border border-[#17233B]/25 text-[#17233B] hover:border-[#17233B] hover:bg-[#17233B]/[0.04]",
    ghost: "text-[#17233B]/70 hover:text-[#17233B] hover:bg-[#17233B]/[0.04]",
  };
  return (
    <As className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </As>
  );
}

/* A single ledger row used for the features list — deliberately not a
   card grid, since the content is a register of entries, not a set of
   unrelated feature tiles. */
function LedgerFeatureRow({ no, title, body, last }) {
  return (
    <div
      className={`grid grid-cols-[3rem_1fr] gap-5 py-7 sm:grid-cols-[4rem_1fr] sm:gap-8 ${
        last ? "" : "border-b border-[#DAD4C3]"
      }`}
    >
      <span className={`${mono} pt-1 text-sm text-[#A9832F]`}>{no}</span>
      <div>
        <h3
          className={`${serif} text-xl leading-snug tracking-[-0.01em] text-[#17233B]`}
        >
          {title}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#17233B]/70">
          {body}
        </p>
      </div>
    </div>
  );
}

function SectionHeading({ tag, title, body }) {
  return (
    <div className="max-w-2xl">
      {tag && (
        <p className={`${mono} text-xs tracking-[0.08em] text-[#1E4D3B]`}>
          {tag}
        </p>
      )}
      <h2
        className={`${serif} mt-3 text-3xl leading-[1.15] tracking-[-0.02em] text-[#17233B] sm:text-4xl`}
      >
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-base leading-7 text-[#17233B]/70">{body}</p>
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
      className={`min-h-screen overflow-x-hidden bg-[#F7F5EE] text-[#17233B] ${sans} antialiased selection:bg-[#1E4D3B] selection:text-[#F7F5EE]`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-[#17233B] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#F7F5EE]"
      >
        Skip to content
      </a>

      {/* Binding rule — the ledger's margin line, running the height of the page */}
      <div
        className="pointer-events-none fixed inset-y-0 left-4 z-40 hidden w-px bg-[#9B3242]/25 lg:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-y-0 left-6 z-40 hidden w-px bg-[#DAD4C3] lg:block"
        aria-hidden="true"
      />

      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#DAD4C3] bg-[#F7F5EE]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link
            to="/"
            aria-label="Fee Ledger home"
            className={`group flex items-center gap-2.5 rounded-sm ${FOCUS_RING}`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#17233B] text-sm text-[#17233B]">
              <span className={serif}>रू</span>
            </span>
            <span
              className={`${serif} text-lg tracking-[-0.01em] text-[#17233B]`}
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
                className={`rounded-sm px-3 py-2 text-sm font-medium text-[#17233B]/70 transition-colors hover:text-[#17233B] ${FOCUS_RING}`}
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
                variant="primary"
                className="hidden sm:inline-flex"
              >
                Dashboard
                <span className="text-[#F7F5EE]/50">·</span>
                <span className="max-w-24 truncate text-[#F7F5EE]/80">
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

            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-sm text-[#17233B] hover:bg-[#17233B]/[0.06] md:hidden ${FOCUS_RING}`}
            >
              <Menu className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobileNav}
            className="absolute inset-0 bg-[#17233B]/40"
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-[#F7F5EE] shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-[#DAD4C3] px-6">
              <span className={`${serif} text-lg text-[#17233B]`}>Menu</span>
              <button
                type="button"
                onClick={closeMobileNav}
                aria-label="Close menu"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-sm text-[#17233B]/70 hover:bg-[#17233B]/[0.06] ${FOCUS_RING}`}
              >
                <X className="h-5 w-5" strokeWidth={1.6} />
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
                  className={`rounded-sm px-3 py-3 text-base font-medium text-[#17233B]/80 hover:bg-[#17233B]/[0.06] ${FOCUS_RING}`}
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2 border-t border-[#DAD4C3] p-4">
              {isAuthenticated ? (
                <Button
                  as={Link}
                  to="/dashboard"
                  variant="primary"
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

      <main id="main-content" className="lg:pl-14">
        {/* ───────────────────────── Hero ───────────────────────── */}
        <section className="relative border-b border-[#DAD4C3]">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pb-24 sm:pt-20 lg:px-10 lg:pt-24">
            <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div>
                <p
                  className={`${mono} text-xs tracking-[0.08em] text-[#1E4D3B]`}
                >
                  Fee Ledger — school register
                </p>
                <h1
                  className={`${serif} mt-4 max-w-xl text-[2.6rem] leading-[1.05] tracking-[-0.03em] text-[#17233B] sm:text-6xl`}
                >
                  Every fee recorded. Every rupee receipted.
                </h1>
                <p className="mt-6 max-w-md text-base leading-7 text-[#17233B]/70">
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

                <div className="mt-14 flex max-w-md items-stretch divide-x divide-[#DAD4C3] border-y border-[#DAD4C3]">
                  {[
                    ["eSewa", "integrated gateway"],
                    ["4 roles", "permission-based"],
                    ["100%", "audit visibility"],
                  ].map(([value, label]) => (
                    <div
                      key={value}
                      className="flex-1 px-4 py-4 first:pl-0 last:pr-0"
                    >
                      <p className={`${mono} text-lg text-[#17233B]`}>
                        {value}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#17233B]/55">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ledger page mockup */}
              <div className="relative mx-auto w-full max-w-lg lg:mt-2">
                <div className="overflow-hidden rounded-sm border border-[#DAD4C3] bg-white shadow-[0_1px_0_#DAD4C3,0_18px_40px_-24px_rgba(23,35,59,0.35)]">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.5]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent, transparent 43px, #DAD4C3 44px)",
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center justify-between border-b border-[#DAD4C3] bg-[#FCFBF7] px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#17233B]">
                        Fee Register
                      </p>
                      <p
                        className={`${mono} mt-0.5 text-[11px] text-[#17233B]/50`}
                      >
                        A.Y. 2081/82
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 border border-[#1E4D3B]/25 px-2 py-1 text-[10px] font-medium tracking-[0.06em] text-[#1E4D3B]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1E4D3B]" />
                      LIVE
                    </span>
                  </div>

                  <div
                    className={`${mono} relative hidden grid-cols-[2.5rem_1fr_auto_5.5rem] gap-4 border-b border-[#DAD4C3] px-6 py-2 text-[10px] tracking-[0.06em] text-[#17233B]/40 sm:grid`}
                  >
                    <span>No.</span>
                    <span>Student</span>
                    <span>Status</span>
                    <span className="text-right">Amount</span>
                  </div>

                  <div className="relative">
                    {ledgerRows.map((row) => (
                      <div
                        key={row.no}
                        className="grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-[#DAD4C3] px-6 py-3 last:border-b-0 sm:grid-cols-[2.5rem_1fr_auto_5.5rem]"
                      >
                        <span className={`${mono} text-xs text-[#17233B]/40`}>
                          {row.no}
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate text-sm text-[#17233B]">
                            {row.name}
                          </span>
                          <span
                            className={`${mono} mt-0.5 block text-[10px] text-[#17233B]/45 sm:hidden`}
                          >
                            रू {row.amount}
                          </span>
                        </div>
                        <span
                          className={`${mono} text-xs font-medium ${row.tone}`}
                        >
                          {row.status}
                        </span>
                        <span
                          className={`${mono} hidden text-right text-xs text-[#17233B] sm:block`}
                        >
                          रू {row.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="relative flex items-center justify-between bg-[#FCFBF7] px-6 py-4">
                    <p className="text-xs text-[#17233B]/60">
                      Collected this month
                    </p>
                    <span
                      className={`${mono} text-sm font-semibold text-[#1E4D3B]`}
                    >
                      रू 39,20,000
                    </span>
                  </div>
                </div>
                <p
                  className={`${mono} mt-3 text-right text-[10px] tracking-[0.06em] text-[#17233B]/35`}
                >
                  Fig. 1 — sample fee register
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── Features ───────────────────────── */}
        <section id="features" className="border-b border-[#DAD4C3]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10">
            <SectionHeading
              tag="The ledger"
              title="The details that make a fee system trustworthy."
              body="A production-ready fee workflow needs more than a payment button. Every amount, adjustment, and receipt should remain understandable after the transaction is over."
            />
            <div className="mt-10 border-t border-[#DAD4C3]">
              {ledgerFeatures.map((f, i) => (
                <LedgerFeatureRow
                  key={f.no}
                  {...f}
                  last={i === ledgerFeatures.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── Roles ───────────────────────── */}
        <section id="roles" className="border-b border-[#DAD4C3] bg-[#FCFBF7]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10">
            <SectionHeading
              tag="Access"
              title="Four roles. One source of truth."
              body="Everyone works from the same ledger, while permissions determine exactly what each role can view or change."
            />

            <div className="mt-10 border border-[#DAD4C3] bg-white">
              {/* Passbook-style divider tabs */}
              <div
                role="tablist"
                aria-label="Fee Ledger roles"
                className="grid grid-cols-2 sm:grid-cols-4"
              >
                {roles.map((role, i) => {
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
                      className={`relative min-h-14 border-b px-4 text-sm font-medium transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E4D3B] ${
                        i > 0 ? "border-l border-[#DAD4C3]" : ""
                      } ${
                        selected
                          ? "border-b-[#1E4D3B] bg-[#1E4D3B]/[0.04] text-[#1E4D3B]"
                          : "border-b-[#DAD4C3] text-[#17233B]/55 hover:bg-[#17233B]/[0.03] hover:text-[#17233B]"
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
                <div className="flex flex-col gap-6 border-b border-[#DAD4C3] pb-7 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-[#17233B]">
                      <ActiveRoleIcon
                        className="h-5 w-5 text-[#17233B]"
                        strokeWidth={1.6}
                      />
                    </span>
                    <div>
                      <h3 className={`${serif} text-2xl text-[#17233B]`}>
                        {activeRole.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-[#17233B]/55">
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
                      <Check
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-[#1E4D3B]"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-6 text-[#17233B]/80">
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
        <section id="how-it-works" className="border-b border-[#DAD4C3]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10">
            <SectionHeading
              tag="Workflow"
              title="A clear path from setup to receipt."
              body="The core workflow stays deliberately simple, so staff can move quickly without losing financial traceability."
            />

            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {steps.map((step, i) => (
                <li
                  key={step.n}
                  className={`${i > 0 ? "md:border-l md:border-[#DAD4C3] md:pl-8" : ""}`}
                >
                  <span className={`${mono} text-sm text-[#A9832F]`}>
                    {step.n}
                  </span>
                  <h3 className={`${serif} mt-3 text-2xl text-[#17233B]`}>
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-[#17233B]/70">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────────────────────── FAQ ───────────────────────── */}
        <section id="faq" className="border-b border-[#DAD4C3] bg-[#FCFBF7]">
          <div className="mx-auto max-w-3xl px-6 py-20 sm:py-24 lg:px-10">
            <SectionHeading
              tag="FAQ"
              title="Questions from the front office."
            />

            <div className="mt-10 border-t border-[#DAD4C3]">
              {faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <div key={faq.q} className="border-b border-[#DAD4C3]">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`faq-answer-${index}`}
                        onClick={() => setOpenFaq(open ? null : index)}
                        className="flex w-full items-start gap-5 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E4D3B]"
                      >
                        <span className={`${mono} pt-1 text-xs text-[#A9832F]`}>
                          Q{index + 1}
                        </span>
                        <span
                          className={`${serif} flex-1 text-lg leading-6 text-[#17233B]`}
                        >
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`mt-1 h-4 w-4 shrink-0 text-[#17233B]/40 transition-transform duration-200 ${open ? "rotate-180 text-[#1E4D3B]" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>
                    <div
                      id={`faq-answer-${index}`}
                      hidden={!open}
                      className="pb-6 pl-9 pr-8"
                    >
                      <p className="text-sm leading-6 text-[#17233B]/70">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────────────── CTA — the one bold move ───────────────────────── */}
        <section className="relative overflow-hidden bg-[#17233B]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 sm:py-24 lg:grid-cols-[1fr_auto] lg:px-10">
            <div>
              <h2
                className={`${serif} max-w-lg text-3xl leading-tight tracking-[-0.02em] text-[#F7F5EE] sm:text-4xl`}
              >
                Open the ledger for your school.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-[#F7F5EE]/65">
                Set up the fee structure once. Let payments, receipts, and
                reports take care of themselves after that.
              </p>
              <Button
                as={Link}
                to={isAuthenticated ? "/dashboard" : "/login"}
                variant="primary"
                className="mt-9 min-h-12 bg-[#F7F5EE] px-6 text-[#17233B] hover:bg-white"
              >
                {isAuthenticated
                  ? "Open my dashboard"
                  : "Sign in to the portal"}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {/* Wax-seal stamp — the single bold decorative flourish on the page */}
            <div
              className="mx-auto flex h-32 w-32 shrink-0 -rotate-6 items-center justify-center rounded-full border-2 border-dashed border-[#A9832F]/70 text-center sm:h-36 sm:w-36"
              aria-hidden="true"
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-[#A9832F]/70 sm:h-28 sm:w-28">
                <span
                  className={`${serif} text-[10px] tracking-[0.2em] text-[#A9832F]`}
                >
                  AUDITED
                </span>
                <span className={`${mono} mt-1 text-[9px] text-[#A9832F]/70`}>
                  EST. LEDGER
                </span>
                <span className={`${serif} mt-1 text-lg text-[#A9832F]`}>
                  रू
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ───────────────────────── Footer ───────────────────────── */}
      <footer className="bg-[#F7F5EE] lg:pl-14">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-10 border-t border-[#DAD4C3] pt-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.2fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#17233B] text-sm">
                  <span className={serif}>रू</span>
                </span>
                <div>
                  <span
                    className={`${serif} block text-xl tracking-[-0.01em] text-[#17233B]`}
                  >
                    Fee Ledger
                  </span>
                  <span
                    className={`${mono} text-[10px] tracking-[0.06em] text-[#1E4D3B]`}
                  >
                    SCHOOL FINANCE, SIMPLIFIED
                  </span>
                </div>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#17233B]/65">
                A dependable fee ledger for schools that want cleaner records,
                faster collections, and complete visibility from assignment to
                receipt.
              </p>
            </div>

            <nav aria-label="Explore">
              <h3 className="text-sm font-semibold text-[#17233B]">Explore</h3>
              <ul className="mt-5 space-y-3 text-sm text-[#17233B]/65">
                {navLinks.map(([label, href]) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="transition-colors hover:text-[#1E4D3B]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Portals">
              <h3 className="text-sm font-semibold text-[#17233B]">Portals</h3>
              <ul className="mt-5 space-y-3 text-sm text-[#17233B]/65">
                <li>
                  <Link
                    to="/login"
                    className="transition-colors hover:text-[#1E4D3B]"
                  >
                    Student login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="transition-colors hover:text-[#1E4D3B]"
                  >
                    Staff &amp; admin login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="transition-colors hover:text-[#1E4D3B]"
                  >
                    Register a student
                  </Link>
                </li>
              </ul>
            </nav>

            <div>
              <h3 className="text-sm font-semibold text-[#17233B]">Contact</h3>
              <address className="mt-5 space-y-4 text-sm not-italic text-[#17233B]/65">
                <p className="flex items-center gap-3">
                  <MapPin
                    className="h-4 w-4 text-[#1E4D3B]"
                    aria-hidden="true"
                  />
                  Kathmandu, Nepal
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#1E4D3B]" aria-hidden="true" />
                  <a
                    href="mailto:hello@feeledger.edu.np"
                    className="hover:text-[#1E4D3B]"
                  >
                    hello@feeledger.edu.np
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Phone
                    className="h-4 w-4 text-[#1E4D3B]"
                    aria-hidden="true"
                  />
                  <a href="tel:+977015550101" className="hover:text-[#1E4D3B]">
                    +977 01 555 0101
                  </a>
                </p>
              </address>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#DAD4C3] pt-6 text-xs text-[#17233B]/50 sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} Fee Ledger. Built for better school
              operations.
            </p>
            <p className={mono}>
              Every entry logged. Every rupee accounted for.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
