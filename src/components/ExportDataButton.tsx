
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

  // Tooltip describes what happens when sharing data
  const infoText =
    "Clicking this button opens an email draft with your migraine history filled in (nothing is sent automatically). You can review or edit the text before sending it to your doctor.";

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-3 bg-green-200 hover:bg-green-300 active:bg-green-400 rounded-xl font-bold text-green-900 shadow-md hover:scale-105 transition text-lg mt-3 mb-1"
          disabled={!history.length}
        >
          <Mail size={22} />
          Share with Doctor
        </button>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              tabIndex={0}
              aria-label="What does 'Share with Doctor' do?"
              className="p-1 ml-1 rounded-full text-green-900 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-300"
              style={{ lineHeight: 0 }}
            >
              <Info size={20} aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <span className="font-semibold text-base text-green-800 mb-0.5 block">About "Share with Doctor"</span>
            <span className="text-green-900 text-sm">
              {infoText}
            </span>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ExportDataButton;

