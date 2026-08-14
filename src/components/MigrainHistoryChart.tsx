import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

const labelMap: Record<string, string> = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
};

const painColor: Record<string, string> = {
  light: "hsl(var(--pain-1))",
  medium: "hsl(var(--pain-2))",
  hard: "hsl(var(--pain-3))",
  super: "hsl(var(--pain-4))",
};

const lengthValueMap: Record<string, number> = {
  fewmin: 5,
  "30min": 25,
  hour: 55,
  long: 120,
};

const lengthFriendly: Record<string, string> = {
  fewmin: "A few minutes",
  "30min": "Less than 30 min",
  hour: "Almost an hour",
  long: "Longer",
};

const causeFriendly: Record<string, string> = {
  playing: "Playing",
  screen: "Screen time",
  eating: "Eating",
  wake: "Just woke up",
};

const emojiFor = (amount: string) =>
  amount === "light" ? "🙂" : amount === "medium" ? "😐" : amount === "hard" ? "😖" : amount === "super" ? "😭" : "";

const MigrainHistoryChart = ({ history }: { history: any[] }) => {
  const chartData = history.slice(-8).map((entry, idx) => ({
    idx: idx + 1,
    where: labelMap[entry.where] || entry.where,
    amount: entry.amount,
    when: entry.when,
    cause: causeFriendly[entry.cause] || entry.cause,
    date: entry.timestamp ? new Date(entry.timestamp).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "",
    emoji: emojiFor(entry.amount),
    color: painColor[entry.amount] || "hsl(var(--primary))",
    lengthValue: lengthValueMap[entry.when] || 5,
    lengthLabel: lengthFriendly[entry.when] || entry.when,
  }));

  if (!chartData.length) {
    return (
      <section className="surface-card w-full p-8 text-center animate-fade-in">
        <div className="text-5xl mb-3" aria-hidden>🌱</div>
        <h2 className="font-display text-xl font-extrabold">No entries yet</h2>
        <p className="mt-1 text-sm text-muted-foreground font-semibold">
          Log your first headache in the Track tab and your journey starts here.
        </p>
      </section>
    );
  }

  return (
    <section className="surface-card w-full p-5 animate-fade-in">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-extrabold">My headache journey</h2>
        <span className="pill bg-primary-soft text-primary">{history.length} logged</span>
      </header>

      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }} barCategoryGap="25%">
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 6" />
          <XAxis
            dataKey="emoji"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 16 }}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))", radius: 12 }}
            content={({ active, payload }) =>
              active && payload && payload.length ? (
                <div className="rounded-2xl border border-border bg-popover p-3 text-xs shadow-card space-y-1">
                  <div className="font-display font-bold text-sm">{payload[0].payload.date}</div>
                  <div><b>Where:</b> {payload[0].payload.where}</div>
                  <div><b>How much:</b> {payload[0].payload.emoji}</div>
                  <div><b>How long:</b> {payload[0].payload.lengthLabel}</div>
                  <div><b>Before:</b> {payload[0].payload.cause}</div>
                </div>
              ) : null
            }
          />
          <Bar dataKey="lengthValue" radius={[12, 12, 12, 12]} minPointSize={12}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { c: "bg-pain-1", l: "A little" },
          { c: "bg-pain-2", l: "Medium" },
          { c: "bg-pain-3", l: "A lot" },
          { c: "bg-pain-4", l: "Too much" },
        ].map((x) => (
          <span key={x.l} className="pill bg-muted text-muted-foreground inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${x.c}`} />
            {x.l}
          </span>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {[...history].slice(-5).reverse().map((entry, i) => (
          <li key={i} className="flex items-center gap-3 rounded-2xl bg-muted/60 px-3 py-2.5">
            <span className="text-2xl" aria-hidden>{emojiFor(entry.amount)}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-sm">
                {labelMap[entry.where] || entry.where} · {lengthFriendly[entry.when] || entry.when}
              </p>
              <p className="truncate text-xs text-muted-foreground font-semibold">
                After {(causeFriendly[entry.cause] || entry.cause || "").toLowerCase()}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground font-semibold">
              {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : ""}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MigrainHistoryChart;
