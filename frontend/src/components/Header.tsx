"use client";

import React from "react";

type View = "dashboard" | "play" | "about";

interface HeaderProps {
  account: string;
  balance: string;
  networkOk: boolean;
  view: View;
  setView: (v: View) => void;
  connectWallet: () => void;
}

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-950/30">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17"
        />
      </svg>
    </div>
    <span className="text-lg font-black tracking-tight text-white uppercase">
      Veri<span className="text-amber-400">Spin</span>
    </span>
  </div>
);

export const Header: React.FC<HeaderProps> = ({
  account,
  balance,
  networkOk,
  view,
  setView,
  connectWallet,
}) => {
  const navBtn = (key: View) =>
    `text-xs font-bold tracking-wider uppercase transition pb-1 cursor-pointer ${
      view === key
        ? "text-amber-400 border-b-2 border-amber-400"
        : "text-slate-500 hover:text-white border-b-2 border-transparent"
    }`;

  return (
    <header className="w-full max-w-6xl flex items-center justify-between z-30 py-5 px-6 border-b border-white/[0.05] bg-[#0c0a09]/80 backdrop-blur-md sticky top-0">
      <div className="flex items-center gap-10">
        <Logo />
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => setView("dashboard")} className={navBtn("dashboard")}>
            Dashboard
          </button>
          <button onClick={() => setView("play")} className={navBtn("play")}>
            Play
          </button>
          <button onClick={() => setView("about")} className={navBtn("about")}>
            About
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {account ? (
          <div className="flex items-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-1.5 pl-3">
            <span className="hidden sm:inline text-xs font-bold text-slate-300 mr-2.5">
              {balance} ETH
            </span>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono ${
                networkOk
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                  : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
              }`}
              title={networkOk ? "Connected to Sepolia" : "Wrong network — switch to Sepolia"}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full soft-pulse ${
                  networkOk ? "bg-amber-500" : "bg-rose-500"
                }`}
              />
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-rose-600 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 transition duration-200 cursor-pointer"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
};
