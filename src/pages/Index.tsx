
import React, { useState } from "react";
import MigraineStepWizard from "@/components/MigraineStepWizard";
import MigrainHistoryChart from "@/components/MigrainHistoryChart";
import ExportDataButton from "@/components/ExportDataButton";
import InfoButton from "@/components/InfoButton";
import AINurseMascot from "@/components/AINurseMascot";

const Index = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [celebrate, setCelebrate] = useState(false);

  const handleEntryAdd = (entry: any) => {
    setHistory([...history, entry]);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2400);
  };

  // Decide if the user is new or returning (has entries)
  const hasHistory = history.length > 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-b from-blue-200 via-purple-100 to-pink-100 relative font-sans overflow-x-hidden">
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
        </div>
      </main>
      {/* Footer removed for simpler, mobile-friendly scrolling */}
    </div>
  );
};

export default Index;
