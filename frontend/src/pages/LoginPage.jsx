import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
  School,
} from "lucide-react";
import { useLogin } from "../features/auth/auth.hooks";
import { useAuth } from "../features/auth/auth.context";

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { mutate: login, isPending, error } = useLogin();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(formData, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 font-body">
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs">
              SFM
            </div>
            <span className="font-poppins font-bold text-slate-900 tracking-tight text-base sm:text-lg">
              Fee Ledger
            </span>
          </Link>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="text-slate-500 hidden sm:inline">
              Need an account?
            </span>
            <Link
              to="/register"
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Center Form Card */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-lg">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/20 mb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Secure Portal Access</span>
              </div>
              <h1 className="text-2xl font-bold font-poppins text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Sign in with your email credentials to access the fee ledger.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-5 rounded-xl bg-rose-50 border border-rose-200/80 p-3.5 text-xs text-rose-700 font-medium"
              >
                {error.response?.data?.message ||
                  "Invalid email or password. Please verify your credentials."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@school.edu.np"
                    required
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-slate-500">
              <p>
                Student without an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Register here
                </Link>
              </p>
              <Link to="/" className="text-slate-400 hover:text-slate-600 mt-2">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Student Fee Management System. All
        rights reserved.
      </footer>
    </div>
  );
}

export default LoginPage;
