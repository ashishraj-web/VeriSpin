import { ethers } from "hardhat";

async function main() {
    const userAddress = "0x676bcb9fd998d8283f43f3a7e438aaa7670b4d67";
    const latestBlock = await ethers.provider.getBlockNumber();
    const startBlock = latestBlock - 150; // Scan last 150 blocks
    
    console.log(`Scanning last 50 blocks (from ${startBlock} to ${latestBlock}) for your new contract deployment...`);
    
    const promises = [];
    for (let b = startBlock; b <= latestBlock; b++) {
        promises.push(ethers.provider.getBlock(b, true));
    }
    
    const blocks = await Promise.all(promises);
    let newContractAddress = "";

    for (const block of blocks) {
        if (!block || !block.prefetchedTransactions) continue;
        for (const tx of block.prefetchedTransactions) {
            if (tx.from.toLowerCase() === userAddress.toLowerCase() && !tx.to) {
                // This is a contract deployment!
                const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
                if (receipt && receipt.contractAddress) {
                    newContractAddress = receipt.contractAddress;
                    console.log(`Found newly deployed contract: ${newContractAddress} in block ${block.number}`);
                }
            }
        }
    }

    if (!newContractAddress) {
        console.log("Could not find a new contract deployment in the last 50 blocks.");
        return;
    }

    // Now query the status of this new contract!
    const raffle = await ethers.getContractAt("Raffle", newContractAddress);
    const balance = await ethers.provider.getBalance(newContractAddress);
    const numPlayers = await raffle.getNumberOfPlayers();
    const raffleState = await raffle.getRaffleState();
    const recentWinner = await raffle.getRecentWinner();
    const lastTimeStamp = await raffle.getLastTimeStamp();

    console.log("\n--------------------------------------------------");
    console.log(`NEW Raffle Contract Live Status (${newContractAddress}):`);
    console.log("--------------------------------------------------");
    console.log(`Contract Balance: ${ethers.formatEther(balance)} ETH`);
    console.log(`Number of Players: ${numPlayers.toString()}`);
    console.log(`Raffle State: ${raffleState.toString()} (0 = OPEN, 1 = CALCULATING)`);
    console.log(`Recent Winner: ${recentWinner}`);
    console.log(`Last Time Stamp: ${lastTimeStamp.toString()} (${new Date(Number(lastTimeStamp) * 1000).toLocaleString()})`);
    console.log("--------------------------------------------------\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
