import React, { useState } from "react";
import { HelpCircle, Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const infoContent: Record<string, string> = {
  what: "A migraine is a bad headache. Sometimes it comes with feeling sick or seeing sparkles. Doctors want to know more to help you!",
  tips: "Rest, drink water, and tell an adult. Try lying down in a quiet room.",
  parents: "Write down when you get headaches. Tell your parents how it feels and where. This helps them and your doctor know more.",
  safe: "If you feel very bad, dizzy, or can't see, tell your parents right away. Always ask for help if you're unsure.",
};

const labelMap: Record<string, string> = {
  what: "What is a migraine?",
  tips: "What helps?",
  parents: "Tell your parents",
  safe: "Stay safe",
};

const styleMap: Record<string, { icon: React.ElementType; bg: string; fg: string }> = {
  what: { icon: HelpCircle, bg: "bg-primary-soft", fg: "text-primary" },
  tips: { icon: Sparkles, bg: "bg-secondary-soft", fg: "text-secondary" },
  parents: { icon: HeartHandshake, bg: "bg-accent-soft", fg: "text-accent" },
  safe: { icon: ShieldCheck, bg: "bg-sunny-soft", fg: "text-sunny" },
};

const InfoButton = ({ type }: { type: "what" | "tips" | "parents" | "safe" }) => {
  const [open, setOpen] = useState(false);
  const { icon: Icon, bg, fg } = styleMap[type];

  return (
    <>
      <button
        className={`tap w-full flex flex-col items-start gap-2 rounded-3xl ${bg} border border-white/60 dark:border-white/10 p-4 shadow-soft text-left`}
        onClick={() => setOpen(true)}
        type="button"
        aria-label={labelMap[type]}
      >
        <span className={`grid place-items-center h-10 w-10 rounded-2xl bg-card ${fg} shadow-soft`}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="font-display font-bold text-sm leading-tight text-foreground">
          {labelMap[type]}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{labelMap[type]}</DialogTitle>
            <DialogDescription className="text-base text-foreground/80 pt-2">
              {infoContent[type]}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setOpen(false)} className="w-full rounded-2xl font-bold">
            Got it!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InfoButton;
