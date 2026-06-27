import { ethers } from "hardhat";

async function main() {
    const txHash = "0x0219f8962ba277a87260dbcf404443ca8c3400af6a742d062d066019dbb03ebc";
    const receipt = await ethers.provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
        console.log("Transaction receipt not found!");
        return;
    }

    const vrfCoordinatorAbi = [
        "event RandomWordsRequested(bytes32 indexed keyHash, uint256 requestId, uint256 preSeed, uint64 indexed subId, uint16 minimumRequestConfirmations, uint32 callbackGasLimit, uint32 numWords, address indexed sender)"
    ];
    
    const vrfInterface = new ethers.Interface(vrfCoordinatorAbi);
    const log = receipt.logs[0];
    
    try {
        const parsedLog = vrfInterface.parseLog(log);
        console.log("\n--------------------------------------------------");
        console.log("Decoded Chainlink VRF Coordinator Log:");
        console.log("--------------------------------------------------");
        console.log(`Event: ${parsedLog?.name}`);
        console.log(`RequestId: ${parsedLog?.args.requestId.toString()}`);
        console.log(`SubscriptionId: ${parsedLog?.args.subId.toString()}`);
        console.log(`CallbackGasLimit: ${parsedLog?.args.callbackGasLimit.toString()}`);
        console.log(`NumWords: ${parsedLog?.args.numWords.toString()}`);
        console.log(`Sender (Raffle Contract): ${parsedLog?.args.sender}`);
        console.log("--------------------------------------------------\n");
    } catch (e) {
        console.log("Failed to parse coordinator log:", e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
