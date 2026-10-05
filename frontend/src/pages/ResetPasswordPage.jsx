import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { resetPassword } from "../features/auth/auth.api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <main className="min-h-screen flex items-center justify-center bg-parchment px-6 py-12 font-body">
      <section className="w-full max-w-sm">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-slate hover:text-ink"><ArrowLeft className="h-4 w-4" />Back to sign in</Link>
        <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Set a new password</h1>
        <p className="mb-8 text-sm text-slate">Choose a new password with at least 8 characters.</p>
        {!token && <p role="alert" className="mb-5 rounded-md bg-red-50 p-3 text-sm text-rust">This reset link is missing its token. Request a new one.</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate">New password</label>
            <div className="flex items-center gap-2 border-b-2 border-slate/30 pb-2 focus-within:border-brass"><Lock className="h-4 w-4 text-slate" /><input id="newPassword" type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} disabled={pending || !token} className="w-full bg-transparent text-sm text-ink outline-none" /></div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate">Confirm password</label>
            <div className="flex items-center gap-2 border-b-2 border-slate/30 pb-2 focus-within:border-brass"><Lock className="h-4 w-4 text-slate" /><input id="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={pending || !token} className="w-full bg-transparent text-sm text-ink outline-none" /></div>
          </div>
          {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-rust">{error}</p>}
          <button type="submit" disabled={pending || !token} className="flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">{pending && <Loader2 className="h-4 w-4 animate-spin" />}{pending ? "Updating password..." : "Update password"}</button>
        </form>
      </section>
    </main>
  );
}
