
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

// Inline SVG for the iOS share icon to avoid broken image links
const IOSShareIconSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 32 32"
    className="inline w-4 h-4"
    aria-label="Share"
    style={{verticalAlign: "middle"}}
  >
    <rect width="32" height="32" rx="8" fill="#e0e7ef"/>
    <g>
      <path d="M16 21.333V10.667M16 10.667l-4 4M16 10.667l4 4" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <rect x="6" y="20" width="20" height="8" rx="2" stroke="#1e293b" strokeWidth="2" fill="none"/>
  </svg>
);

// Fallback: use emoji for app icon
const AppIcon = (
  <span className="w-8 h-8 flex items-center justify-center rounded-xl shadow mr-1 text-2xl" aria-hidden>
    📱
  </span>
);

const AddToHomeScreenInfoPopup = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-900">
            {AppIcon}
            Install PainPal on your Home Screen!
          </DialogTitle>
          <DialogDescription>
            <div className="mt-2 mb-3 font-semibold text-blue-800">
              Step-by-step for iOS (Safari)
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                1. Tap 
                <span className="inline-block px-1 align-middle">
                  {IOSShareIconSVG}
                </span> 
                in the bottom menu.
              </div>
              <div>
                2. Scroll down and choose <b>Add to Home Screen</b>.
              </div>
              <div>
                3. Done! Open from your home screen next time for the best experience.
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-full p-1 hover:bg-blue-100"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-blue-900" />
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default AddToHomeScreenInfoPopup;
