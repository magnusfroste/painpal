import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info, Loader2 } from "lucide-react";
import AddToHomeScreenInfoPopup from "@/components/AddToHomeScreenInfoPopup";

const DEMO_EMAIL = "demo@painpal.com";
const DEMO_PASSWORD = "demo1234";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHomeScreenInfo, setShowHomeScreenInfo] = useState(false);

  useEffect(() => {
    let ignore = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!ignore && session?.user) navigate("/", { replace: true });
    });
    return () => { ignore = true; };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/", { replace: true });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (!error) setError("Check your inbox for a confirmation link, then come back here.");
      else setError(error.message);
    }
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-primary/25 blur-3xl animate-blob" />
        <div className="absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-accent/25 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <div className="mb-5 text-center animate-fade-in">
          <span className="pill bg-primary-soft text-primary">Headache tracking for kids & teens</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">PainPal</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm font-semibold text-muted-foreground">
            Log how you feel in seconds, spot your patterns, and share it all with your doctor.
          </p>
        </div>

        <section className="surface-card w-full p-6 animate-pop-in">
          <video
            src="/yourvideo.mp4"
            className="mb-5 w-full rounded-2xl shadow-soft"
            autoPlay
            loop
            muted
            playsInline
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-base font-semibold outline-none focus:ring-4 focus:ring-ring/25"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              disabled={loading}
            />
            <input
              type="password"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-base font-semibold outline-none focus:ring-4 focus:ring-ring/25"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-gradient-primary font-display text-base font-extrabold text-primary-foreground shadow-glow hover:opacity-95"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </Button>
          </form>

          {error && (
            <p className="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-center text-sm font-semibold text-destructive">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
            className="mt-4 w-full text-sm font-bold text-primary underline-offset-4 hover:underline"
          >
            {mode === "login" ? "No account yet? Sign up" : "Have an account? Log in"}
          </button>

          {mode === "login" && (
            <>
              <p className="mt-4 rounded-2xl bg-muted px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
                Demo login prefilled: <span className="font-mono">{DEMO_EMAIL} / {DEMO_PASSWORD}</span>
              </p>
              <button
                type="button"
                className="tap mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary-soft px-3 py-3 text-sm font-bold text-secondary"
                onClick={() => setShowHomeScreenInfo(true)}
              >
                <Info className="h-4 w-4" />
                Add to Home Screen (iOS)
              </button>
              <AddToHomeScreenInfoPopup open={showHomeScreenInfo} onOpenChange={setShowHomeScreenInfo} />
            </>
          )}
        </section>

        <p className="mt-6 text-center text-xs font-semibold text-muted-foreground">
          PainPal helps you and your doctor understand your headaches.
        </p>
      </div>
    </main>
  );
};

export default Auth;
