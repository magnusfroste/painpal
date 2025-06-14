
import React from "react";
import MigraineStepWizard from "@/components/MigraineStepWizard";
import MigrainePreliminaryAnalysis from "@/components/MigrainePreliminaryAnalysis";
import InfoButton from "@/components/InfoButton";
import ExportDataButton from "@/components/ExportDataButton";
import MigrainHistoryChart from "@/components/MigrainHistoryChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Activity, BarChart2, BookOpen, Clock } from "lucide-react";

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

const TAB_ICONS = {
  track: Activity,
  analysis: BarChart2,
  learn: BookOpen,
  history: Clock,
};

const TAB_LABELS = {
  track: "Track",
  analysis: "Insights",
  learn: "Learn",
  history: "History",
};

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
  const [activeTab, setActiveTab] = React.useState("track");

  // Tab order
  const tabs = [
    { value: "track" },
    { value: "analysis", disabled: !hasHistory },
    { value: "learn" },
    { value: "history" },
  ];

  return (
    <Tabs
      defaultValue="track"
      className={`w-full`}
      onValueChange={setActiveTab}
    >
      <TabsList
        className={`
          w-full 
          flex-nowrap
          justify-between
          rounded-2xl
          mb-2
          px-0
          py-1
          shadow
          bg-blue-50/80
          gap-1
          overflow-x-auto
          ${isMobile ? "h-14 min-h-0" : "h-auto"}
          sm:mb-4
        `}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((tab) => {
          const Icon = TAB_ICONS[tab.value as keyof typeof TAB_ICONS];
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className={`
                flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-1 
                sm:py-2 rounded-lg
                ${tab.value === "track" ? "text-blue-700" : ""}
                ${tab.value === "analysis" ? "text-purple-700" : ""}
                ${tab.value === "learn" ? "text-pink-700" : ""}
                ${tab.value === "history" ? "text-green-700" : ""}
                ${isMobile ? "text-xs sm:text-sm" : "text-sm"}
                ${tab.disabled ? "opacity-50" : ""}
                transition
              `}
              style={{
                minWidth: 0,
                fontSize: isMobile ? "0.85rem" : undefined,
                padding: isMobile ? "0.10rem 0.2rem" : undefined,
              }}
            >
              <Icon size={isMobile ? 20 : 22} className="mb-0.5" />
              <span className={isMobile ? "text-xs" : "text-sm"}>{TAB_LABELS[tab.value as keyof typeof TAB_LABELS]}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      {/* Track Tab: Migraine Wizard */}
      <TabsContent value="track" className={`${isMobile ? "mt-0 px-0 py-2" : "mt-0"} transition`}>
        <MigraineStepWizard onComplete={handleEntryAdd}>
          {saving && (
            <div className="mt-2 text-base text-blue-500 text-center animate-pulse">
              Saving entry…
            </div>
          )}
          {celebrate && (
            <div className="mt-2 text-xl font-bold text-green-600 animate-bounce text-center">
              🎉 Thanks! <br /> Collecting this data is super helpful!
            </div>
          )}
        </MigraineStepWizard>
      </TabsContent>
      {/* Insights Tab */}
      <TabsContent value="analysis" className={`${isMobile ? "mt-0 px-0 py-2" : "mt-0"} transition`}>
        {loading ? (
          <div className="mb-4 text-sm text-blue-500 text-center">Loading your headache history…</div>
        ) : (
          <MigrainePreliminaryAnalysis history={history} />
        )}
      </TabsContent>
      {/* Learn Tab */}
      <TabsContent value="learn" className={`${isMobile ? "mt-0 px-0 py-2" : "mt-0"} transition`}>
        <aside className="w-full flex flex-col items-center gap-2">
          <div className={`font-extrabold ${isMobile ? "text-base mb-0" : "text-lg mb-1"} text-purple-800`}>Learn more:</div>
          <div className={`w-full flex flex-row flex-wrap gap-2 justify-center`}>
            <InfoButton type="what" />
            <InfoButton type="tips" />
            <InfoButton type="parents" />
            <InfoButton type="safe" />
          </div>
        </aside>
      </TabsContent>
      {/* History Tab */}
      <TabsContent value="history" className={`${isMobile ? "mt-0 px-0 py-2 pb-16" : "mt-0 pb-24"} transition`}>
        <div className="w-full rounded-2xl bg-white/80 py-2 px-2 shadow-sm mt-2 sm:mt-3">
          <MigrainHistoryChart history={history} />
        </div>
        {/* Place ExportDataButton directly under the history chart */}
        <div className="w-full flex justify-center mt-2">
          <ExportDataButton history={history} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default HomeTabs;

