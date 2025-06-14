
import React, { useState } from "react";
import MigraineStepWizard from "@/components/MigraineStepWizard";
import MigrainHistoryChart from "@/components/MigrainHistoryChart";
import ExportDataButton from "@/components/ExportDataButton";
import InfoButton from "@/components/InfoButton";
import AINurseMascot from "@/components/AINurseMascot";

// Mobile app look and feel
const Index = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [celebrate, setCelebrate] = useState(false);

  const handleEntryAdd = (entry: any) => {
    setHistory([...history, entry]);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-blue-200 via-purple-100 to-pink-100 relative font-sans">
      <header className="w-full flex flex-col items-center pt-6 mb-2">
        <AINurseMascot variant={celebrate ? "celebrate" : "normal"} />
      </header>

      <main className="flex-1 w-full flex flex-col items-center px-2 py-0">
        <div className="w-full max-w-[430px] flex flex-col items-stretch flex-1">
          <section className="mb-2 w-full">
            <MigraineStepWizard onComplete={handleEntryAdd} />
            {celebrate && (
              <div className="mt-3 text-xl font-bold text-green-600 animate-bounce text-center">
                🎉 Thanks! <br /> Collecting this data is super helpful!
              </div>
            )}
          </section>
          {/* Info Buttons */}
          <aside className="mt-4 mb-2 w-full flex flex-col items-center gap-2">
            <div className="text-lg font-extrabold text-purple-800 mb-1">Learn more:</div>
            <div className="w-full flex flex-row flex-wrap gap-2 justify-center">
              <InfoButton type="what" />
              <InfoButton type="tips" />
              <InfoButton type="parents" />
              <InfoButton type="safe" />
            </div>
          </aside>
          <div className="pb-32" />
        </div>
      </main>

      {/* Sticky bottom actions */}
      <footer className="fixed bottom-0 left-0 w-full z-30 flex flex-col items-center bg-gradient-to-t from-white/70 to-transparent pb-6 pt-3 px-2">
        <div className="w-full max-w-[430px] mx-auto flex flex-col items-center gap-2">
          <ExportDataButton history={history} />
          {/* History chart stays mobile friendly */}
          <div className="w-full max-w-[420px] rounded-2xl bg-white/80 py-2 px-1 shadow-sm">
            <MigrainHistoryChart history={history} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
