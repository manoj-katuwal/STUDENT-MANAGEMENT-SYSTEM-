import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin } from "../features/auth/auth.hooks";

function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(formData, {
      onSuccess: () => navigate("/"),
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
        </div>

        <div className="flex flex-col items-start gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-brass"
            style={{ transform: "rotate(-8deg)" }}
          >
            <span className="text-2xl text-brass font-display">SFM</span>
          </div>
          <p className="text-sm max-w-xs text-slate-300">
            Every fee, discount and receipt — recorded and reconciled in one
            ledger.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Compact mark for mobile, where the left panel is hidden */}
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
              <div className="flex items-center gap-2 pb-2 border-b-2 border-hairline focus-within:border-brass transition-colors duration-200 motion-reduce:transition-none">
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
                  className="w-full bg-transparent text-sm outline-none disabled:opacity-60 text-ink focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2"
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
              <div className="flex items-center gap-2 pb-2 border-b-2 border-hairline focus-within:border-brass transition-colors duration-200 motion-reduce:transition-none">
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
                  className="w-full bg-transparent text-sm outline-none disabled:opacity-60 text-ink focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="shrink-0 text-slate outline-none focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
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
              className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 bg-ink hover:bg-ink-hover outline-none focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
