
import React, { useState, useEffect } from "react";
import MigraineStepWizard from "@/components/MigraineStepWizard";
import MigrainHistoryChart from "@/components/MigrainHistoryChart";
import ExportDataButton from "@/components/ExportDataButton";
import InfoButton from "@/components/InfoButton";
import AINurseMascot from "@/components/AINurseMascot";
import MigrainePreliminaryAnalysis from "@/components/MigrainePreliminaryAnalysis";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const [saving, setSaving] = useState(false); // Track saving state for UI feedback
  const [celebrate, setCelebrate] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check user, redirect if not logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
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

  // Initial fetch
  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line
  }, []);

  // Add entry to Supabase, then reload all entries from Supabase
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
      const { error } = await supabase
        .from("migraine_entries")
        .insert([insert]);
      if (error) {
        setSaveError(error.message);
        setSaving(false);
        return;
      }
      // Upon successful insert, always reload from Supabase (never trust local append)
      await fetchEntries();
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2400);
    } catch (err: any) {
      setSaveError("Could not save entry. Try refreshing the page.");
    }
    setSaving(false);
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
        <div className="mt-2">
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-2 text-sm rounded-full bg-pink-200 text-pink-900 font-bold hover:bg-pink-300 transition hover-scale shadow inline-block"
          >
            Switch User / Log Out
          </button>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center px-0 py-0">
        <div className="w-full max-w-[440px] flex flex-col items-stretch flex-1 mx-auto">
          <section className="w-full mb-4">
            <div className="rounded-[32px] bg-white/75 shadow-2xl border border-white/60 px-2 pt-4 pb-3">
              <MigraineStepWizard
                onComplete={handleEntryAdd}
                disableAll={saving}
              />
              {saving && (
                <div className="mt-3 text-base text-blue-500 text-center animate-pulse">
                  Saving entry…
                </div>
              )}
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
