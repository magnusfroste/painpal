
import React from "react";
import { Info, Hand, BarChart2, BookOpen, Clock } from "lucide-react";

// NEW: More mascot icon variants for the various tabs
const iconVariants: Record<string, React.ReactNode> = {
  normal: <Hand size={38} className="text-blue-500" />,
  analysis: <BarChart2 size={38} className="text-purple-500" />,
  learn: <BookOpen size={38} className="text-pink-600" />,
  history: <Clock size={38} className="text-green-600" />,
  celebrate: <Hand size={38} className="text-pink-500 animate-pulse" />,
  welcome: <Hand size={38} className="text-blue-500" />,
};

const AINurseMascot = ({
  variant = "normal",
  message,
}: {
  variant?: "normal" | "happy" | "celebrate" | "welcome" | "analysis" | "learn" | "history";
  message?: string;
}) => {
  // Fallback for message if not passed
  const fallbackMessage =
    variant === "celebrate"
      ? "Thank you for sharing! This info will help your doctor help you! 🌈"
      : "Hi! I’m your PainPal. Ready to help you track your headache 👋";

  return (
    <div className="flex flex-col items-center mb-3">
      <div className="rounded-full bg-blue-100 border-4 border-blue-300 shadow-md w-20 h-20 flex items-center justify-center transition-all duration-500 ease-out">
        {iconVariants[variant] || iconVariants.normal}
      </div>
      <span
        className="block text-lg mt-2 font-semibold text-blue-700 text-center max-w-xs"
        style={{
          fontFamily:
            "'San Francisco', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'",
        }}
      >
        {message || fallbackMessage}
      </span>
    </div>
  );
};

export default AINurseMascot;
