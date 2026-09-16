import React, { useState, useEffect } from "react";
import { ChevronRight, Zap, RefreshCw } from "lucide-react";

const PaymentContextBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(120); // Default: 2 MIN AGO
  const [isGatewayActive, setIsGatewayActive] = useState(true);
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
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm py-1 select-none">
      {/* Left Side: Breadcrumb & Dynamic Sync Status */}
      <div className="flex items-center space-x-2 text-slate-500">
        <span className="font-medium hover:text-slate-700 cursor-pointer transition-colors">
          Finance
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
        <span className="text-slate-900 font-semibold">Payments</span>

        <span className="text-slate-300 font-normal">|</span>

        {/* Dynamic Database Sync Badge */}
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="flex items-center space-x-1.5 bg-emerald-50/80 hover:bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-100 transition-all cursor-pointer active:scale-95"
          title="Click to re-sync"
        >
          {isLoading ? (
            <RefreshCw className="w-3 h-3 text-emerald-600 animate-spin" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
          <span className="text-[10.5px] font-bold text-emerald-700 tracking-wider uppercase">
            {isLoading ? "Syncing..." : `DATABASE SYNCED - ${getSyncedText()}`}
          </span>
        </button>
      </div>

      {/* Right Side: Engine Version & Dynamic Gateway Status */}
      <div className="flex items-center space-x-2.5">
        {/* Engine Badge */}
        <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-[11px] font-medium border border-slate-200/80">
          Reconciliation Engine {engineVersion}
        </span>

        {/* Dynamic Gateway Status Badge */}
        <div
          onClick={() => setIsGatewayActive((prev) => !prev)}
          className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border cursor-pointer transition-colors ${
            isGatewayActive
              ? "bg-emerald-50/80 border-emerald-100 text-emerald-700"
              : "bg-amber-50/80 border-amber-100 text-amber-700"
          }`}
          title="Click to toggle status"
        >
          <Zap
            className={`w-3 h-3 ${
              isGatewayActive
                ? "text-emerald-600 fill-emerald-600"
                : "text-amber-500 fill-amber-500"
            }`}
          />
          <span className="text-[11px] font-semibold">
            {isGatewayActive ? "Payment Gateway Active" : "Gateway Offline"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentContextBar;
