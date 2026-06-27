"use client";

import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { RAFFLE_ADDRESS, RAFFLE_ABI } from "@/constants";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const ENTRANCE_FEE = "0.01";

// Ethereum Sepolia — accept both the hex chainId and the decimal string MetaMask may report.
const SEPOLIA_CHAIN_IDS = ["0xaa36a7", "11155111"];

export type RaffleState = 0 | 1; // 0 = OPEN, 1 = CALCULATING

/** Narrow an unknown thrown value down to a human-readable message. */
function toErrorMessage(e: unknown, fallback: string): string {
  if (typeof e === "object" && e !== null) {
    const maybe = e as { reason?: string; message?: string };
    return maybe.reason || maybe.message || fallback;
  }
  return fallback;
}

export function useRaffle() {
  // Wallet
  const [account, setAccount] = useState<string>("");
  const [networkOk, setNetworkOk] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("0.000");

  // Contract state
  const [numPlayers, setNumPlayers] = useState<number>(0);
  const [playersList, setPlayersList] = useState<string[]>([]);
  const [raffleState, setRaffleState] = useState<number>(0);
  const [recentWinner, setRecentWinner] = useState<string>(ZERO_ADDRESS);
  const [poolSize, setPoolSize] = useState<string>("0.00");
  const [lastTimeStamp, setLastTimeStamp] = useState<number>(0);
  const [intervalTime, setIntervalTime] = useState<number>(0);

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [txMessage, setTxMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const checkNetwork = useCallback((chainId: string) => {
    if (SEPOLIA_CHAIN_IDS.includes(chainId)) {
      setNetworkOk(true);
      setErrorMessage("");
    } else {
      setNetworkOk(false);
      setErrorMessage("Switch your wallet to Ethereum Sepolia to access VeriSpin.");
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        setErrorMessage("Please install MetaMask to interact with VeriSpin.");
        return;
      }
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      setAccount(accounts[0]);

      const chainId = (await window.ethereum.request({ method: "eth_chainId" })) as string;
      checkNetwork(chainId);
    } catch (e: unknown) {
      setErrorMessage(toErrorMessage(e, "Failed to connect wallet."));
    }
  }, [checkNetwork]);

  // Restore an existing connection + subscribe to wallet events.
  useEffect(() => {
    if (typeof window.ethereum === "undefined") return;
    const eth = window.ethereum;

    const handleAccounts = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      setAccount(accounts.length > 0 ? accounts[0] : "");
    };
    const handleChain = (...args: unknown[]) => checkNetwork(args[0] as string);

    eth.on("accountsChanged", handleAccounts);
    eth.on("chainChanged", handleChain);

    eth.request({ method: "eth_accounts" }).then((res) => {
      const accounts = res as string[];
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        eth.request({ method: "eth_chainId" }).then((c) => checkNetwork(c as string));
      }
    });

    return () => {
      eth.removeListener?.("accountsChanged", handleAccounts);
      eth.removeListener?.("chainChanged", handleChain);
    };
  }, [checkNetwork]);

  const fetchContractStats = useCallback(async () => {
    if (typeof window.ethereum === "undefined") return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      if (account) {
        const bal = await provider.getBalance(account);
        setBalance(Number(ethers.formatEther(bal)).toFixed(3));
      }

      const raffle = new ethers.Contract(RAFFLE_ADDRESS, RAFFLE_ABI, provider);
      const [playersCount, state, winner, lastTs, interval, contractBal] = await Promise.all([
        raffle.getNumberOfPlayers(),
        raffle.getRaffleState(),
        raffle.getRecentWinner(),
        raffle.getLastTimeStamp(),
        raffle.getInterval(),
        provider.getBalance(RAFFLE_ADDRESS),
      ]);

      const count = Number(playersCount);
      setNumPlayers(count);
      setRaffleState(Number(state));
      setRecentWinner(winner);
      setLastTimeStamp(Number(lastTs));
      setIntervalTime(Number(interval));
      setPoolSize(Number(ethers.formatEther(contractBal)).toFixed(3));

      const list: string[] = [];
      for (let i = 0; i < count; i++) {
        try {
          const p = await raffle.getPlayer(i);
          list.push(p);
        } catch (err) {
          console.error(err);
        }
      }
      setPlayersList(list);

      const currentTs = Math.floor(Date.now() / 1000);
      setElapsedTime(Math.max(0, currentTs - Number(lastTs)));
    } catch (e) {
      console.error(e);
    }
  }, [account]);

  // Poll on-chain data while connected on the right network.
  // The initial fetch is deferred (timeout 0) so no setState fires synchronously
  // inside the effect body — it only ever runs via timer callbacks.
  useEffect(() => {
    if (!(account && networkOk)) return;
    const initial = setTimeout(fetchContractStats, 0);
    const id = setInterval(fetchContractStats, 5000);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [account, networkOk, fetchContractStats]);

  // Local 1s countdown ticker between polls.
  useEffect(() => {
    if (lastTimeStamp > 0) {
      const id = setInterval(() => {
        const currentTs = Math.floor(Date.now() / 1000);
        setElapsedTime(Math.max(0, currentTs - lastTimeStamp));
      }, 1000);
      return () => clearInterval(id);
    }
  }, [lastTimeStamp]);

  const enterRaffle = useCallback(async () => {
    if (!account || !networkOk) {
      connectWallet();
      return;
    }
    setLoading(true);
    setTxMessage("Authorizing ticket transaction...");
    setErrorMessage("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const raffle = new ethers.Contract(RAFFLE_ADDRESS, RAFFLE_ABI, signer);

      const tx = await raffle.enterRaffle({
        value: ethers.parseEther(ENTRANCE_FEE),
        gasLimit: 120000,
      });

      setTxMessage("Awaiting block confirmation...");
      await tx.wait(1);

      setTxMessage("Successfully entered the draw pool!");
      fetchContractStats();
    } catch (e: unknown) {
      setErrorMessage(toErrorMessage(e, "Transaction aborted."));
    } finally {
      setLoading(false);
      setTimeout(() => setTxMessage(""), 5000);
    }
  }, [account, networkOk, connectWallet, fetchContractStats]);

  const drawWinner = useCallback(async () => {
    if (!account || !networkOk) return;
    setLoading(true);
    setTxMessage("Broadcasting draw query...");
    setErrorMessage("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const raffle = new ethers.Contract(RAFFLE_ADDRESS, RAFFLE_ABI, signer);

      const tx = await raffle.performUpkeep("0x", { gasLimit: 150000 });

      setTxMessage("Query broadcasted! Awaiting Chainlink VRF V2.5 resolution...");
      await tx.wait(1);

      setTxMessage("Fulfillment pending. Winner will be selected in ~1-2 minutes.");
      fetchContractStats();
    } catch (e: unknown) {
      setErrorMessage(toErrorMessage(e, "Failed to trigger draw."));
    } finally {
      setLoading(false);
      setTimeout(() => setTxMessage(""), 6000);
    }
  }, [account, networkOk, fetchContractStats]);

  return {
    // wallet
    account,
    balance,
    networkOk,
    connectWallet,
    // contract
    numPlayers,
    playersList,
    raffleState,
    recentWinner,
    poolSize,
    intervalTime,
    elapsedTime,
    // ui
    loading,
    txMessage,
    errorMessage,
    // actions
    enterRaffle,
    drawWinner,
  };
}

export type UseRaffle = ReturnType<typeof useRaffle>;
