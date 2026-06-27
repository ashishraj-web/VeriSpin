"use client";

import React from "react";
import { DrawConsole } from "@/components/DrawConsole";
import { EntrantsQueue } from "@/components/EntrantsQueue";

interface PlayProps {
  raffleState: number;
  numPlayers: number;
  loading: boolean;
  account: string;
  networkOk: boolean;
  playersList: string[];
  enterRaffle: () => void;
  drawWinner: () => void;
}

export const Play: React.FC<PlayProps> = ({
  raffleState,
  numPlayers,
  loading,
  account,
  networkOk,
  playersList,
  enterRaffle,
  drawWinner,
}) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-black text-white tracking-tight">Play the Draw</h2>
        <p className="text-xs text-slate-500 mt-1">
          Buy a ticket for 0.01 ETH, then trigger the draw once the timer elapses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <DrawConsole
            raffleState={raffleState}
            numPlayers={numPlayers}
            loading={loading}
            account={account}
            networkOk={networkOk}
            enterRaffle={enterRaffle}
            drawWinner={drawWinner}
          />
        </div>
        <div className="lg:col-span-5">
          <EntrantsQueue playersList={playersList} account={account} />
        </div>
      </div>
    </div>
  );
};
