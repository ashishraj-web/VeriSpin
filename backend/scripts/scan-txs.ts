import { ethers } from "hardhat";

async function main() {
    const raffleAddress = "0xFC758F9a1bD7783b2FeE0A884AE6793527Db1Bb5";
    const latestBlock = await ethers.provider.getBlockNumber();
    const startBlock = 11150520; // Block when new contract was deployed
    
    console.log(`Scanning blocks from ${startBlock} to ${latestBlock} (${latestBlock - startBlock + 1} blocks)...`);
    
    const promises = [];
    for (let b = startBlock; b <= latestBlock; b++) {
        promises.push(ethers.provider.getBlock(b, true));
    }
    
    const blocks = await Promise.all(promises);
    let txCount = 0;
    
    console.log("\n--------------------------------------------------");
    console.log(`Transactions to Raffle Contract (${raffleAddress}):`);
    console.log("--------------------------------------------------");
    
    for (const block of blocks) {
        if (!block || !block.prefetchedTransactions) continue;
        for (const tx of block.prefetchedTransactions) {
            if (tx.to && tx.to.toLowerCase() === raffleAddress.toLowerCase()) {
                txCount++;
                const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
                const status = receipt?.status === 1 ? "SUCCESS" : "FAILED (Reverted)";
                
                // Decode function name if possible
                let functionName = "Unknown";
                if (tx.data.startsWith("0x12a1c0d4")) functionName = "enterRaffle()";
                else if (tx.data.startsWith("0x59bc5d7d")) functionName = "performUpkeep(bytes)";
                else if (tx.data.startsWith("0x")) {
                    // Try parsing method ID
                    const methodId = tx.data.substring(0, 10);
                    if (methodId === "0x12a1c0d4" || methodId === "0x115cbaf5") functionName = "enterRaffle()";
                    else if (methodId === "0x4585e33b") functionName = "performUpkeep(bytes)";
                }
                
                console.log(`Tx #${txCount}:`);
                console.log(`  Hash: ${tx.hash}`);
                console.log(`  From: ${tx.from}`);
                console.log(`  Value: ${ethers.formatEther(tx.value)} ETH`);
                console.log(`  Function: ${functionName} (Data: ${tx.data.substring(0, 10)})`);
                console.log(`  Status: ${status}`);
                console.log(`  Block: ${block.number}`);
                console.log("--------------------------------------------------");
            }
        }
    }
    
    if (txCount === 0) {
        console.log("No transactions to this contract found in this block range.");
        console.log("--------------------------------------------------");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
