import React, { useState, useEffect } from "react";
import {  ChartNoAxesCombined, RefreshCw } from "lucide-react";

const ReportsContextBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(120); // Default: 2 MIN AGO
  const engineVersion = "v4.8";

  // Automatic timer updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time dynamically
  const getSyncedText = () => {
    if (secondsAgo < 10) return "JUST NOW";
    if (secondsAgo < 60) return `${secondsAgo} SEC AGO`;
    const mins = Math.floor(secondsAgo / 60);
    return `${mins} ${mins === 1 ? "MIN" : "MINS"} AGO`;
  };

  // Manual Sync Trigger
  const handleSync = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setSecondsAgo(0);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm py-2 select-none">
      {/* Left Side: Icon & Breadcrumb */}
      <div className="flex items-center space-x-2 text-slate-700 font-semibold tracking-wider text-xs">
        <ChartNoAxesCombined className="w-4 h-4 text-blue-600" />
        <span className="hover:text-slate-900 cursor-pointer transition-colors uppercase">
          FINANCE
        </span>
        <span className="text-slate-400 font-normal">/</span>
        <span className="text-slate-900 uppercase">REPORTS</span>
      </div>

      {/* Right Side: Dynamic Database Sync Badge & Engine Version */}
      <div className="flex items-center space-x-2.5">
        {/* Dynamic Database Sync Badge */}
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="flex items-center space-x-1.5 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1 rounded-full transition-all cursor-pointer active:scale-95 border border-blue-100/50"
          title="Click to re-sync"
        >
          {isLoading ? (
            <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
          <span className="text-[10.5px] font-bold text-slate-700 tracking-wide uppercase">
            {isLoading ? "SYNCING..." : `DATABASE SYNCED · ${getSyncedText()}`}
          </span>
        </button>

        {/* Engine Badge */}
        <span className="bg-blue-50/80 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-medium border border-blue-100/50 font-mono">
          Reporting Engine {engineVersion}
        </span>
      </div>
    </div>
  );
};

export default ReportsContextBar;
