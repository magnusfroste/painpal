import React, { useState, ReactNode } from "react";

const steps = [
  {
    question: "Where does it hurt?",
    hint: "Tap the spot that feels closest",
    options: [
      { label: "Front", emoji: "😣", value: "front" },
      { label: "Back", emoji: "😕", value: "back" },
      { label: "Right Side", emoji: "🤕", value: "right" },
      { label: "Left Side", emoji: "🥴", value: "left" },
    ]
  },
  {
    question: "How much does it hurt?",
    hint: "There is no wrong answer",
    options: [
      { label: "A little", emoji: "🙂", value: "light" },
      { label: "Medium", emoji: "😐", value: "medium" },
      { label: "A lot", emoji: "😖", value: "hard" },
      { label: "Too much!", emoji: "😭", value: "super" },
    ],
  },
  {
    question: "How long has it hurt?",
    hint: "Your best guess is fine",
    options: [
      { label: "A few minutes", emoji: "⏱️", value: "fewmin" },
      { label: "Less than 30 min", emoji: "🕧", value: "30min" },
      { label: "Almost an hour", emoji: "🕐", value: "hour" },
      { label: "Longer", emoji: "⏳", value: "long" },
    ]
  },
  {
    question: "What were you doing before?",
    hint: "Last thing you remember doing",
    options: [
      { label: "Playing", emoji: "⚽", value: "playing" },
      { label: "Screen time", emoji: "📱", value: "screen" },
      { label: "Eating", emoji: "🍎", value: "eating" },
      { label: "Just woke up", emoji: "🌅", value: "wake" },
    ]
  },
];

const MigraineStepWizard = ({
  onComplete,
  children,
}: {
  onComplete: (entry: any) => void;
  children?: ReactNode;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const handleOptionClick = (option: any) => {
    if (disabled) return;
    setPicked(option.value);
    const nextAnswers = [...answers, option.value];
    if (currentStep < steps.length - 1) {
      setAnswers(nextAnswers);
      setTimeout(() => {
        setCurrentStep((s) => s + 1);
        setPicked(null);
      }, 140);
    } else {
      setDisabled(true);
      setTimeout(() => {
        onComplete({
          where: nextAnswers[0],
          amount: nextAnswers[1],
          when: nextAnswers[2],
          cause: nextAnswers[3],
          timestamp: new Date().toISOString(),
        });
        setTimeout(() => {
          setAnswers([]);
          setCurrentStep(0);
          setDisabled(false);
          setPicked(null);
        }, 1100);
      }, 0);
    }
  };

  const goBack = () => {
    if (currentStep === 0 || disabled) return;
    setAnswers((a) => a.slice(0, -1));
    setCurrentStep((s) => s - 1);
  };

  const { question, hint, options } = steps[currentStep];
  const progress = ((currentStep) / steps.length) * 100;

  return (
    <section className="surface-card w-full p-5 sm:p-6 animate-fade-in">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-primary transition-all duration-300"
            style={{ width: `${Math.max(progress, 6)}%` }}
          />
        </div>
        <span className="text-xs font-bold text-muted-foreground tabular-nums">
          {currentStep + 1}/{steps.length}
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground text-center leading-tight">
        {question}
      </h2>
      <p className="mt-1 mb-5 text-center text-sm text-muted-foreground font-semibold">{hint}</p>

      <div
        key={currentStep}
        className={`grid grid-cols-2 gap-3 animate-pop-in ${disabled ? "opacity-60 pointer-events-none select-none" : ""}`}
      >
        {options.map((option) => {
          const isPicked = picked === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              disabled={disabled}
              className={`tap flex flex-col items-center justify-center gap-2 min-h-[112px] rounded-3xl border-2 px-3 py-4 font-display font-bold text-base
                ${isPicked
                  ? "border-primary bg-primary-soft shadow-glow"
                  : "border-border bg-card hover:border-primary/50 hover:bg-primary-soft/50 shadow-soft"}
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30`}
            >
              <span className="text-4xl leading-none" aria-hidden>{option.emoji}</span>
              <span className="text-center leading-tight">{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={currentStep === 0 || disabled}
          className="text-sm font-bold text-muted-foreground disabled:opacity-0 transition"
        >
          ← Back
        </button>
        <div className="flex gap-2">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`h-2.5 rounded-full transition-all ${
                currentStep === idx ? "w-6 bg-primary" : idx < currentStep ? "w-2.5 bg-primary/50" : "w-2.5 bg-muted"
              }`}
            />
          ))}
        </div>
        <span className="w-10" />
      </div>

      {children}
    </section>
  );
};

export default MigraineStepWizard;
