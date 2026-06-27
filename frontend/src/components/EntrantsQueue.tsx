"use client";

import React from "react";
import { RAFFLE_ADDRESS } from "@/constants";

interface EntrantsQueueProps {
  playersList: string[];
  account: string;
}

export const EntrantsQueue: React.FC<EntrantsQueueProps> = ({ playersList, account }) => {
  return (
    <div className="verispin-card rounded-3xl p-6 min-h-[440px] flex flex-col">
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-4">
        <h4 className="text-xs font-bold text-white tracking-widest uppercase">Entrants Queue</h4>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-bold text-amber-400">
          <span className="w-1 h-1 rounded-full bg-amber-400 soft-pulse" />
          LIVE
        </span>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 scroll-thin max-h-[300px]">
        {playersList.length > 0 ? (
          playersList.map((player, index) => {
            const isYou = account && player.toLowerCase() === account.toLowerCase();
            return (
              <div
                key={`${player}-${index}`}
                className={`flex items-center justify-between p-3 rounded-xl text-xs border ${
                  isYou
                    ? "bg-amber-500/[0.06] border-amber-500/20"
                    : "bg-white/[0.01] border-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-bold w-4">{index + 1}</span>
                  <span className="font-mono text-slate-300">
                    {player.slice(0, 8)}…{player.slice(-4)}
                  </span>
                  {isYou && (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      YOU
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">
                  CONFIRMED
                </span>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-500 text-xs gap-2">
            <span className="text-2xl opacity-40">🎟️</span>
            No tickets purchased yet this round.
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-slate-500">
        <span>Contract</span>
        <a
          href={`https://sepolia.etherscan.io/address/${RAFFLE_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-rose-400 hover:underline"
        >
          {RAFFLE_ADDRESS.slice(0, 6)}…{RAFFLE_ADDRESS.slice(-4)}
        </a>
      </div>
    </div>
  );
};
