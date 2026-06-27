"use client";

import React from "react";
import { DrawHistory } from "@/components/DrawHistory";

interface DashboardProps {
  poolSize: string;
  numPlayers: number;
  raffleState: number;
  elapsedTime: number;
  intervalTime: number;
  recentWinner: string;
  playersList: string[];
  account: string;
  onPlay: () => void;
}

/* Compact stat tile */
const Tile: React.FC<{ label: string; accent: string; children: React.ReactNode }> = ({
  label,
  accent,
  children,
}) => (
  <div className="verispin-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
    <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none ${accent}`} />
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    <div className="mt-3">{children}</div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({
  poolSize,
  numPlayers,
  raffleState,
  elapsedTime,
  intervalTime,
  recentWinner,
  playersList,
  account,
  onPlay,
}) => {
  const isOpen = raffleState === 0;
  const interval = intervalTime || 30;
  const remaining = Math.max(0, interval - elapsedTime);
  const pct = Math.min(100, (elapsedTime / interval) * 100);

  // Ring geometry
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference - (pct / 100) * circumference;

  const preview = playersList.slice(0, 4);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-5 auto-rows-auto">
      {/* Prize Pool — hero tile with countdown ring */}
      <div className="verispin-card rounded-3xl p-7 lg:col-span-2 lg:row-span-2 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-amber-500/[0.07] blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Current Prize Pool
            </span>
            <p className="text-5xl sm:text-6xl font-black mt-2 tracking-tight">
              <span className="gradient-text">{poolSize}</span>
              <span className="text-2xl text-slate-500 font-bold ml-2">ETH</span>
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-amber-400" : "bg-rose-400"}`} />
              <span className={`text-xs font-bold ${isOpen ? "text-amber-400" : "text-rose-400"}`}>
                {isOpen ? "Draw is OPEN" : "Resolving winner…"}
              </span>
            </div>
          </div>

          {/* Countdown ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width="140" height="140" className="-rotate-90">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={isOpen ? "url(#dashRing)" : "#f43f5e"}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={isOpen ? dash : 0}
                className="transition-all duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="dashRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              {isOpen ? (
                <>
                  <span className="text-2xl font-black text-white">{remaining}s</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    to draw
                  </span>
                </>
              ) : (
                <span className="text-xs font-black text-rose-400 uppercase">VRF</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onPlay}
          className="mt-6 w-full py-3.5 rounded-xl text-xs font-bold btn-neon-primary cursor-pointer"
        >
          Buy a Ticket →
        </button>
      </div>

      {/* Entrants */}
      <Tile label="Entrants" accent="bg-rose-500/10">
        <p className="text-3xl font-black text-white">{numPlayers}</p>
        <p className="text-[10px] text-slate-500 mt-1">{numPlayers === 1 ? "ticket" : "tickets"} this round</p>
      </Tile>

      {/* Win odds */}
      <Tile label="Your Odds" accent="bg-amber-500/10">
        <p className="text-3xl font-black text-white">
          {numPlayers > 0 ? `${(100 / numPlayers).toFixed(1)}%` : "—"}
        </p>
        <p className="text-[10px] text-slate-500 mt-1">per ticket purchased</p>
      </Tile>

      {/* Raffle state */}
      <Tile label="Raffle State" accent="bg-rose-500/10">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-amber-400 soft-pulse" : "bg-rose-400 soft-pulse"}`} />
          <p className={`text-lg font-black ${isOpen ? "text-amber-400" : "text-rose-400"}`}>
            {isOpen ? "OPEN" : "RESOLVING"}
          </p>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">accepting entries</p>
      </Tile>

      {/* Next draw progress */}
      <Tile label="Next Draw" accent="bg-amber-500/10">
        <p className="text-lg font-bold text-slate-200">
          {isOpen ? `${elapsedTime}s / ${interval}s` : "in progress"}
        </p>
        <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden mt-2.5">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
      </Tile>

      {/* Recent winner — wide */}
      <div className="lg:col-span-2">
        <DrawHistory recentWinner={recentWinner} />
      </div>

      {/* Live entrants preview — wide */}
      <div className="verispin-card rounded-2xl p-5 lg:col-span-2 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Live Entrants
          </span>
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-amber-400">
            <span className="w-1 h-1 rounded-full bg-amber-400 soft-pulse" />
            LIVE
          </span>
        </div>
        {preview.length > 0 ? (
          <div className="space-y-2">
            {preview.map((p, i) => {
              const isYou = account && p.toLowerCase() === account.toLowerCase();
              return (
                <div
                  key={`${p}-${i}`}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white/[0.01]"
                >
                  <span className="font-mono text-slate-300">
                    <span className="text-slate-600 mr-2">{i + 1}</span>
                    {p.slice(0, 8)}…{p.slice(-4)}
                  </span>
                  {isYou && <span className="text-[9px] font-bold text-amber-400">YOU</span>}
                </div>
              );
            })}
            {numPlayers > preview.length && (
              <button
                onClick={onPlay}
                className="w-full text-[10px] font-bold text-rose-400 hover:underline pt-1 cursor-pointer text-left px-2.5"
              >
                +{numPlayers - preview.length} more · view all in Play →
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">No entrants yet this round.</p>
        )}
      </div>
    </div>
  );
};
