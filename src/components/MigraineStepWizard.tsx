
import React, { useState } from "react";
import AINurseMascot from "./AINurseMascot";

const steps = [
  {
    question: "Where does it hurt?",
    options: [
      { label: "Front", emoji: "😣", value: "front" },
      { label: "Back", emoji: "😕", value: "back" },
      { label: "Right Side", emoji: "🤕", value: "right" },
      { label: "Left Side", emoji: "🥴", value: "left" },
    ]
  },
  {
    question: "How much does it hurt?",
    options: [
      { label: "A little", emoji: "🙂", value: "light" },
      { label: "Medium", emoji: "😐", value: "medium" },
      { label: "A lot", emoji: "😖", value: "hard" },
      { label: "Too much!", emoji: "😭", value: "super" },
    ],
  },
  {
    question: "How long has it hurt?",
    options: [
      { label: "A few minutes", emoji: "⏱️", value: "fewmin" },
      { label: "Less than 30 min", emoji: "🕧", value: "30min" },
      { label: "Almost an hour", emoji: "🕐", value: "hour" },
      { label: "Longer", emoji: "⏳", value: "long" },
    ]
  },
  {
    question: "What were you doing before?",
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
}: {
  onComplete: (entry: any) => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);

  const handleOptionClick = (option: any) => {
    const nextAnswers = [...answers, option.value];
    if (currentStep < steps.length - 1) {
      setAnswers(nextAnswers);
      setCurrentStep(currentStep + 1);
    } else {
      // All done!
      setAnswers([]);
      setCurrentStep(0);
      onComplete({
        where: nextAnswers[0],
        amount: nextAnswers[1],
        when: nextAnswers[2],
        cause: nextAnswers[3],
        timestamp: new Date().toISOString(),
      });
    }
  };

  const { question, options } = steps[currentStep];

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-2xl bg-white shadow-lg animate-fade-in 
      sm:p-6
      ">
      <AINurseMascot variant={currentStep === 0 ? "normal" : "happy"} />
      <div>
        <div className="text-[1.25rem] sm:text-xl font-bold text-gray-800 mb-3 text-center">{question}</div>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="flex flex-col items-center justify-center px-2 py-5 bg-blue-50 rounded-xl border-2 border-blue-100 hover:bg-blue-200 hover:scale-105 transition transform duration-150 shadow-md hover:shadow-lg text-base sm:text-lg font-bold focus:outline-none"
              style={{ minHeight: 85, fontSize: "1.15rem", letterSpacing: "0.01em" }}
            >
              <span style={{ fontSize: 38 }}>{option.emoji}</span>
              <span className="mt-2">{option.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-center space-x-3">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${currentStep === idx ? "bg-blue-400" : "bg-blue-100"} transition`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MigraineStepWizard;
