import React, { useState, useEffect } from "react";
import MigraineStepWizard from "@/components/MigraineStepWizard";
import MigrainHistoryChart from "@/components/MigrainHistoryChart";
import ExportDataButton from "@/components/ExportDataButton";
import InfoButton from "@/components/InfoButton";
import AINurseMascot from "@/components/AINurseMascot";
import MigrainePreliminaryAnalysis from "@/components/MigrainePreliminaryAnalysis";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import AddToHomeScreenBanner from "@/components/AddToHomeScreenBanner";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import HomeTabs from "@/components/HomeTabs";

/** Toast-like component (quick inline for now) */
const ErrorToast = ({
  message,
  onClose
}: {
  message: string;
  onClose: () => void;
}) => <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 font-bold">
    <span>⚠️ {message}</span>
    <button onClick={onClose} className="ml-4 underline text-white">Dismiss</button>
  </div>;

// Header friendly message for each tab
const TAB_HEADER_MAP: Record<string, string> = {
  track: "Welcome back, superstar! I’m here to help whenever you need me 🤗",
  analysis: "Let’s discover some insights together from your data 📈",
  learn: "Level up your knowledge — learn, get tips and feel empowered! 🧠",
  history: "Here is your journey so far. Keep tracking for revealing patterns! 🌈",
};

// New: mascot variant and text for each tab
const TAB_MASCOT_MAP: Record<
  string,
  { variant: "normal" | "analysis" | "learn" | "history" | "celebrate" | "welcome"; message: string }
> = {
  track: {
    variant: "normal",
    message: "Let's track your headache or migraine! Just hit the button below when you're ready 👍",
  },
  analysis: {
    variant: "analysis",
    message:
      "Here's what your tracked data reveals. Understanding your patterns is key! 📊",
  },
  learn: {
    variant: "learn",
    message:
      "Boost your knowledge! Learn about headaches, get tips, and empower yourself. 🌟",
  },
  history: {
    variant: "history",
    message:
      "This is your journey so far. The more you track, the more you'll discover! 🌈",
  },
  // fallback for celebrate/welcome if needed
  celebrate: {
    variant: "celebrate",
    message: "Thank you for sharing! This info will help your doctor help you! 🌈",
  },
  welcome: {
    variant: "welcome",
    message: "Welcome back, superstar! I’m here to help whenever you need me 🤗",
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

  // Check user, redirect if not logged in
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: { session }
    }) => {
      if (!session?.user) navigate("/auth");
    });
  }, [navigate]);

  // Helper: fetch all entries in the table for the current user (ordered chronologically)
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setHistory([]);
      } else {
        const { data, error } = await supabase.from("migraine_entries").select("*").eq("user_id", session.user.id).order("timestamp", { ascending: true });
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
    setWizardOpen(false); // close drawer after saving (mobile)
    setTimeout(() => setWizardOpen(true), 2000); // allow quick re-add
  };

  // Mascot logic
  const mascotProps =
    celebrate
      ? TAB_MASCOT_MAP["celebrate"]
      : activeTab && TAB_MASCOT_MAP[activeTab]
      ? TAB_MASCOT_MAP[activeTab]
      : TAB_MASCOT_MAP["track"];

  // Add this function to handle proper sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-b from-blue-200 via-purple-100 to-pink-100 relative font-sans overflow-x-hidden
      sm:pt-safe sm:pb-safe">
      <AddToHomeScreenBanner />
      {saveError && <ErrorToast message={saveError} onClose={() => setSaveError(null)} />}
      {/* "Apple style" blurred top bar */}
      <header className="w-full z-40 flex flex-col items-center pt-8 mb-3 py-[5px]">
        <div className="w-full max-w-[440px] backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl py-1 mx-2 mb-3 border border-white/50 px-[8px]">
          <AINurseMascot variant={mascotProps.variant} message={mascotProps.message} />
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col items-center px-0 py-0 pb-24">
        <div className="w-full max-w-[440px] flex flex-col items-stretch flex-1 mx-auto">
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
          />
          <div className="py-[10px]" />
        </div>
      </main>
      {/* Sticky Switch User / Log Out button at bottom center */}
      <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center pointer-events-none w-full">
        <button onClick={handleSignOut} className="pointer-events-auto px-6 py-2 text-sm rounded-full bg-pink-200 text-pink-900 font-bold hover:bg-pink-300 transition hover-scale shadow inline-block" style={{
          maxWidth: 440,
          width: "90%"
        }}>
          Switch User / Log Out
        </button>
      </div>
    </div>
  );
};
export default Index;
