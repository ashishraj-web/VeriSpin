import { ethers } from "hardhat";

async function main() {
    const userAddress = "0x676bcb9fd998d8283f43f3a7e438aaa7670b4d67";
    const latestBlock = await ethers.provider.getBlockNumber();
    const startBlock = latestBlock - 80; // Scan last 80 blocks (about 15-20 minutes)
    
    console.log(`Scanning last 80 blocks (from ${startBlock} to ${latestBlock}) for transactions from ${userAddress}...`);
    
    const promises = [];
    for (let b = startBlock; b <= latestBlock; b++) {
        promises.push(ethers.provider.getBlock(b, true));
    }
    
    const blocks = await Promise.all(promises);
    let txCount = 0;
    
    console.log("\n--------------------------------------------------");
    console.log(`Transactions sent by ${userAddress}:`);
    console.log("--------------------------------------------------");
    
    for (const block of blocks) {
        if (!block || !block.prefetchedTransactions) continue;
        for (const tx of block.prefetchedTransactions) {
            if (tx.from.toLowerCase() === userAddress.toLowerCase()) {
                txCount++;
                const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
                const status = receipt?.status === 1 ? "SUCCESS" : "FAILED (Reverted)";
                
                // Decode function name if possible
                let functionName = "Unknown";
                if (!tx.to) {
                    functionName = "Contract Deployment";
                    if (receipt && receipt.contractAddress) {
                        functionName += ` (Created: ${receipt.contractAddress})`;
                    }
                } else if (tx.data.startsWith("0x12a1c0d4") || tx.data.startsWith("0x115cbaf5") || tx.data.startsWith("0x2cfcc539")) {
                    functionName = "enterRaffle()";
                } else if (tx.data.startsWith("0x4585e33b") || tx.data.startsWith("0x59bc5d7d")) {
                    functionName = "performUpkeep(bytes)";
                } else {
                    functionName = `Data: ${tx.data.substring(0, 10)}`;
                }
                
                console.log(`Tx #${txCount}:`);
                console.log(`  Hash: ${tx.hash}`);
                console.log(`  To: ${tx.to || "Contract Creation"}`);
                console.log(`  Value: ${ethers.formatEther(tx.value)} ETH`);
                console.log(`  Function: ${functionName}`);
                console.log(`  Status: ${status}`);
                console.log(`  Block: ${block.number}`);
                console.log("--------------------------------------------------");
            }
        }
    }
    
    if (txCount === 0) {
        console.log("No transactions sent by this address found in this block range.");
        console.log("--------------------------------------------------");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
