"use client";

import React from "react";

interface ToastProps {
  txMessage: string;
  errorMessage: string;
}

export const Toast: React.FC<ToastProps> = ({ txMessage, errorMessage }) => {
  if (!txMessage && !errorMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-[calc(100%-3rem)] sm:w-auto">
      {errorMessage && (
        <div className="toast-in p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-start gap-2.5 backdrop-blur-md shadow-lg">
          <span className="shrink-0">⚠️</span>
          <p className="leading-snug">{errorMessage}</p>
        </div>
      )}
      {txMessage && (
        <div className="toast-in p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-start gap-2.5 backdrop-blur-md shadow-lg">
          <span className="shrink-0 spin-fast">🔄</span>
          <p className="leading-snug">{txMessage}</p>
        </div>
      )}
    </div>
  );
};
