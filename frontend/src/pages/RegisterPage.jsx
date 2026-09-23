import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { useRegister } from "../features/auth/auth.hooks";
import { useAuth } from "../features/auth/auth.context";

function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { mutate: register, isPending, error } = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "STUDENT",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      setFormError("Email is required");
      return;
    }

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    register(
      {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        password: formData.password,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      },
    );
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
          <div>
            <p className="text-lg font-display text-white font-semibold mb-2">
              User Registration
            </p>
            <p className="text-sm max-w-xs text-slate-300">
              Create an institutional account (Student, Accountant, Principal,
              or Admin) to access the fee ledger.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} SFM Ledger. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Back to Home Link (Top) */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

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

          {isSuccess ? (
            <div className="rounded-lg bg-white p-8 text-center border border-slate/20 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-display font-semibold text-ink">
                Account Created
              </h2>
              <p className="mt-2 text-sm text-slate">
                Your <strong className="text-ink">{formData.role}</strong>{" "}
                account for{" "}
                <strong className="text-ink">{formData.email}</strong> has been
                registered successfully.
              </p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-6 w-full rounded-md px-4 py-3 text-sm font-semibold text-white bg-ink hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl mb-2 font-display font-semibold text-ink">
                Register
              </h1>
              <p className="mb-8 text-sm text-slate">
                Create your account to access the fee management system.
              </p>

              {(formError || error) && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="mb-6 rounded-md p-3 text-sm bg-red-50 text-rust"
                >
                  {formError ||
                    error?.response?.data?.message ||
                    "Registration failed. Please try again."}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    Full Name
                  </label>
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-slate/30 focus-within:border-brass transition-colors duration-200">
                    <User className="w-4 h-4 shrink-0 text-slate" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ram Bahadur Thapa"
                      required
                      disabled={isPending}
                      className="w-full bg-transparent text-sm outline-none disabled:opacity-60 text-ink"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    Email Address
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

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    Account Role
                  </label>
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-slate/30 focus-within:border-brass transition-colors duration-200">
                    <Shield className="w-4 h-4 shrink-0 text-slate" />
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={isPending}
                      className="w-full bg-transparent text-sm outline-none disabled:opacity-60 text-ink cursor-pointer"
                    >
                      <option value="STUDENT" className="bg-parchment text-ink">
                        Student / Parent
                      </option>
                      <option
                        value="ACCOUNTANT"
                        className="bg-parchment text-ink"
                      >
                        Accountant (Finance & Cash Counter)
                      </option>
                      <option
                        value="PRINCIPAL"
                        className="bg-parchment text-ink"
                      >
                        Principal (Executive Read-Only)
                      </option>
                      <option value="ADMIN" className="bg-parchment text-ink">
                        Administrator (Full Control)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Password */}
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
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      required
                      disabled={isPending}
                      className="w-full bg-transparent text-sm outline-none disabled:opacity-60 text-ink"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="shrink-0 text-slate outline-none"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    Confirm Password
                  </label>
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-slate/30 focus-within:border-brass transition-colors duration-200">
                    <Lock className="w-4 h-4 shrink-0 text-slate" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      required
                      disabled={isPending}
                      className="w-full bg-transparent text-sm outline-none disabled:opacity-60 text-ink"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="shrink-0 text-slate outline-none"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 bg-ink hover:bg-slate-800 mt-6"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isPending ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-8 flex flex-col items-center gap-2 text-center text-xs text-slate">
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-ink underline hover:text-brass"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
