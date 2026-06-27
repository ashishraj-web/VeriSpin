import { ethers } from "hardhat";

async function main() {
    const txHash = "0xbd0dc80fedde8b4e61f7f42f223c596e7137fb16c9b5f6ad64f65aef60f2cdc6";
    const receipt = await ethers.provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
        console.log("Transaction receipt not found!");
        return;
    }

    console.log("\n--------------------------------------------------");
    console.log(`Transaction Receipt Details for: ${txHash}`);
    console.log("--------------------------------------------------");
    console.log(`Status: ${receipt.status === 1 ? "SUCCESS" : "FAILED (Reverted)"}`);
    console.log(`Block Number: ${receipt.blockNumber}`);
    console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
    console.log(`Logs Count: ${receipt.logs.length}`);
    console.log("--------------------------------------------------");

    const raffleInterface = new ethers.Interface([
        "event RaffleEnter(address indexed player)",
        "event RequestedRaffleWinner(uint256 indexed requestId)",
        "event WinnerPicked(address indexed winner)"
    ]);

    for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        console.log(`Log ${i} emitted by: ${log.address}`);
        try {
            const parsedLog = raffleInterface.parseLog(log);
            console.log(`  Parsed Event: ${parsedLog?.name}, Args: ${JSON.stringify(parsedLog?.args)}`);
        } catch (e) {
            console.log(`  Unrecognized log topics: ${JSON.stringify(log.topics)}`);
            console.log(`  Raw Data: ${log.data}`);
        }
    }
    console.log("--------------------------------------------------\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
