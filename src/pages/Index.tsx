
import React, { useState, useEffect } from "react";
import MigraineStepWizard from "@/components/MigraineStepWizard";
import MigrainHistoryChart from "@/components/MigrainHistoryChart";
import ExportDataButton from "@/components/ExportDataButton";
import InfoButton from "@/components/InfoButton";
import AINurseMascot from "@/components/AINurseMascot";
import MigrainePreliminaryAnalysis from "@/components/MigrainePreliminaryAnalysis";
import { supabase } from "@/integrations/supabase/client";

// Toast-like component (quick inline for now)
const ErrorToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 font-bold">
    <span>⚠️ {message}</span>
    <button onClick={onClose} className="ml-4 underline text-white">Dismiss</button>
  </div>
);

const Index = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [celebrate, setCelebrate] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load migraine entries from Supabase for the current user
  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      // If there's no real user_id, fetch nothing (inform user below)
      try {
        const { data, error } = await supabase
          .from("migraine_entries")
          .select("*")
          .order("timestamp", { ascending: true });
        if (data) setHistory(data);
      } catch (e) {
        // Do nothing for now
      }
      setLoading(false);
    }
    fetchEntries();
    // Optionally listen for real-time changes here if desired
  }, []);

  // Add entry to Supabase
  const handleEntryAdd = async (entry: any) => {
    // You must log in for headaches to be saved!
    const NO_AUTH_EXPLANATION =
      "Headache entries can only be saved if you are logged in. Please enable authentication for real saving!";
    // Instead of using 'anon-user' (not a valid UUID), check if user id is available
    // Here, we just simulate so the wizard resets, but give the correct error.
    setSaveError(NO_AUTH_EXPLANATION);
    // Optionally set celebrate to false if you want, or skip it

    // The following code will not insert to DB, since RLS and table require a UUID. Uncomment when auth is live.
    /*
    const insert = { ...entry, user_id: userIdFromSession }; // Replace with actual user id
    const { data, error } = await supabase
      .from("migraine_entries")
      .insert([insert])
      .select();
    if (data && !error) {
      setHistory([...history, ...data]);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2400);
    } else if (error) {
      setSaveError(error.message);
    }
    */
  };

  // Decide if the user is new or returning (has entries)
  const hasHistory = history.length > 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-b from-blue-200 via-purple-100 to-pink-100 relative font-sans overflow-x-hidden">
      {saveError && (
        <ErrorToast
          message={saveError}
          onClose={() => setSaveError(null)}
        />
      )}
      {/* "Apple style" blurred top bar */}
      <header className="w-full z-40 flex flex-col items-center pt-8 mb-3">
        <div className="w-full max-w-[440px] backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl px-4 py-1 mx-2 mb-3 border border-white/50">
          <AINurseMascot
            variant={
              celebrate ? "celebrate"
                : hasHistory ? "welcome"
                : "normal"
            }
          />
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center px-0 py-0">
        <div className="w-full max-w-[440px] flex flex-col items-stretch flex-1 mx-auto">
          <section className="w-full mb-4">
            <div className="rounded-[32px] bg-white/75 shadow-2xl border border-white/60 px-2 pt-4 pb-3">
              <MigraineStepWizard onComplete={handleEntryAdd} />
              {celebrate && (
                <div className="mt-3 text-xl font-bold text-green-600 animate-bounce text-center">
                  🎉 Thanks! <br /> Collecting this data is super helpful!
                </div>
              )}
            </div>
          </section>
          {/* Loading state for Supabase fetch */}
          {loading ? (
            <div className="mb-6 text-sm text-blue-500 text-center">Loading your headache history…</div>
          ) : (
            <>
              {/* Analysis appears after wizard, before 'Learn more' */}
              <MigrainePreliminaryAnalysis history={history} />
              {/* Info Buttons */}
              <aside className="mt-5 mb-2 w-full flex flex-col items-center gap-2">
                <div className="text-lg font-extrabold text-purple-800 mb-1">Learn more:</div>
                <div className="w-full flex flex-row flex-wrap gap-3 justify-center">
                  <InfoButton type="what" />
                  <InfoButton type="tips" />
                  <InfoButton type="parents" />
                  <InfoButton type="safe" />
                </div>
              </aside>
              {/* Export and History moved from footer to main scrollable content */}
              <div className="mt-4 flex flex-col gap-4">
                <ExportDataButton history={history} />
                <div className="w-full rounded-2xl bg-white/80 py-2 px-2 shadow-sm">
                  <MigrainHistoryChart history={history} />
                </div>
              </div>
              <div className="py-10" />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
