"use client";

import React from "react";
import { RAFFLE_ADDRESS } from "@/constants";

export const Footer: React.FC = () => {
  const links = [
    {
      label: "Etherscan",
      href: `https://sepolia.etherscan.io/address/${RAFFLE_ADDRESS}`,
    },
    {
      label: "Chainlink VRF",
      href: "https://docs.chain.link/vrf",
    },
    {
      label: "Sepolia Faucet",
      href: "https://faucets.chain.link/sepolia",
    },
    // TODO: add your GitHub repo link here, e.g.
    // { label: "GitHub", href: "https://github.com/<your-username>/nextjs-smartcontract-lottery" },
  ];

  return (
    <footer className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 mt-12 px-6 py-6 border-t border-white/[0.05] z-10 gap-3">
      <p>
        &copy; {new Date().getFullYear()} VeriSpin Protocol · Built on Chainlink VRF · Educational
        demo on Sepolia testnet.
      </p>
      <div className="flex gap-5 font-medium">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300 transition"
          >
            {l.label}
          </a>
        ))}
      </div>
    </footer>
  );
};
