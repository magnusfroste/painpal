
import React from "react";
import { Info, Hand } from "lucide-react";

const greetingMessages: Record<string, string> = {
  normal: "Hi! I’m PainPal. Ready to help you track your headache 👋",
  happy: "Great job! Let’s try to answer a few more questions!",
  celebrate: "Thank you for sharing! This info will help your doctor help you! 🌈",
  welcome: "Welcome back, superstar! I’m here to help whenever you need me 🤗"
};

const iconVariants: Record<string, React.ReactNode> = {
  celebrate: <Hand size={38} className="text-pink-500 animate-pulse" />,
  happy: <Hand size={38} className="text-green-400 animate-wiggle" />,
  welcome: <Hand size={38} className="text-blue-500" />,
  normal: <Info size={38} className="text-blue-500" />,
};

const AINurseMascot = ({
  variant = "normal"
}: { variant?: "normal" | "happy" | "celebrate" | "welcome" }) => {
  const message = greetingMessages[variant] || greetingMessages.normal;

  return (
    <div className="flex flex-col items-center mb-3">
      <div className="rounded-full bg-blue-100 border-4 border-blue-300 shadow-md w-20 h-20 flex items-center justify-center transition-all duration-500 ease-out">
        {iconVariants[variant] || iconVariants.normal}
      </div>
      <span className="block text-lg mt-2 font-semibold text-blue-700 text-center max-w-xs" style={{
        fontFamily: "'San Francisco', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'"
      }}>
        {message}
      </span>
    </div>
  );
};

export default AINurseMascot;

