import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in / 登入 — Flight Price Notifier 機價通知" },
      { name: "description", content: "Sign in to Flight Price Notifier to set route alerts and get fare-drop emails." },
      { property: "og:title", content: "Sign in — Flight Price Notifier 機價通知" },
      { property: "og:description", content: "Sign in to set route alerts and get fare-drop emails." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setConfirmSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/alerts" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5">
      <div className="absolute -top-10 -right-14 size-72 rounded-full bg-blossom/70 blur-2xl" />
      <div className="absolute -bottom-16 -left-16 size-72 rounded-full bg-mint blur-2xl" />

      <div className="relative w-full max-w-md animate-slide">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <span className="font-display text-lg leading-none">✈</span>
          </div>
          <div className="leading-none">
            <p className="font-display text-[15px] font-semibold text-foreground">Flight Price Notifier</p>
            <p className="font-mono text-[11px] text-muted-foreground">機價通知</p>
          </div>
        </Link>

        <div className="rounded-[28px] bg-white/90 p-7 ring-1 ring-border">
          {confirmSent ? (
            <div className="text-center">
              <div className="mx-auto grid size-12 animate-pop place-items-center rounded-full bg-mint text-xl">
                ✉
              </div>
              <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">Check your email 收信確認</h1>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                We sent a confirmation link to <span className="font-mono text-foreground">{email}</span>. Click it to
                finish signing up, then come back to sign in.
              </p>
              <button
                onClick={() => {
                  setConfirmSent(false);
                  setMode("signin");
                }}
                className="mt-6 w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                {mode === "signin" ? "Welcome back 歡迎回來" : "Create your account 建立帳號"}
              </h1>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to manage your fare alerts."
                  : "Set a route and a target price — we'll email you the drop."}
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Email 電子郵件
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Password 密碼
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {busy ? "…" : mode === "signin" ? "Sign in / 登入" : "Sign up / 註冊"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm font-semibold text-muted-foreground">
                {mode === "signin" ? "No account yet? 還沒有帳號？" : "Already have an account? 已有帳號？"}{" "}
                <button
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {mode === "signin" ? "Sign up 註冊" : "Sign in 登入"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
