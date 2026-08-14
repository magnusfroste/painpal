import React from "react";
import { Hand, BarChart2, BookOpen, Clock, Sparkles } from "lucide-react";

type Variant = "normal" | "happy" | "celebrate" | "welcome" | "analysis" | "learn" | "history";

const variantStyles: Record<string, { icon: React.ReactNode; ring: string; bg: string }> = {
  normal: { icon: <Hand className="h-7 w-7 text-primary" />, ring: "ring-primary/25", bg: "bg-primary-soft" },
  analysis: { icon: <BarChart2 className="h-7 w-7 text-secondary" />, ring: "ring-secondary/25", bg: "bg-secondary-soft" },
  learn: { icon: <BookOpen className="h-7 w-7 text-accent" />, ring: "ring-accent/25", bg: "bg-accent-soft" },
  history: { icon: <Clock className="h-7 w-7 text-sunny" />, ring: "ring-sunny/25", bg: "bg-sunny-soft" },
  celebrate: { icon: <Sparkles className="h-7 w-7 text-accent animate-pulse" />, ring: "ring-accent/30", bg: "bg-accent-soft" },
  welcome: { icon: <Hand className="h-7 w-7 text-primary" />, ring: "ring-primary/25", bg: "bg-primary-soft" },
  happy: { icon: <Sparkles className="h-7 w-7 text-primary" />, ring: "ring-primary/25", bg: "bg-primary-soft" },
};

const AINurseMascot = ({
  variant = "normal",
  message,
}: {
  variant?: Variant;
  message?: string;
}) => {
  const style = variantStyles[variant] || variantStyles.normal;
  const fallbackMessage =
    variant === "celebrate"
      ? "Thank you for sharing! This helps your doctor help you 🌈"
      : "Hi! I'm PainPal. Ready to track your headache 👋";

  return (
    <div className="flex items-center gap-3 text-left">
      <div
        className={`shrink-0 grid place-items-center h-14 w-14 rounded-2xl ring-4 ${style.ring} ${style.bg} animate-float`}
        aria-hidden
      >
        {style.icon}
      </div>
      <p className="text-sm sm:text-base font-semibold leading-snug text-foreground/80">
        {message || fallbackMessage}
      </p>
    </div>
  );
};

export default AINurseMascot;
