
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

function isIosSafari() {
  const ua = window.navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) &&
    !window.MSStream &&
    // Not Chrome for iOS or FxiOS
    !/(CriOS|FxiOS|OPiOS|EdgiOS)/.test(ua)
  );
}

const AddToHomeScreenBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // "Standalone" is true if the app is launched from the home screen.
    const isStandalone =
      window.navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches;
    if (isIosSafari() && !isStandalone) {
      // Only show if not dismissed (store flag per browser session)
      const dismissed = sessionStorage.getItem("a2hs-dismissed") === "yes";
      if (!dismissed) setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-[98vw] max-w-md animate-fade-in">
      <div className="bg-white/95 p-3 rounded-2xl shadow-xl border border-blue-200 flex items-center gap-3">
        <img
          src="/lovable-uploads/ios-icon-192.png"
          aria-hidden
          className="w-10 h-10 rounded-xl shadow"
        />
        <div className="flex-1 text-sm">
          <div className="font-bold text-blue-900">Get PainPal on your home screen!</div>
          <div className="text-xs text-gray-700">
            Tap <span className="inline-block px-1"> <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Share_icon_iOS.png" className="inline w-4 h-4" alt="Share" /> </span>
             then &ldquo;Add to Home Screen&rdquo;.
          </div>
        </div>
        <button
          aria-label="Dismiss"
          className="ml-1 rounded-full p-1 hover:bg-blue-100"
          onClick={() => {
            setShow(false);
            sessionStorage.setItem("a2hs-dismissed", "yes");
          }}
        >
          <X className="w-4 h-4 text-blue-900" />
        </button>
      </div>
    </div>
  );
};

export default AddToHomeScreenBanner;
