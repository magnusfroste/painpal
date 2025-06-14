
import React from "react";
import { Info } from "lucide-react";

const AINurseMascot = ({ variant = "normal" }: { variant?: "normal" | "happy" | "celebrate" }) => {
  let message = "Hi! I’m Nurse AI. Ready to help you track your headache 👋";
  if (variant === "happy") message = "Great job! Let’s try to answer a few more questions!";
  if (variant === "celebrate") message = "Thank you for sharing! This info will help your doctor help you! 🌈";

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="rounded-full bg-blue-100 border-4 border-blue-300 shadow-md w-20 h-20 flex items-center justify-center animate-[bounce_1s_ease-in-out]">
        <Info size={38} className="text-blue-500" />
      </div>
      <span className="block text-lg mt-3 font-semibold text-blue-700 text-center max-w-xs">{message}</span>
    </div>
  );
};

export default AINurseMascot;
