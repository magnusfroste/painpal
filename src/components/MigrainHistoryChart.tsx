import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

// Map label and an order/length value for "where" and "when"
const labelMap: Record<string, string> = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
};

const colorMap: Record<string, string> = {
  light: "#8ED88F",
  medium: "#FFF082",
  hard: "#FFB996",
  super: "#FF6464",
};

// Map "when" string to a headache length value in minutes, for bar height
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

const MigrainHistoryChart = ({ history }: { history: any[] }) => {
  // Show latest 8 entries
  const chartData = history.slice(-8).map((entry, idx) => ({
    idx: idx + 1,
    where: labelMap[entry.where] || entry.where,
    amount: entry.amount,
    when: entry.when,
    cause: entry.cause,
    emoji: (() => {
      if (entry.amount === "light") return "🙂";
      if (entry.amount === "medium") return "😐";
      if (entry.amount === "hard") return "😖";
      if (entry.amount === "super") return "😭";
      return "";
    })(),
    color: colorMap[entry.amount] || "#A3D8F4",
    lengthValue: lengthValueMap[entry.when] || 0,
    lengthLabel: lengthFriendly[entry.when] || entry.when,
  }));

  // Find the max value for scaling bar heights nicely
  const maxLength = Math.max(...chartData.map(d => d.lengthValue), 1);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 mt-2 p-6 bg-white shadow-md rounded-2xl animate-fade-in">
      <div className="font-semibold text-lg mb-3 text-center text-blue-700">
        My Headache History (Bar = How Long)
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <XAxis dataKey="idx" tick={false} />
          <Tooltip
            content={({ active, payload }) =>
              active && payload && payload.length ? (
                <div className="rounded-xl p-3 bg-blue-50 border border-blue-200 shadow text-sm">
                  <div><b>Where:</b> {payload[0].payload.where}</div>
                  <div><b>How much:</b> {payload[0].payload.emoji}</div>
                  <div><b>Length:</b> {payload[0].payload.lengthLabel}</div>
                  <div><b>What before:</b> {payload[0].payload.cause}</div>
                </div>
              ) : null
            }
          />
          <Bar 
            dataKey="lengthValue" 
            fill="#93c5fd"
          >
            {chartData.map((entry, index) => {
              // Calculate proportional height (min: 36px, max: 120px)
              const maxChartHeight = 120;
              const minChartHeight = 36;
              const height = minChartHeight + ((entry.lengthValue / maxLength) * (maxChartHeight - minChartHeight));
              const y = 180 - height;
              return (
                <rect
                  key={index}
                  x={index * 48}
                  width={36}
                  y={y}
                  height={height}
                  rx={10}
                  fill={entry.color}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center gap-2">
        {chartData.map((entry, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center"
            style={{ minWidth: 30 }}
          >
            <span style={{ fontSize: 24 }}>{entry.emoji}</span>
            <span className="text-xs text-blue-500">{entry.where}</span>
            {/* Removed lengthLabel from below each entry */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MigrainHistoryChart;
