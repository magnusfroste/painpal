import React from "react";
import { useAssistantAnalysis } from "@/hooks/useAssistantAnalysis";

// Helper: simple frequency counting utility
function countBy<T extends string>(arr: T[]): Record<T, number> {
  return arr.reduce((acc, v) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

// Choices for nice mapping
const whereMap: Record<string, string> = {
  front: "the front of your head",
  back: "the back of your head",
  left: "the left side of your head",
  right: "the right side of your head",
};

const amountMap: Record<string, string> = {
  light: "a little",
  medium: "medium",
  hard: "a lot",
  super: "super strong",
};

const causeMap: Record<string, string> = {
  playing: "playing",
  screen: "using screens",
  eating: "eating",
  wake: "just after waking up"
};

const whenMap: Record<string, string> = {
  fewmin: "just a few minutes",
  "30min": "less than 30 min",
  hour: "almost an hour",
  long: "longer periods",
};

function getMostFrequent<T extends string>(arr: T[]): T | null {
  const count = countBy(arr);
  const pairs = Object.entries(count);
  if (pairs.length === 0) return null;
  return pairs.reduce((a, b) => (b[1] > a[1] ? b : a))[0] as T;
}

const friendlyCommentary = (history: any[]) => {
  if (!history.length) return "No headaches logged yet. When you do, you'll see a friendly analysis here!";

  // Collect arrays for statistics
  const whereArr = history.map((e) => e.where);
  const amountArr = history.map((e) => e.amount);
  const causeArr = history.map((e) => e.cause);
  const whenArr = history.map((e) => e.when);

  const mostWhere = getMostFrequent(whereArr);
  const mostAmount = getMostFrequent(amountArr);
  const mostCause = getMostFrequent(causeArr);
  const mostWhen = getMostFrequent(whenArr);

  let lines: string[] = [
    `You've tracked <b>${history.length}</b> headache${history.length > 1 ? "s" : ""}. That's awesome self-care!`,
  ];

  if (mostWhere) lines.push(`Most headaches are on <b>${whereMap[mostWhere] || mostWhere}</b>.`);
  if (mostAmount) lines.push(`They usually hurt <b>${amountMap[mostAmount] || mostAmount}</b>.`);
  if (mostCause) lines.push(`Most happen after <b>${causeMap[mostCause] || mostCause}</b>.`);
  if (mostWhen) lines.push(`Headaches usually last <b>${whenMap[mostWhen] || mostWhen}</b>.`);
  lines.push("Keep tracking—you're helping your doctor and learning more about yourself! 🌟");

  return lines.join("<br/>");
};

const formatField = (field: any) => {
  if (typeof field === "string") {
    return field.replace(/\n/g, "<br/>");
  } else if (Array.isArray(field)) {
    // If it's an array, join lines with <br/>
    return field.map((line) =>
      typeof line === "string" ? line : JSON.stringify(line)
    ).join("<br/>");
  } else if (field !== undefined && field !== null) {
    return String(field);
  }
  return "";
};

const MigrainePreliminaryAnalysis = ({ history }: { history: any[] }) => {
  // Assistant connection: You can change the assistantId if needed!
  const assistantId = "asst_QdGLwLL2mn8p46MZ0xuryV3S";
  const { analysis, loading, error } = useAssistantAnalysis({ history, assistantId });

  // Helper: Try to gracefully parse a JSON string with analysis/recommendations
  function parseAnalysis(analysis: string | null) {
    if (!analysis) return null;
    try {
      const trimmed = analysis.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        const obj = JSON.parse(trimmed);
        if (typeof obj === "object" && (obj.analysis || obj.recommendations)) {
          return obj;
        }
      }
    } catch {
      // not valid JSON
    }
    return null;
  }

  const parsed = parseAnalysis(analysis);

  const commentaryHTML = !history.length
    ? "No headaches logged yet. When you do, you'll see a friendly analysis here!"
    : parsed
      ? `
        <div>
          <div class="mb-2">
            <b>Analysis:</b><br/>
            <span>${formatField(parsed.analysis)}</span>
          </div>
          <div class="mb-2">
            <b>Recommendations:</b><br/>
            <span>${formatField(parsed.recommendations)}</span>
          </div>
          ${parsed.Datapoints
            ? `<div class="mb-2">
                <b>Datapoints:</b><br/>
                <span>${formatField(parsed.Datapoints)}</span>
              </div>`
            : ""}
        </div>
        `
      : analysis
        ? (typeof analysis === "string" ? analysis.replace(/\n/g, "<br/>") : String(analysis))
        : friendlyCommentary(history);

  return (
    <section className="w-full mb-4">
      <div className="rounded-2xl bg-blue-50/70 shadow-md border border-blue-100 px-4 py-4 flex flex-row items-start gap-3">
        <span className="text-2xl select-none" aria-hidden>🔎</span>
        <div className="flex-1 text-blue-900 text-base font-semibold leading-relaxed">
          {loading ? (
            <span className="animate-pulse text-blue-600">PainPal is thinking...</span>
          ) : (
            <span
              dangerouslySetInnerHTML={{ __html: commentaryHTML }}
            />
          )}
          {error && (
            <div className="mt-2 text-sm text-red-500">{error}</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MigrainePreliminaryAnalysis;
