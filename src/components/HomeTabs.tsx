import React from "react";
import MigraineStepWizard from "@/components/MigraineStepWizard";
import MigrainePreliminaryAnalysis from "@/components/MigrainePreliminaryAnalysis";
import InfoButton from "@/components/InfoButton";
import ExportDataButton from "@/components/ExportDataButton";
import MigrainHistoryChart from "@/components/MigrainHistoryChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Typing for props from Index.tsx
interface HomeTabsProps {
  history: any[];
  loading: boolean;
  saving: boolean;
  celebrate: boolean;
  handleEntryAdd: (entry: any) => void;
  isMobile?: boolean;
  setWizardOpen: (open: boolean) => void;
  wizardOpen: boolean;
}

const HomeTabs: React.FC<HomeTabsProps> = ({
  history,
  loading,
  saving,
  celebrate,
  handleEntryAdd,
  isMobile = false,
  setWizardOpen,
  wizardOpen,
}) => {
  // Analysis tab available only if user has entries
  const hasHistory = history.length > 0;

  return (
    <Tabs defaultValue="track" className="w-full">
      <TabsList className="w-full justify-around bg-blue-50/80 rounded-2xl mb-4 px-0 py-2 shadow">
        <TabsTrigger value="track" className="flex-1 text-blue-700">Track</TabsTrigger>
        <TabsTrigger value="analysis" className="flex-1 text-purple-700" disabled={!hasHistory}>Analysis</TabsTrigger>
        <TabsTrigger value="learn" className="flex-1 text-pink-700">Learn</TabsTrigger>
        <TabsTrigger value="history" className="flex-1 text-green-700">Export</TabsTrigger>
      </TabsList>
      {/* Track Tab: Migraine Wizard */}
      <TabsContent value="track" className="mt-0">
        <MigraineStepWizard onComplete={handleEntryAdd}>
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
        </MigraineStepWizard>
      </TabsContent>
      {/* Analysis Tab */}
      <TabsContent value="analysis" className="mt-0">
        {loading ? (
          <div className="mb-6 text-sm text-blue-500 text-center">Loading your headache history…</div>
        ) : (
          <MigrainePreliminaryAnalysis history={history} />
        )}
      </TabsContent>
      {/* Learn Tab */}
      <TabsContent value="learn" className="mt-0">
        <aside className="w-full flex flex-col items-center gap-2">
          <div className="text-lg font-extrabold text-purple-800 mb-1">Learn more:</div>
          <div className="w-full flex flex-row flex-wrap gap-3 justify-center">
            <InfoButton type="what" />
            <InfoButton type="tips" />
            <InfoButton type="parents" />
            <InfoButton type="safe" />
          </div>
        </aside>
      </TabsContent>
      {/* Export/History Tab */}
      <TabsContent value="history" className="mt-0">
        <ExportDataButton history={history} />
        <div className="w-full rounded-2xl bg-white/80 py-2 px-2 shadow-sm mt-3">
          <MigrainHistoryChart history={history} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default HomeTabs;
