import React from "react";
import { useAssistantAnalysis } from "@/hooks/useAssistantAnalysis";
import { Sparkles, Lightbulb, Database, Heart } from "lucide-react";

// Helper: simple frequency counting utility
function countBy<T extends string>(arr: T[]): Record<T, number> {
  return arr.reduce((acc, v) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

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
  wake: "just after waking up",
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
  if (!history.length) return "";
  const mostWhere = getMostFrequent(history.map((e) => e.where));
  const mostAmount = getMostFrequent(history.map((e) => e.amount));
  const mostCause = getMostFrequent(history.map((e) => e.cause));
  const mostWhen = getMostFrequent(history.map((e) => e.when));

  const lines: string[] = [
    `You've tracked ${history.length} headache${history.length > 1 ? "s" : ""}. That's awesome self-care!`,
  ];
  if (mostWhere) lines.push(`Most headaches are on ${whereMap[mostWhere] || mostWhere}.`);
  if (mostAmount) lines.push(`They usually hurt ${amountMap[mostAmount] || mostAmount}.`);
  if (mostCause) lines.push(`Most happen after ${causeMap[mostCause] || mostCause}.`);
  if (mostWhen) lines.push(`Headaches usually last ${whenMap[mostWhen] || mostWhen}.`);
  lines.push("Keep tracking — you're helping your doctor and learning about yourself! 🌟");
  return lines.join("\n");
};

const formatField = (field: any): string => {
  if (typeof field === "string") return field;
  if (Array.isArray(field)) {
    return field.map((line) => (typeof line === "string" ? line : JSON.stringify(line))).join("\n");
  }
  if (field !== undefined && field !== null) return String(field);
  return "";
};

const Block = ({
  icon: Icon,
  title,
  tone,
  text,
}: {
  icon: React.ElementType;
  title: string;
  tone: "primary" | "secondary" | "accent" | "sunny";
  text: string;
}) => {
  const tones = {
    primary: "bg-primary-soft text-primary",
    secondary: "bg-secondary-soft text-secondary",
    accent: "bg-accent-soft text-accent",
    sunny: "bg-sunny-soft text-sunny",
  } as const;
  if (!text.trim()) return null;
  return (
    <div className="flex gap-3">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-sm font-extrabold text-foreground">{title}</h3>
        <p className="mt-0.5 whitespace-pre-line text-sm font-semibold leading-relaxed text-foreground/75">
          {text}
        </p>
      </div>
    </div>
  );
};

const MigrainePreliminaryAnalysis = ({ history }: { history: any[] }) => {
  const assistantId = "asst_QdGLwLL2mn8p46MZ0xuryV3S";
  const { analysis, loading, error } = useAssistantAnalysis({ history, assistantId });

  function parseAnalysis(raw: string | null) {
    if (!raw) return null;
    try {
      const trimmed = raw.trim().replace(/^```json\s*|\s*```$/g, "");
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        const obj = JSON.parse(trimmed);
        if (typeof obj === "object" && (obj.analysis || obj.recommendations || obj.datapoints || obj.remember)) {
          return obj;
        }
      }
    } catch {
      /* not valid JSON */
    }
    return null;
  }

  const parsed = parseAnalysis(analysis);

  if (!history.length) {
    return (
      <section className="surface-card w-full p-8 text-center animate-fade-in">
        <div className="mb-3 text-5xl" aria-hidden>🔮</div>
        <h2 className="font-display text-xl font-extrabold">No insights yet</h2>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          Log a headache and PainPal will look for patterns for you.
        </p>
      </section>
    );
  }

  return (
    <section className="surface-card w-full overflow-hidden animate-fade-in">
      <header className="flex items-center gap-2 bg-gradient-primary px-5 py-3.5 text-primary-foreground">
        <Sparkles className="h-5 w-5" />
        <h2 className="font-display text-base font-extrabold">PainPal insights</h2>
      </header>

      <div className="space-y-5 p-5">
        {loading ? (
          <div className="space-y-3" aria-live="polite">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
            <p className="pt-1 text-sm font-bold text-primary">PainPal is thinking…</p>
          </div>
        ) : parsed ? (
          <>
            <Block icon={Sparkles} tone="primary" title="What I see" text={formatField(parsed.analysis)} />
            <Block icon={Lightbulb} tone="secondary" title="Try this" text={formatField(parsed.recommendations)} />
            <Block icon={Database} tone="sunny" title="Data used" text={formatField(parsed.datapoints)} />
            <Block icon={Heart} tone="accent" title="Remember" text={formatField(parsed.remember)} />
          </>
        ) : (
          <Block
            icon={Sparkles}
            tone="primary"
            title="What I see"
            text={typeof analysis === "string" && analysis.trim() ? analysis : friendlyCommentary(history)}
          />
        )}

        {error && (
          <p className="rounded-2xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}
      </div>
    </section>
  );
};

export default MigrainePreliminaryAnalysis;
