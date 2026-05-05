import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import formatApiError from "../lib/apiError";

export default function AdminLogin() {
  const { login, admin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    return <Navigate to="/admin" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      toast.success("Welcome back.");
      navigate("/admin", { replace: true });
    } catch (err) {
      const msg = formatApiError(err?.response?.data?.detail, "Login failed. Please try again.");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border border-[#E5DFD3] focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none px-4 py-3.5 text-[#2D2D2D] placeholder:text-[#9c9c9c] transition-colors";

  return (
    <main
      data-testid="admin-login-page"
      className="min-h-screen bg-[#FAF6EC] grid place-items-center px-6 py-16"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-10 h-10 grid place-items-center border border-[#C5A059] text-[#C5A059] font-display text-xl">
              S
            </span>
            <span className="font-display text-2xl text-[#2D2D2D]">
              Signature Style
            </span>
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#C5A059]">
            Admin Dashboard
          </div>
        </div>

        <form
          data-testid="admin-login-form"
          onSubmit={submit}
          className="bg-white border border-[#E5DFD3] p-8 md:p-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <Lock size={16} className="text-[#C5A059]" strokeWidth={1.5} />
            <h1 className="font-display text-2xl text-[#2D2D2D]">Sign in</h1>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-2 block">
                Email
              </label>
              <input
                data-testid="admin-email-input"
                type="email"
                autoComplete="email"
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-2 block">
                Password
              </label>
              <input
                data-testid="admin-password-input"
                type="password"
                autoComplete="current-password"
                className={inputCls}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            data-testid="admin-login-submit"
            type="submit"
            disabled={submitting}
            className="mt-8 w-full bg-[#C5A059] hover:bg-[#B38F48] disabled:opacity-60 text-white px-8 py-4 flex items-center justify-center gap-3 text-xs tracking-[0.25em] uppercase transition-colors"
          >
            {submitting ? "Signing in..." : "Enter Dashboard"}
            <ArrowRight size={14} strokeWidth={1.5} />
          </button>

          <a
            href="/"
            className="mt-5 block text-center text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] hover:text-[#C5A059] transition-colors"
          >
            ← Back to website
          </a>
        </form>
      </div>
    </main>
  );
}
