
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

// This is a simplified, modal version of the original AddToHomeScreenBanner. Use as a popup/modal for instructions.
const AddToHomeScreenInfoPopup = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-900">
            <img
              src="/lovable-uploads/ios-icon-192.png"
              aria-hidden
              className="w-8 h-8 rounded-xl shadow mr-1"
            />
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
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Share_icon_iOS.png" className="inline w-4 h-4" alt="Share" />
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
