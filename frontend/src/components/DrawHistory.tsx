"use client";

import React from "react";
import { ZERO_ADDRESS } from "@/hooks/useRaffle";

interface DrawHistoryProps {
  recentWinner: string;
}

export const DrawHistory: React.FC<DrawHistoryProps> = ({ recentWinner }) => {
  const isWinnerSet = recentWinner !== ZERO_ADDRESS;

  return (
    <div className="verispin-card rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white text-lg shadow">
          👑
        </div>
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Most Recent Winner
          </span>
          <p className="text-xs font-mono text-slate-200 mt-1 break-all">
            {isWinnerSet ? recentWinner : "No draw has resolved yet."}
          </p>
        </div>
      </div>

      {isWinnerSet && (
        <a
          href={`https://sepolia.etherscan.io/address/${recentWinner}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-bold text-amber-400 transition"
        >
          Verify on Etherscan
        </a>
      )}
    </div>
  );
};
