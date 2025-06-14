
import React from "react";
import { Home, BarChart2, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/** Simple tab data; can extend with more routes later */
const tabs = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Insights", icon: BarChart2, path: "/insights" }, // to be implemented
  { name: "Profile", icon: User, path: "/profile" }, // to be implemented
];

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed z-50 bottom-0 left-0 w-full max-w-md mx-auto rounded-t-2xl shadow-2xl bg-white/98 border-t border-blue-200 flex justify-around items-center py-2 px-2 animate-fade-in"
      style={{
        // safe area inset for iOS
        paddingBottom: "env(safe-area-inset-bottom, 0px)"
      }}
    >
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center flex-1 py-1 focus:outline-none transition ${active ? "text-blue-600" : "text-gray-500"} hover:scale-105`}
            aria-label={tab.name}
          >
            <tab.icon size={24} className={`${active ? "stroke-2" : "opacity-70"}`} />
            <span className={`text-xs font-medium mt-1 ${active ? "font-bold" : ""}`}>{tab.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomTabBar;
