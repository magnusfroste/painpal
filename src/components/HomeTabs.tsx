import React from "react";
import MigraineStepWizard from "@/components/MigraineStepWizard";
import MigrainePreliminaryAnalysis from "@/components/MigrainePreliminaryAnalysis";
import InfoButton from "@/components/InfoButton";
import ExportDataButton from "@/components/ExportDataButton";
import MigrainHistoryChart from "@/components/MigrainHistoryChart";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Activity, BarChart2, BookOpen, Clock } from "lucide-react";

interface HomeTabsProps {
  history: any[];
  loading: boolean;
  saving: boolean;
  celebrate: boolean;
  handleEntryAdd: (entry: any) => void;
  isMobile?: boolean;
  setWizardOpen: (open: boolean) => void;
  wizardOpen: boolean;
  onTabChange?: (tab: string) => void;
}

const TABS = [
  { value: "track", label: "Track", icon: Activity },
  { value: "analysis", label: "Insights", icon: BarChart2 },
  { value: "learn", label: "Learn", icon: BookOpen },
  { value: "history", label: "History", icon: Clock },
] as const;

const HomeTabs: React.FC<HomeTabsProps & { activeTab?: string }> = ({
  history,
  loading,
  saving,
  celebrate,
  handleEntryAdd,
  onTabChange,
  activeTab: controlledActiveTab,
}) => {
  const hasHistory = history.length > 0;
  const [activeTab, setActiveTab] = React.useState("track");

  React.useEffect(() => {
    if (controlledActiveTab && controlledActiveTab !== activeTab) {
      setActiveTab(controlledActiveTab);
    }
    // eslint-disable-next-line
  }, [controlledActiveTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <Tabs value={activeTab} defaultValue="track" className="w-full" onValueChange={handleTabChange}>
      {/* Content */}
      <TabsContent value="track" className="mt-0 focus-visible:outline-none">
        <MigraineStepWizard onComplete={handleEntryAdd}>
          {saving && (
            <p className="mt-4 animate-pulse text-center text-sm font-bold text-primary">Saving entry…</p>
          )}
          {celebrate && (
            <p className="mt-4 animate-pop-in rounded-2xl bg-secondary-soft px-4 py-3 text-center font-display font-extrabold text-secondary">
              🎉 Thanks! This really helps.
            </p>
          )}
        </MigraineStepWizard>
      </TabsContent>

      <TabsContent value="analysis" className="mt-0 focus-visible:outline-none">
        {loading ? (
          <div className="surface-card p-6 text-center text-sm font-bold text-primary animate-pulse">
            Loading your history…
          </div>
        ) : (
          <MigrainePreliminaryAnalysis history={history} />
        )}
      </TabsContent>

      <TabsContent value="learn" className="mt-0 focus-visible:outline-none">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoButton type="what" />
            <InfoButton type="tips" />
            <InfoButton type="parents" />
            <InfoButton type="safe" />
          </div>
          <div className="surface-card p-5">
            <h3 className="font-display text-base font-extrabold text-foreground">Remember 💛</h3>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-foreground/75">
              Keep logging your headaches and tell your doctor about them next visit. Your notes make it
              much easier to understand how you're feeling.
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="history" className="mt-0 focus-visible:outline-none">
        <div className="flex flex-col gap-4">
          <MigrainHistoryChart history={history} />
          <ExportDataButton history={history} />
        </div>
      </TabsContent>

      {/* Bottom navigation (mobile-first, thumb friendly) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 safe-bottom pointer-events-none"
        aria-label="Main sections"
      >
        <div className="pointer-events-auto mx-auto flex w-[min(100%-1rem,440px)] items-stretch gap-1 rounded-[1.75rem] border border-white/60 bg-card/85 p-1.5 shadow-card backdrop-blur-xl dark:border-white/10">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.value;
            const disabled = tab.value === "analysis" && !hasHistory;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => !disabled && handleTabChange(tab.value)}
                disabled={disabled}
                aria-current={active ? "page" : undefined}
                className={`tap flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-3xl px-1 text-[11px] font-bold transition
                  ${active ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"}
                  ${disabled ? "opacity-40" : ""}`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </Tabs>
  );
};

export default HomeTabs;
