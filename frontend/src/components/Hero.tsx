"use client";

import React from "react";

interface HeroProps {
  onPlay: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPlay }) => {
  return (
    <section className="w-full flex flex-col items-center text-center pt-10 pb-8">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 soft-pulse" />
        Chainlink VRF V2.5 · Ethereum Sepolia
      </span>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.08]">
        Provably fair draws, <span className="gradient-text">verifiably random.</span>
      </h1>

      <p className="max-w-lg text-sm text-slate-400 mt-4 leading-relaxed">
        A fully on-chain lottery where every winner is picked by Chainlink&apos;s verifiable random
        function — no operator, no house, no manipulation.
      </p>

      <button
        onClick={onPlay}
        className="mt-7 px-6 py-3 rounded-xl text-xs font-bold btn-neon-primary cursor-pointer"
      >
        Enter the Draw →
      </button>
    </section>
  );
};
