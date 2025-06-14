
import React from "react";
import { Mail } from "lucide-react";

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
  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-5 py-3 bg-green-200 hover:bg-green-300 active:bg-green-400 rounded-xl font-bold text-green-900 shadow-md hover:scale-105 transition text-lg mt-3 mb-1"
      disabled={!history.length}
    >
      <Mail size={22} /> Share with Doctor
    </button>
  );
};

export default ExportDataButton;
