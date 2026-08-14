import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import HomeTabs from "@/components/HomeTabs";
import AINurseMascot from "@/components/AINurseMascot";
import { LogOut, X } from "lucide-react";

const TAB_MASCOT_MAP: Record<
  string,
  { variant: "normal" | "analysis" | "learn" | "history" | "celebrate" | "welcome"; message: string }
> = {
  track: {
    variant: "normal",
    message: "Let's track your headache — tap the answer that fits best 👍",
  },
  analysis: {
    variant: "analysis",
    message: "Here's what your data reveals. Patterns are power! 📊",
  },
  learn: {
    variant: "learn",
    message: "Boost your knowledge and feel more in control 🌟",
  },
  history: {
    variant: "history",
    message: "This is your journey so far. Keep going! 🌈",
  },
  celebrate: {
    variant: "celebrate",
    message: "Thanks for sharing! This helps your doctor help you 🌈",
  },
  welcome: {
    variant: "welcome",
    message: "Welcome back, superstar! I'm here whenever you need me 🤗",
  },
};

const Index = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("track");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/auth");
    });
  }, [navigate]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setHistory([]);
      } else {
        const { data, error } = await supabase
          .from("migraine_entries")
          .select("*")
          .eq("user_id", session.user.id)
          .order("timestamp", { ascending: true });
        if (error) {
          setSaveError("Unable to load your migraine history.");
          setHistory([]);
        } else if (data) {
          setHistory(data);
        }
      }
    } catch (e) {
      setSaveError("Something went wrong loading your history.");
      setHistory([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line
  }, []);

  const handleEntryAdd = async (entry: any) => {
    setSaving(true);
    setSaveError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setSaveError("You must be logged in to save headache entries.");
        setSaving(false);
        return;
      }
      const insert = { ...entry, user_id: session.user.id };
      const { error } = await supabase.from("migraine_entries").insert([insert]);
      if (error) {
        setSaveError(error.message);
        setSaving(false);
        return;
      }
      await fetchEntries();
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2400);
    } catch (err: any) {
      setSaveError("Could not save entry. Try refreshing the page.");
    }
    setSaving(false);
    setWizardOpen(false);
    setTimeout(() => setWizardOpen(true), 2000);
  };

  useEffect(() => {
    if (celebrate) {
      const timer = setTimeout(() => setActiveTab("analysis"), 1100);
      return () => clearTimeout(timer);
    }
  }, [celebrate]);

  const mascotProps = celebrate
    ? TAB_MASCOT_MAP["celebrate"]
    : TAB_MASCOT_MAP[activeTab] || TAB_MASCOT_MAP["track"];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-secondary/20 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
      </div>

      {saveError && (
        <div className="fixed left-1/2 top-4 z-50 flex w-[min(100%-2rem,420px)] -translate-x-1/2 items-start gap-3 rounded-2xl bg-destructive px-4 py-3 text-sm font-bold text-destructive-foreground shadow-card animate-pop-in">
          <span className="flex-1">⚠️ {saveError}</span>
          <button onClick={() => setSaveError(null)} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[440px] flex-col px-4 safe-top">
        <header className="flex items-center justify-between pb-3 pt-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">PainPal</p>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-foreground">
              Hi there 👋
            </h1>
          </div>
          <button
            onClick={handleSignOut}
            aria-label="Log out"
            className="tap grid h-11 w-11 place-items-center rounded-2xl bg-card/80 text-muted-foreground shadow-soft backdrop-blur"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <div className="surface-card mb-4 px-4 py-3 animate-fade-in">
          <AINurseMascot variant={mascotProps.variant} message={mascotProps.message} />
        </div>

        <main className="flex-1 pb-32">
          <HomeTabs
            history={history}
            loading={loading}
            saving={saving}
            celebrate={celebrate}
            handleEntryAdd={handleEntryAdd}
            isMobile={isMobile}
            setWizardOpen={setWizardOpen}
            wizardOpen={wizardOpen}
            onTabChange={setActiveTab}
            activeTab={activeTab}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
