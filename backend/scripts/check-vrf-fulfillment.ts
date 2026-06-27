import { ethers } from "hardhat";

async function main() {
    const coordinatorAddress = "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B";
    const subId = "48187539322531669621812936502648729785259731175578218918513134717429769376528";
    
    const coordinatorAbi = [
        "event RandomWordsFulfilled(uint256 indexed requestId, uint256 outputSeed, uint256 indexed subId, uint96 payment, bool nativePayment, bool success, bool onlyPremium)",
        "event RandomWordsRequested(bytes32 indexed keyHash, uint256 requestId, uint256 preSeed, uint256 indexed subId, uint16 minimumRequestConfirmations, uint32 callbackGasLimit, uint32 numWords, bytes extraArgs, address indexed sender)"
    ];
    const coordinator = new ethers.Contract(coordinatorAddress, coordinatorAbi, ethers.provider);

    // Let's scan block range 11151145 to 11151154 where the request transaction occurred
    const fromBlock = 11151145;
    const toBlock = 11151154;

    console.log(`Scanning coordinator events in blocks ${fromBlock} to ${toBlock}...`);

    try {
        const filterReq = coordinator.filters.RandomWordsRequested(null, null, null, subId);
        const reqEvents = await coordinator.queryFilter(filterReq, fromBlock, toBlock);
        console.log(`Found ${reqEvents.length} RandomWordsRequested events for our subId:`);
        for (const event of reqEvents) {
            console.log(`- Request ID: ${event.args[1].toString()}`);
            console.log(`  Sender: ${event.args[8]}`);
            console.log(`  Tx Hash: ${event.transactionHash}`);
        }
    } catch (e) {
        console.log("Failed to query RandomWordsRequested:", e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
