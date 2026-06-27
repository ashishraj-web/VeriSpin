import * as fs from "fs";
import * as path from "path";

async function main() {
    const filePath = "C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\947ae67a-0bf0-4d96-ae27-48fac3a86bb0\\.system_generated\\steps\\729\\content.md";
    const fileContent = fs.readFileSync(filePath, "utf8");
    
    // Find the JSON part
    const jsonIndex = fileContent.indexOf("{\"status\"");
    if (jsonIndex === -1) {
        console.log("JSON not found in file!");
        return;
    }
    
    const jsonString = fileContent.substring(jsonIndex).trim();
    try {
        const data = JSON.parse(jsonString);
        console.log("\n--------------------------------------------------");
        console.log(`Found ${data.result.length} transactions in history:`);
        console.log("--------------------------------------------------");
        for (let i = 0; i < data.result.length; i++) {
            const tx = data.result[i];
            console.log(`Tx ${i}:`);
            console.log(`  To: ${tx.to}`);
            console.log(`  Value: ${ethers.formatEther(tx.value)} ETH`);
            console.log(`  Function: ${tx.functionName || "transfer / deploy"}`);
            console.log(`  Status: ${tx.txreceipt_status === "1" ? "SUCCESS" : "REVERTED"}`);
            console.log(`  Block: ${tx.blockNumber} (Tx Hash: ${tx.hash})`);
            console.log("--------------------------------------------------");
        }
    } catch (e) {
        console.error("Error parsing JSON:", e);
    }
}

// In standard ts-node, we might not have ethers imported if we don't import from hardhat,
// but since this is run via npx hardhat run, we can import ethers from hardhat!
import { ethers } from "hardhat";
main().catch(console.error);
