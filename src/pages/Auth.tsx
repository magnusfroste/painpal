import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import AddToHomeScreenInfoPopup from "@/components/AddToHomeScreenInfoPopup";

// You can use a suitable royalty-free image here (replace the src if needed)
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"; // smiling mother and daughter drinking water

const DEMO_EMAIL = "demo@painpal.com";
const DEMO_PASSWORD = "123456";

const VALUE_PROP = (
  <>
    <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2 text-center animate-fade-in">PainPal</h1>
    <p className="text-base md:text-lg text-gray-800 mb-5 text-center max-w-xs mx-auto animate-fade-in delay-100">
      Track your migraines effortlessly. Share your journey with your doctor, discover helpful insights, and reclaim your life!
    </p>
  </>
);

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHomeScreenInfo, setShowHomeScreenInfo] = useState(false);

  // Check if already logged in
  useEffect(() => {
    let ignore = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!ignore && session?.user) {
        navigate("/", { replace: true });
      }
    });
    return () => { ignore = true; };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else navigate("/", { replace: true });
    } else {
      // For signup, always provide emailRedirectTo per Supabase best practice:
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (!error) {
        setError("Check your inbox for a login link, then return here.");
      } else {
        setError(error.message);
      }
      // Optionally: Switch to login mode after successful signup.
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-pink-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="mx-auto flex flex-col items-center rounded-3xl shadow-2xl bg-white/95 border border-white/60 w-full max-w-md px-7 py-10">
        {VALUE_PROP}
        <img
          src={HERO_IMAGE}
          alt="Person using a laptop, relaxed"
          className="rounded-xl w-full max-w-xs mb-4 shadow-md animate-fade-in"
        />
        {/* Show info icon/button for the login page (demo users) */}
        {mode === "login" && (
          <div className="flex justify-center mb-4">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm text-blue-900 font-medium transition animate-fade-in"
              onClick={() => setShowHomeScreenInfo(true)}
            >
              <Info className="w-5 h-5" />
              How to install on Home Screen (iOS)
            </button>
            <AddToHomeScreenInfoPopup
              open={showHomeScreenInfo}
              onOpenChange={setShowHomeScreenInfo}
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto flex flex-col gap-4">
          <input
            type="email"
            autoFocus
            className="rounded-lg border px-4 py-2 w-full mt-3 text-base"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            disabled={loading}
          />
          <input
            type="password"
            className="rounded-lg border px-4 py-2 w-full text-base"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />
          <Button
            type="submit"
            className="w-full font-bold mt-1"
            disabled={loading}
          >
            {loading ? (mode === "login" ? "Logging in…" : "Signing up…")
              : mode === "login" ? "Log In" : "Register"}
          </Button>
        </form>
        <div className="my-3" />
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
          }}
          className="text-blue-700 underline text-sm hover:font-bold transition-all mt-1"
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Have an account? Log in"}
        </button>
        {mode === "login" && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            Demo login prefilled: <br />
            <span className="font-mono bg-blue-50 rounded px-1 py-0.5 text-sm">
              demo@painpal.com / 123456
            </span>
          </div>
        )}
        {error && (
          <div className="mt-2 rounded bg-red-100 border border-red-300 px-3 py-2 text-red-700 text-sm text-center animate-fade-in">
            {error}
          </div>
        )}
      </div>
      <div className="fixed bottom-2 left-0 right-0 text-center flex justify-center">
        <span className="text-xs text-gray-400 mx-auto">PainPal PoC – No email confirmation required for demo account</span>
      </div>
    </div>
  );
};

export default Auth;
