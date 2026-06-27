"use client";

import React from "react";
import { RAFFLE_ADDRESS } from "@/constants";

interface AboutProps {
  intervalTime: number;
}

const steps = [
  {
    n: 1,
    accent: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    title: "Request",
    body: (
      <>
        When the interval elapses, anyone can call{" "}
        <code className="text-amber-400">performUpkeep</code>, which requests random words from the
        Chainlink VRF Coordinator.
      </>
    ),
  },
  {
    n: 2,
    accent: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    title: "Prove",
    body: "The Chainlink oracle generates a cryptographic proof of the random values off-chain and submits it back on-chain.",
  },
  {
    n: 3,
    accent: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    title: "Verify & Pay",
    body: "The contract verifies the proof before selecting the winner — the result cannot be predicted or manipulated by anyone, including the deployer.",
  },
];

const specs = (intervalTime: number) => [
  { label: "Randomness Coordinator", value: "Chainlink VRF V2.5" },
  { label: "Network", value: "Ethereum Sepolia" },
  { label: "Request Confirmations", value: "3 blocks" },
  { label: "Callback Gas Limit", value: "100,000 gas" },
  { label: "Draw Interval", value: `${intervalTime || 30} seconds` },
  { label: "Entrance Fee", value: "0.01 ETH" },
];

export const About: React.FC<AboutProps> = ({ intervalTime }) => {
  return (
    <div className="w-full space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-black text-white tracking-tight">How VeriSpin Works</h2>
        <p className="text-xs text-slate-500 mt-1">
          Provably fair randomness, secured by Chainlink&apos;s decentralized oracle network.
        </p>
      </div>

      {/* The 3 steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((s) => (
          <div key={s.n} className="verispin-card rounded-2xl p-6">
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm mb-4 ${s.accent}`}
            >
              {s.n}
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      {/* Specs + verifiability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="verispin-card rounded-3xl p-6 md:p-8">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Protocol Specifications
          </h4>
          <div className="space-y-1 text-xs">
            {specs(intervalTime).map((s) => (
              <div key={s.label} className="flex justify-between py-2.5 border-b border-white/[0.04]">
                <span className="text-slate-400">{s.label}</span>
                <span className="font-mono text-slate-200">{s.value}</span>
              </div>
            ))}
            <div className="flex justify-between py-2.5">
              <span className="text-slate-400">Contract</span>
              <a
                href={`https://sepolia.etherscan.io/address/${RAFFLE_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-rose-400 hover:underline"
              >
                {RAFFLE_ADDRESS.slice(0, 8)}…{RAFFLE_ADDRESS.slice(-6)}
              </a>
            </div>
          </div>
        </div>

        <div className="verispin-card rounded-3xl p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Why It&apos;s Trustless
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Traditional lotteries ask you to trust an operator. VeriSpin removes that trust:
              entries, the prize pool, and winner selection all live on a public smart contract.
              Because the winning index is derived from cryptographically verifiable randomness, no
              one — not even the contract&apos;s deployer — can influence or foresee the outcome.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2.5 text-[10px] text-slate-500">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span>Open-source · Verifiable on Etherscan · Educational testnet demo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
