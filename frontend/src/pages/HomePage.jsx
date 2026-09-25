import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  CreditCard,
  Users,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Search,
  Filter,
  ArrowRight,
  Download,
  HelpCircle,
  Smartphone,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  ChevronDown,
  Moon,
  Sun,
  Phone,
  Mail,
  MapPin,
  Lock,
  Zap,
  Layout,
  UserCheck,
  Building,
  GraduationCap
} from 'lucide-react';

const INITIAL_LEDGER_DATA = [
  { id: 'TXN-8092', student: 'Aarav Sharma', idNo: 'STU-2024-089', grade: 'Grade 10', amount: 18500, status: 'Paid', method: 'eSewa', date: '2026-09-24' },
  { id: 'TXN-8093', student: 'Priya Adhikari', idNo: 'STU-2024-112', grade: 'Grade 8', amount: 12000, status: 'Paid', method: 'Khalti', date: '2026-09-24' },
  { id: 'TXN-8094', student: 'Siddharth Thapa', idNo: 'STU-2024-045', grade: 'Grade 12', amount: 24500, status: 'Pending', method: 'Bank Transfer', date: '2026-09-23' },
  { id: 'TXN-8095', student: 'Ananya Rai', idNo: 'STU-2024-201', grade: 'Grade 6', amount: 9500, status: 'Paid', method: 'eSewa', date: '2026-09-22' },
  { id: 'TXN-8096', student: 'Rohan Karki', idNo: 'STU-2024-156', grade: 'Grade 11', amount: 21000, status: 'Overdue', method: 'Cash Deposit', date: '2026-09-18' },
];

const FAQ_ITEMS = [
  {
    q: "Is Fee Ledger customized for Nepal's educational payment ecosystem?",
    a: "Yes! Fee Ledger natively integrates with eSewa, Khalti, ConnectIPS, and major Nepalese banking APIs. It supports dual currency/number formats (NPR / रू) and aligned academic sessions."
  },
  {
    q: "How secure is the transaction and student billing data?",
    a: "We deploy enterprise-grade AES-256 encryption at rest and TLS 1.3 in transit. Data is backed up across high-availability cloud servers with automated daily snapshots and strict role-based access control (RBAC)."
  },
  {
    q: "Can parents view breakdown of sibling discounts and late fines?",
    a: "Absolutely. Parents receive access to a dedicated mobile-first portal displaying granular itemized bills, scholarship discounts, transport fees, and real-time payment receipts directly downloadable as PDFs."
  },
  {
    q: "How long does implementation take for a school or college?",
    a: "Our automated onboarding wizard allows standard integration within 48 hours. Our team in Kathmandu provides full data migration support from legacy Excel or software suites."
  }
];

const Badge = ({ children, variant = 'indigo' }) => {
  const styles = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/50',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50',
    rose: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/50',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Interactive Ledger State
  const [ledgerData, setLedgerData] = useState(INITIAL_LEDGER_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSimulating, setIsSimulating] = useState(false);

  // Fee Calculator State
  const [baseTuition, setBaseTuition] = useState(15000);
  const [siblingCount, setSiblingCount] = useState(1);
  const [meritDiscount, setMeritDiscount] = useState(10);
  const [includeTransport, setIncludeTransport] = useState(true);

  // Workbench Active Tab
  const [activeRole, setActiveRole] = useState('administrator');
  const [openFaq, setOpenFaq] = useState(0);

  // Dark Mode Toggle Class Setup
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filtered Ledger Entries calculation
  const filteredLedger = useMemo(() => {
    return ledgerData.filter((item) => {
      const matchesSearch = item.student.toLowerCase().includes(searchQuery.toLowerCase()) || item.idNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [ledgerData, searchQuery, statusFilter]);

  // Total Ledger Revenue
  const totalCollected = useMemo(() => {
    return filteredLedger
      .filter((i) => i.status === 'Paid')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredLedger]);

  // Simulate Live Payment Entry
  const handleSimulatePayment = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const newEntry = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        student: 'Kiran KC',
        idNo: 'STU-2024-304',
        grade: 'Grade 9',
        amount: 14500,
        status: 'Paid',
        method: 'eSewa',
        date: new Date().toISOString().split('T')[0],
      };
      setLedgerData([newEntry, ...ledgerData]);
      setIsSimulating(false);
    }, 800);
  };

  // Fee Calculation Logic
  const calculatedFee = useMemo(() => {
    let base = Number(baseTuition);
    const siblingDiscountPct = Math.min((siblingCount - 1) * 10, 30); // 10% per sibling max 30
    const totalDiscountPct = Math.min(siblingDiscountPct + Number(meritDiscount), 50);
    const discountAmount = (base * totalDiscountPct) / 100;
    const transportFee = includeTransport ? 3500 : 0;
    const finalFee = base - discountAmount + transportFee;

    return {
      discountAmount,
      totalDiscountPct,
      transportFee,
      finalFee,
    };
  }, [baseTuition, siblingCount, meritDiscount, includeTransport]);

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Skip to Main Content Link for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg">
        Skip to main content
      </a>

      {}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                Fee Ledger
              </span>
              <span className="block text-[10px] font-mono font-medium tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                Enterprise OS
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#sandbox" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Live Sandbox</a>
            <a href="#roles" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Workbench</a>
            <a href="#calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Fee Calculator</a>
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
          </nav>

          {/* Actions & Theme Switcher */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all hover:scale-105"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <a
              href="#sandbox"
              className="px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all"
            >
              Sign In
            </a>
            <a
              href="#calculator"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started Free
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              aria-label="Open main menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-3">
            <a href="#sandbox" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200">Live Sandbox</a>
            <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200">Workbench</a>
            <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200">Fee Calculator</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200">Features</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200">FAQ</a>
            <div className="pt-2 flex flex-col gap-2">
              <a href="#calculator" className="w-full py-3 text-center font-semibold rounded-xl text-white bg-indigo-600">Get Started Free</a>
            </div>
          </div>
        )}
      </header>

      <main id="main-content">
        {}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          {/* Ambient Background Gradient Mesh */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40 dark:opacity-25 blur-3xl">
            <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
            <div className="absolute top-20 right-10 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
            <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <Badge variant="indigo">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Nepalese Institution Billing OS
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Automate Educational Fee Ledgers with <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">Absolute Precision</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                Streamline tuition processing, digital gate passes, automatic sibling discounts, and seamless eSewa/Khalti payouts for schools, colleges, and universities across Nepal.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="#sandbox"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/45 transition-all flex items-center justify-center gap-2 group"
                >
                  Explore Interactive Ledger
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#calculator"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-2xl text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Calculate Fee Distribution
                </a>
              </div>

              {/* Key Proof Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 border-t border-slate-200/80 dark:border-slate-800/80 text-left">
                <div>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">रू 450M+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Processed Annually</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">120+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Schools & Colleges</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">99.98%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Reconciliation Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">&lt; 2 Sec</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">eSewa/Khalti Sync</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section id="sandbox" className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <Badge variant="emerald">Live Interactive Sandbox</Badge>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  Real-Time Fee Ledger Terminal
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Filter live receipts, test eSewa gateway simulation, and inspect automated status updating.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSimulatePayment}
                  disabled={isSimulating}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Zap className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
                  {isSimulating ? 'Processing Transaction...' : '+ Simulate Live eSewa Payment'}
                </button>
              </div>
            </div>

            {/* Sandbox Card Wrapper */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              {/* Filter Controls Toolbar */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search student or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          statusFilter === status
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Transaction ID</th>
                      <th className="px-6 py-3.5">Student Details</th>
                      <th className="px-6 py-3.5">Grade</th>
                      <th className="px-6 py-3.5">Payment Method</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Amount (NPR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {filteredLedger.length > 0 ? (
                      filteredLedger.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {row.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900 dark:text-white">{row.student}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{row.idNo}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.grade}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Smartphone className="w-3 h-3 text-slate-400" /> {row.method}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {row.status === 'Paid' && <Badge variant="emerald">Paid</Badge>}
                            {row.status === 'Pending' && <Badge variant="amber">Pending</Badge>}
                            {row.status === 'Overdue' && <Badge variant="rose">Overdue</Badge>}
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                            रू {row.amount.toLocaleString('ne-NP')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                          No matching ledger entries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Summary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <div>
                  Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredLedger.length}</span> of {ledgerData.length} records
                </div>
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  Total Collected (Filtered): <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm ml-1">रू {totalCollected.toLocaleString('ne-NP')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section id="roles" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="indigo">Tailored Workspaces</Badge>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                Purpose-Built Roles for Your Entire Institution
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                Select a role to preview how Fee Ledger transforms tailored workflows for students, accountants, and leadership.
              </p>
            </div>

            {/* Role Tabs Nav */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {[
                { id: 'administrator', label: 'Administrator', icon: Shield },
                { id: 'accountant', label: 'Accountant', icon: BarChart3 },
                { id: 'student', label: 'Student / Parent', icon: GraduationCap },
                { id: 'principal', label: 'Principal / Management', icon: Building },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeRole === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRole(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-105'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Role Tab Detail Box */}
            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
              {activeRole === 'administrator' && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <Badge variant="indigo">Admin Workspace</Badge>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Centralized System Control</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Configure fee structures per grade, manage custom late penalty rules, assign staff permissions, and execute system audits with full log history.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dynamic Fee Head Creation (Exam, Library, Transport)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated SMS & Email Fee Reminder Triggers</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bulk Student Import via Excel / CSV Wizard</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-3">
                    <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span>SYSTEM_ADMIN_LOG</span>
                      <span className="text-emerald-500">LIVE</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">[10:42 AM] - Scholarship Matrix recalculated for Grade 11</p>
                    <p className="text-slate-700 dark:text-slate-300">[10:38 AM] - eSewa API Key synced successfully</p>
                    <p className="text-slate-700 dark:text-slate-300">[09:15 AM] - Automatic batch billing generated for 1,240 students</p>
                  </div>
                </div>
              )}

              {activeRole === 'accountant' && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <Badge variant="emerald">Accountant Desk</Badge>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Instant Bank Reconciliation</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Zero manual ledger entry. Automatically match incoming mobile payments with student IDs, clear pending dues, and print physical receipts in one tap.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1-Click Tax Invoice & Receipt Printing</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-Time Cash Collection vs Gateway Tally</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom Late Fee Waiver Authorizations</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Today's Counter Cash</span>
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">रू 142,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Gateway Collections (eSewa/Khalti)</span>
                      <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">रू 389,000</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[72%]" />
                    </div>
                  </div>
                </div>
              )}

              {activeRole === 'student' && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <Badge variant="amber">Parent & Student Portal</Badge>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1-Tap Payment Portal</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Parents receive instant mobile alerts with direct eSewa/Khalti deep links. Clear monthly tuition fees on the go and access exam pass cards digitally.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Transparent Breakdown of Tuition, Transport, & Discounts</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Download PDF Tax Receipts Anytime</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Digital Exam Clearance Card Badge</li>
                    </ul>
                  </div>
                  <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg space-y-4">
                    <div className="text-xs opacity-80">Parent Quick Pay</div>
                    <div className="text-2xl font-mono font-bold">Grade 10 Tuition Fee</div>
                    <div className="flex justify-between items-end pt-4 border-t border-indigo-400/30">
                      <div>
                        <div className="text-[10px] uppercase opacity-75">Due Date</div>
                        <div className="text-xs font-semibold">Oct 05, 2026</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase opacity-75">Payable Amount</div>
                        <div className="text-xl font-mono font-bold">रू 16,500</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeRole === 'principal' && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <Badge variant="rose">Leadership Executive View</Badge>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">High-Level Financial Intelligence</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Comprehensive financial dashboards showing revenue projections, outstanding aging reports, grade-wise default trends, and scholarship distribution.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Predictive Monthly Revenue Forecasting</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Defaulter Aging Analysis (30 / 60 / 90 Days)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Executive Board Meeting PDF Reports</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="text-xs font-semibold text-slate-500">Year-to-Date Revenue Realization</div>
                    <div className="text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400">94.8%</div>
                    <div className="text-xs text-slate-400">Total outstanding balance across all faculties: रू 1.2M</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {}
        <section id="calculator" className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="amber">Interactive Fee Estimator</Badge>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                Simulate Tuition & Discount Distribution
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                Test how our automated engine calculates sibling waivers, merit scholarships, and optional transport fees in NPR (रू).
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Calculator Inputs */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Base Monthly Tuition Fee (NPR / रू)
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={baseTuition}
                    onChange={(e) => setBaseTuition(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between items-center mt-2 font-mono text-sm font-bold text-slate-900 dark:text-white">
                    <span>रू 5,000</span>
                    <span className="text-indigo-600 dark:text-indigo-400 text-lg">रू {Number(baseTuition).toLocaleString('ne-NP')}</span>
                    <span>रू 50,000</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Enrolled Siblings ({siblingCount})
                    </label>
                    <select
                      value={siblingCount}
                      onChange={(e) => setSiblingCount(Number(e.target.value))}
                      className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={1}>1 Student (0% Sibling Waiver)</option>
                      <option value={2}>2 Siblings (10% Waiver)</option>
                      <option value={3}>3 Siblings (20% Waiver)</option>
                      <option value={4}>4+ Siblings (30% Cap Waiver)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Merit / Scholarship Discount
                    </label>
                    <select
                      value={meritDiscount}
                      onChange={(e) => setMeritDiscount(Number(e.target.value))}
                      className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={0}>0% No Merit Discount</option>
                      <option value={10}>10% Top 10 Rank Waiver</option>
                      <option value={20}>20% Top 3 Rank Waiver</option>
                      <option value={30}>30% Full Merit Scholarship</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">Include Transport Service</div>
                      <div className="text-[11px] text-slate-500">Fixed rate: रू 3,500 / month</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeTransport}
                    onChange={(e) => setIncludeTransport(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculator Live Output Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 rounded-3xl border border-indigo-800 shadow-2xl space-y-6">
                <h3 className="text-lg font-bold border-b border-indigo-800/80 pb-4 flex items-center justify-between">
                  <span>Net Fee Summary</span>
                  <Badge variant="emerald">Live Calculation</Badge>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-indigo-200">
                    <span>Base Tuition Fee</span>
                    <span className="font-mono font-semibold">रू {Number(baseTuition).toLocaleString('ne-NP')}</span>
                  </div>

                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Combined Waivers ({calculatedFee.totalDiscountPct}%)</span>
                    <span className="font-mono">- रू {calculatedFee.discountAmount.toLocaleString('ne-NP')}</span>
                  </div>

                  <div className="flex justify-between text-indigo-200">
                    <span>Transport Fee</span>
                    <span className="font-mono">+ रू {calculatedFee.transportFee.toLocaleString('ne-NP')}</span>
                  </div>

                  <div className="pt-4 border-t border-indigo-800/80 flex justify-between items-baseline">
                    <span className="text-sm font-semibold">Final Monthly Payable</span>
                    <span className="text-3xl font-mono font-bold text-white">
                      रू {calculatedFee.finalFee.toLocaleString('ne-NP')}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#faq"
                    className="w-full py-3 text-xs font-semibold rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                  >
                    Deploy This Fee Logic To Your Institution
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="indigo">Platform Architecture</Badge>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                Engineered for Modern Nepalese Education
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                Everything required to run financial operations smoothly with absolute auditability.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Smartphone,
                  title: 'Native eSewa & Khalti Sync',
                  desc: 'Direct API integrations automatically match wallet payments to student roll numbers within seconds.',
                },
                {
                  icon: Shield,
                  title: 'Bank-Grade AES-256 Security',
                  desc: 'Multi-layer security, role-based access restrictions, and automated daily off-site cloud backups.',
                },
                {
                  icon: TrendingUp,
                  title: 'Defaulter Aging Engine',
                  desc: 'Automate fine caps, dynamic late fee calculations, and scheduled parent SMS nudges.',
                },
                {
                  icon: Award,
                  title: 'Scholarship Matrix',
                  desc: 'Easily manage merit-based discounts, staff ward concessions, and government quotas effortlessly.',
                },
                {
                  icon: BookOpen,
                  title: 'Digital Gate & Exam Clearance',
                  desc: 'Generate instant QR-code exam clearance slips once dues are reconciled.',
                },
                {
                  icon: Users,
                  title: 'Multi-Campus Support',
                  desc: 'Manage multiple branches, faculties, or campuses under a single master administrative view.',
                },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all group"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {}
        <section id="faq" className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="indigo">Got Questions?</Badge>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-6 text-left flex justify-between items-center gap-4 focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                        {item.q}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-900/60 pt-4">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white p-10 sm:p-16 shadow-2xl overflow-hidden">
              {/* Subtle visual accent rings */}
              <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="max-w-2xl space-y-6 relative z-10">
                <Badge variant="emerald">Ready to Transform Your Campus?</Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Modernize Your Institution's Financial Ledger Today
                </h2>
                <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                  Join 120+ leading institutions across Nepal. Schedule a live walkthrough or start testing in our cloud sandbox right now.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a
                    href="#calculator"
                    className="px-8 py-4 text-sm font-bold rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg transition-all text-center"
                  >
                    Schedule Campus Demo
                  </a>
                  <a
                    href="tel:+97714000000"
                    className="px-8 py-4 text-sm font-bold rounded-2xl bg-indigo-800/60 hover:bg-indigo-800 border border-indigo-400/30 text-white transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Call (+977) 01-4100200
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Fee Ledger</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Nepal’s leading enterprise educational fee ledger management operating system. Empowering accounts departments with seamless automation and digital wallet integrations.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-300">
              <MapPin className="w-4 h-4 text-indigo-400" /> Kathmandu, Nepal
              <span className="text-slate-600">|</span>
              <Mail className="w-4 h-4 text-indigo-400" /> support@feeledger.com.np
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#sandbox" className="hover:text-white transition-colors">Live Sandbox</a></li>
              <li><a href="#roles" className="hover:text-white transition-colors">Role Workbench</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Fee Estimator</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Gateways</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">eSewa Pay</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Khalti SDK</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ConnectIPS Gateway</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NIBL Direct Bank Sync</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Compliance</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Security (AES-256)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Audit Readiness</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <div>© {new Date().getFullYear()} Fee Ledger Nepal Pvt. Ltd. All rights reserved.</div>
          <div className="mt-4 sm:mt-0 font-mono text-[11px]">Designed with Senior Enterprise Standards</div>
        </div>
      </footer>
    </div>
  );
}