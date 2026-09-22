import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
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
    <div className="min-h-screen w-full flex bg-parchment font-body">
      {/* Left ledger panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-ink"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(255,255,255,0.06) 28px)",
        }}
      >
        <div>
          <Link to="/" className="inline-block">
            <p
              className="text-xs uppercase tracking-widest mb-2 text-brass"
              style={{ letterSpacing: "0.2em" }}
            >
              Accounts Office
            </p>
            <h2 className="text-2xl text-white font-display font-semibold">
              Student Fee
              <br />
              Management
            </h2>
          </Link>
        </div>

        <div className="flex flex-col items-start gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-brass"
            style={{ transform: "rotate(-8deg)" }}
          >
            <span className="text-2xl text-brass font-display font-bold">
              SFM
            </span>
          </div>
          <p className="text-sm max-w-xs text-slate-300">
            Every fee, discount and receipt — recorded and reconciled in one
            ledger.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} SFM Ledger. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Compact mark for mobile */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-brass"
              style={{ transform: "rotate(-8deg)" }}
            >
              <span className="text-xs font-semibold text-brass">SFM</span>
            </div>
            <p
              className="text-xs uppercase tracking-widest text-slate"
              style={{ letterSpacing: "0.15em" }}
            >
              Accounts Office
            </p>
          </div>

          <h1 className="text-3xl mb-2 font-display font-semibold text-ink">
            Sign in
          </h1>
          <p className="mb-8 text-sm text-slate">
            Enter your credentials to access the fee ledger.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate"
                style={{ letterSpacing: "0.08em" }}
              >
                Email
              </label>
              <div className="flex items-center gap-2 pb-2 border-b-2 border-slate/30 focus-within:border-brass transition-colors duration-200">
                <Mail className="w-4 h-4 shrink-0 text-slate" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@school.edu"
                  required
                  disabled={isPending}
                  className="w-full bg-transparent text-sm outline-none disabled:opacity-60 text-ink"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate"
                style={{ letterSpacing: "0.08em" }}
              >
                Password
              </label>
              <div className="flex items-center gap-2 pb-2 border-b-2 border-slate/30 focus-within:border-brass transition-colors duration-200">
                <Lock className="w-4 h-4 shrink-0 text-slate" />
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
                  className="w-full bg-transparent text-sm outline-none disabled:opacity-60 text-ink"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="shrink-0 text-slate outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                aria-live="polite"
                className="rounded-md p-3 text-sm bg-red-50 text-rust"
              >
                {error.response?.data?.message ||
                  "Login failed. Please try again."}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 bg-ink hover:bg-slate-800"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-2 text-center text-xs text-slate">
            <p>
              Student without an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-ink underline hover:text-brass"
              >
                Register here
              </Link>
            </p>
            <Link to="/" className="text-slate hover:text-ink mt-2">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
