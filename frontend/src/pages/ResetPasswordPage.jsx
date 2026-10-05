import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { resetPassword } from "../features/auth/auth.api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");
    if (newPassword.length < 8) return setError("Password must be at least 8 characters.");
    setPending(true);
    try {
      await resetPassword({ token, newPassword });
      navigate("/login", { replace: true, state: { passwordReset: true } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not reset your password. Request a new reset link.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-parchment font-body lg:grid lg:grid-cols-2">
      <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex xl:p-16" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(255,255,255,0.045) 32px)" }}>
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-brass/20" />
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-brass/20" />
        <Link to="/" className="relative z-10 inline-block w-fit"><p className="mb-2 text-xs uppercase tracking-[0.22em] text-brass">Accounts Office</p><h2 className="font-display text-2xl font-semibold leading-tight">Student Fee<br />Management</h2></Link>
        <div className="relative z-10 max-w-md">
          <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-brass/60 bg-white/5 text-brass"><ShieldCheck className="h-8 w-8" /></div>
          <p className="mb-3 font-display text-3xl leading-tight">A fresh start<br />for your account.</p>
          <p className="max-w-sm text-sm leading-6 text-slate-300">Create a strong password you haven’t used for this account before.</p>
        </div>
        <p className="relative z-10 text-xs text-slate-400">&copy; {new Date().getFullYear()} SFM Ledger. All rights reserved.</p>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/login" className="mb-8 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs font-semibold text-slate transition hover:border-ink/30 hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" />Back to sign in</Link>
          <div className="rounded-2xl border border-ink/5 bg-white p-6 shadow-[0_24px_70px_-36px_rgba(22,31,43,0.28)] sm:p-9">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brass/10 text-ink"><Lock className="h-5 w-5" /></div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brass">Secure account</p>
            <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Set a new password</h1>
            <p className="mb-7 text-sm leading-6 text-slate">Choose a strong password with at least 8 characters.</p>
            {!token ? (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="mb-2 font-semibold text-rust">This link is incomplete</p>
                <p className="mb-4 text-sm leading-6 text-rust">Request a new reset link and open it from your email.</p>
                <Link to="/forgot-password" className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline underline-offset-4">Request another link</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="newPassword" className="mb-2 block text-xs font-semibold text-ink">New password</label>
                  <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-parchment/50 px-4 transition focus-within:border-brass focus-within:ring-4 focus-within:ring-brass/10"><Lock className="h-4 w-4 shrink-0 text-slate" /><input id="newPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} disabled={pending} placeholder="At least 8 characters" className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate/60" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="rounded p-1 text-slate hover:text-ink" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate"><CheckCircle2 className={`h-3.5 w-3.5 ${newPassword.length >= 8 ? "text-emerald-600" : "text-slate/50"}`} />At least 8 characters</p>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-xs font-semibold text-ink">Confirm new password</label>
                  <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-parchment/50 px-4 transition focus-within:border-brass focus-within:ring-4 focus-within:ring-brass/10"><Lock className="h-4 w-4 shrink-0 text-slate" /><input id="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={pending} placeholder="Enter the password again" className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate/60" /></div>
                </div>
                {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-rust">{error}</p>}
                <button type="submit" disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:opacity-60">{pending && <Loader2 className="h-4 w-4 animate-spin" />}{pending ? "Updating password..." : "Update password"}</button>
              </form>
            )}
          </div>
          <p className="mt-6 text-center text-xs text-slate">Your password is encrypted and kept private.</p>
        </div>
      </section>
    </main>
  );
}
