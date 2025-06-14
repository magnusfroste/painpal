
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col justify-start items-center pb-24 animate-fade-in">
      <header className="pt-2 mb-2 mt-6">
        <AINurseMascot variant={celebrate ? "celebrate" : "normal"} />
      </header>

      <div className="w-full flex flex-col-reverse lg:flex-row gap-6 max-w-6xl">
        <main className="flex-1 flex flex-col gap-4 items-center">
          <section className="mb-2">
            <MigraineStepWizard onComplete={handleEntryAdd} />
            {celebrate && (
              <div className="mt-3 text-xl font-bold text-green-600 animate-bounce text-center">
                🎉 Thanks! <br /> Collecting this data is super helpful!
              </div>
            )}
          </section>
          <ExportDataButton history={history} />
          <MigrainHistoryChart history={history} />
        </main>
        <aside className="flex flex-col items-center gap-3 mb-6 lg:mb-0">
          <div className="text-lg font-bold text-purple-800 mb-1">Learn more:</div>
          <div className="flex flex-row flex-wrap gap-3">
            <InfoButton type="what" />
            <InfoButton type="tips" />
            <InfoButton type="parents" />
            <InfoButton type="safe" />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;
