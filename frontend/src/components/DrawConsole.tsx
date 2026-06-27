"use client";

import React from "react";
import { ENTRANCE_FEE } from "@/hooks/useRaffle";

interface DrawConsoleProps {
  raffleState: number;
  numPlayers: number;
  loading: boolean;
  account: string;
  networkOk: boolean;
  enterRaffle: () => void;
  drawWinner: () => void;
}

export const DrawConsole: React.FC<DrawConsoleProps> = ({
  raffleState,
  numPlayers,
  loading,
  account,
  networkOk,
  enterRaffle,
  drawWinner,
}) => {
  const isOpen = raffleState === 0;
  const ready = !!account && networkOk;

  return (
    <div className="verispin-card rounded-3xl p-6 md:p-8 flex flex-col items-center text-center min-h-[440px]">
      <div className="w-full">
        <h3 className="text-lg font-bold text-white tracking-wide uppercase">Drawing Hub</h3>
        <p className="text-xs text-slate-500 mt-1">Provably fair random winner selection</p>
      </div>

      {/* Wheel */}
      <div className="relative my-8 flex items-center justify-center flex-1">
        <div
          className={`w-40 h-40 rounded-full border-4 border-dashed flex items-center justify-center transition-colors ${
            isOpen ? "border-amber-500/25" : "border-amber-400 spin-fast"
          }`}
        >
          <div className="w-30 h-30 rounded-full bg-white/[0.01] border border-white/[0.06] flex items-center justify-center p-7">
            <span className="text-4xl">🎯</span>
          </div>
        </div>
        {!isOpen && (
          <span className="absolute -bottom-2 text-[10px] font-bold text-rose-400 bg-black/80 px-2.5 py-1 rounded-full border border-rose-500/20">
            RESOLVING VRF
          </span>
        )}
      </div>

      {/* Params */}
      <div className="w-full grid grid-cols-2 gap-4 border-t border-white/[0.05] pt-6">
        <div className="text-left">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Ticket Cost
          </span>
          <p className="text-base font-bold text-white mt-0.5">{ENTRANCE_FEE} ETH</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Raffle State
          </span>
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-amber-400" : "bg-rose-400"}`} />
            <p className={`text-xs font-bold ${isOpen ? "text-amber-400" : "text-rose-400"}`}>
              {isOpen ? "OPEN" : "RESOLVING"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={enterRaffle}
          disabled={loading || !isOpen}
          className="flex-1 py-3.5 rounded-xl font-bold text-xs btn-neon-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          {!ready ? "Connect to Enter" : loading ? "Processing…" : `Buy Ticket (${ENTRANCE_FEE} ETH)`}
        </button>
        <button
          onClick={drawWinner}
          disabled={loading || numPlayers === 0 || !isOpen || !ready}
          className="flex-1 py-3.5 rounded-xl font-bold text-xs btn-neon-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Processing…" : "Select Winner"}
        </button>
      </div>
    </div>
  );
};
