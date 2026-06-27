import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, "../.env") });

async function main() {
    if (!process.env.SEPOLIA_RPC_URL) {
        console.error("SEPOLIA_RPC_URL not found in .env!");
        return;
    }
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const txHash = "0x05c866ed71fddf0444eec8b3640bcafc8beb8e650b1bea90dfc6a76d73f5d0";
    console.log(`Fetching receipt for: ${txHash}`);
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
        console.log("Receipt is null! The transaction might still be pending or doesn't exist.");
        return;
    }
    console.log("Receipt status:", receipt.status); // 1 = Success, 0 = Reverted
    console.log("Receipt logs count:", receipt.logs ? receipt.logs.length : 0);
    console.log("Receipt logs:", JSON.stringify(receipt.logs, null, 2));
}

main().catch(console.error);
