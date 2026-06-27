"use client";

import { useState } from "react";
import { useRaffle } from "@/hooks/useRaffle";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { Play } from "@/components/Play";
import { About } from "@/components/About";
import { Toast } from "@/components/Toast";
import { Footer } from "@/components/Footer";

type View = "dashboard" | "play" | "about";

const TABS: { key: View; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "play", label: "Play" },
  { key: "about", label: "About" },
];

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const raffle = useRaffle();

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-[#0c0a09] text-slate-100 overflow-x-hidden">
      {/* Ambient background */}
      <div className="absolute top-[-120px] right-[-120px] w-[520px] h-[520px] bg-rose-500/[0.05] rounded-full blur-[130px] pointer-events-none blob" />
      <div className="absolute bottom-[-120px] left-[-120px] w-[520px] h-[520px] bg-amber-500/[0.05] rounded-full blur-[130px] pointer-events-none blob" />

      <Header
        account={raffle.account}
        balance={raffle.balance}
        networkOk={raffle.networkOk}
        view={view}
        setView={setView}
        connectWallet={raffle.connectWallet}
      />

      <main className="w-full max-w-6xl px-6 flex flex-col items-center flex-1 z-10 pb-12">
        {/* Mobile segmented tab control */}
        <div className="md:hidden w-full mt-6 grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setView(t.key)}
              className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                view === t.key ? "bg-white/[0.06] text-amber-400" : "text-slate-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {view === "dashboard" && (
          <>
            <Hero onPlay={() => setView("play")} />
            <Dashboard
              poolSize={raffle.poolSize}
              numPlayers={raffle.numPlayers}
              raffleState={raffle.raffleState}
              elapsedTime={raffle.elapsedTime}
              intervalTime={raffle.intervalTime}
              recentWinner={raffle.recentWinner}
              playersList={raffle.playersList}
              account={raffle.account}
              onPlay={() => setView("play")}
            />
          </>
        )}

        {view === "play" && (
          <div className="w-full mt-8">
            <Play
              raffleState={raffle.raffleState}
              numPlayers={raffle.numPlayers}
              loading={raffle.loading}
              account={raffle.account}
              networkOk={raffle.networkOk}
              playersList={raffle.playersList}
              enterRaffle={raffle.enterRaffle}
              drawWinner={raffle.drawWinner}
            />
          </div>
        )}

        {view === "about" && (
          <div className="w-full mt-8">
            <About intervalTime={raffle.intervalTime} />
          </div>
        )}
      </main>

      <Footer />

      <Toast txMessage={raffle.txMessage} errorMessage={raffle.errorMessage} />
    </div>
  );
}
