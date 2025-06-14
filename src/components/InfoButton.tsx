
import React, { useState } from "react";
import { Info } from "lucide-react";

const infoContent: Record<string, string> = {
  what: "A migraine is a bad headache. Sometimes it comes with feeling sick or seeing sparkles. Doctors want to know more to help you!",
  tips: "Rest, drink water, and tell an adult. Try lying down in a quiet room.",
  parents: "Write down when you get headaches. Tell your parents how it feels and where. This helps them and your doctor know more.",
  safe: "If you feel very bad, dizzy, or can't see, tell your parents right away. Always ask for help if you’re unsure.",
};

const labelMap: Record<string, string> = {
  what: "What is a migraine?",
  tips: "What helps?",
  parents: "What to tell parents?",
  safe: "Safe tips",
};

const InfoButton = ({ type }: { type: "what" | "tips" | "parents" | "safe" }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="flex flex-col items-center justify-center p-3 h-28 w-32 bg-purple-100 border-2 border-purple-200 rounded-2xl shadow hover:bg-purple-200 hover:scale-105 transition font-bold text-purple-700 text-base mb-2"
        onClick={() => setOpen(true)}
        type="button"
        aria-label={labelMap[type]}
      >
        <Info size={30} />
        <span className="mt-1">{labelMap[type]}</span>
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs text-center">
            <p className="mb-4 text-lg text-purple-800">{infoContent[type]}</p>
            <button
              className="bg-purple-200 hover:bg-purple-300 px-4 py-2 rounded-md font-semibold shadow"
              onClick={() => setOpen(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoButton;
