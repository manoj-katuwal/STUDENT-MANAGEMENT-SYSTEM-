import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
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
    <main className="min-h-screen flex items-center justify-center bg-parchment px-6 py-12 font-body">
      <section className="w-full max-w-sm">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-slate hover:text-ink"><ArrowLeft className="h-4 w-4" />Back to sign in</Link>
        <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Forgot password?</h1>
        <p className="mb-8 text-sm text-slate">Enter the email address linked to your account and we’ll send a password reset link.</p>
        {submitted ? (
          <div role="status" className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">If an account with that email exists, a password reset link has been sent. Check your inbox.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate">Email</label>
              <div className="flex items-center gap-2 border-b-2 border-slate/30 pb-2 focus-within:border-brass"><Mail className="h-4 w-4 text-slate" /><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} disabled={pending} placeholder="you@school.edu" className="w-full bg-transparent text-sm text-ink outline-none" /></div>
            </div>
            {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-rust">{error}</p>}
            <button type="submit" disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">{pending && <Loader2 className="h-4 w-4 animate-spin" />}{pending ? "Sending link..." : "Send reset link"}</button>
          </form>
        )}
      </section>
    </main>
  );
}
