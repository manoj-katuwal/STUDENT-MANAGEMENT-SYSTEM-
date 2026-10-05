import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react";
import { requestPasswordReset } from "../features/auth/auth.api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not send the reset link. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-parchment font-body lg:grid lg:grid-cols-2">
      <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex xl:p-16" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(255,255,255,0.045) 32px)" }}>
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-brass/20" />
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-brass/20" />
        <Link to="/" className="relative z-10 inline-block w-fit">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-brass">Accounts Office</p>
          <h2 className="font-display text-2xl font-semibold leading-tight">Student Fee<br />Management</h2>
        </Link>
        <div className="relative z-10 max-w-md">
          <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-brass/60 bg-white/5 text-brass"><ShieldCheck className="h-8 w-8" /></div>
          <p className="mb-3 font-display text-3xl leading-tight">Your account,<br />securely restored.</p>
          <p className="max-w-sm text-sm leading-6 text-slate-300">We’ll send a private, time-limited link to the email address on your account.</p>
        </div>
        <p className="relative z-10 text-xs text-slate-400">&copy; {new Date().getFullYear()} SFM Ledger. All rights reserved.</p>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/login" className="mb-8 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs font-semibold text-slate transition hover:border-ink/30 hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" />Back to sign in</Link>
          <div className="rounded-2xl border border-ink/5 bg-white p-6 shadow-[0_24px_70px_-36px_rgba(22,31,43,0.28)] sm:p-9">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brass/10 text-ink"><Mail className="h-5 w-5" /></div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brass">Account recovery</p>
            <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Forgot password?</h1>
            <p className="mb-7 text-sm leading-6 text-slate">Enter the email linked to your account. We’ll send you a link to choose a new password.</p>
            {submitted ? (
              <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="mb-3 flex items-center gap-2 font-semibold text-emerald-900"><CheckCircle2 className="h-5 w-5" />Check your inbox</div>
                <p className="text-sm leading-6 text-emerald-800">If an account with that email exists, a reset link has been sent. Please check your inbox and spam folder.</p>
                <div className="mt-4 flex items-center gap-2 border-t border-emerald-200 pt-4 text-xs text-emerald-800"><Check className="h-4 w-4" />The link is valid for 15 minutes.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-semibold text-ink">Email address</label>
                  <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-parchment/50 px-4 transition focus-within:border-brass focus-within:ring-4 focus-within:ring-brass/10"><Mail className="h-4 w-4 shrink-0 text-slate" /><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} disabled={pending} placeholder="you@school.edu" className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate/60" /></div>
                </div>
                {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-rust">{error}</p>}
                <button type="submit" disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:opacity-60">{pending && <Loader2 className="h-4 w-4 animate-spin" />}{pending ? "Sending secure link..." : "Send reset link"}</button>
              </form>
            )}
          </div>
          <p className="mt-6 text-center text-xs text-slate">Need help? Contact your school’s accounts office.</p>
        </div>
      </section>
    </main>
  );
}
