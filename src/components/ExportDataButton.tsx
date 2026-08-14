import React from "react";
import { Mail, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const makeExportText = (history: any[]) => {
  if (!history.length) return "No migraine history recorded yet.";
  let out = "Migraine Tracker Entries:\n";
  history.forEach((entry, idx) => {
    out +=
      `\n${idx + 1}. Where: ${entry.where}, How much: ${entry.amount}, How long: ${entry.when}, Before: ${entry.cause}, Time: ${new Date(entry.timestamp).toLocaleString()}`;
  });
  return out;
};

const ExportDataButton = ({ history }: { history: any[] }) => {
  const handleExport = () => {
    const subject = encodeURIComponent("My Migraine Tracker Data");
    const body = encodeURIComponent(makeExportText(history));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const infoText =
    "This opens an email draft with your headache history filled in (nothing is sent automatically). You can review or edit it before sending it to your doctor.";

  return (
    <TooltipProvider>
      <div className="flex w-full items-center gap-2">
        <button
          onClick={handleExport}
          className="tap flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-5 py-4 font-display text-base font-bold text-primary-foreground shadow-glow disabled:opacity-50 disabled:shadow-none"
          disabled={!history.length}
        >
          <Mail size={20} />
          Share with my doctor
        </button>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="What does sharing do?"
              className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground tap"
            >
              <Info size={20} aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[15rem]">
            <span className="text-sm">{infoText}</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ExportDataButton;
