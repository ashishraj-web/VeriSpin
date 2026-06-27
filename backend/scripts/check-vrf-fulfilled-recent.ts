import { ethers } from "hardhat";

async function main() {
    const coordinatorAddress = "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B";
    const subId = "48187539322531669621812936502648729785259731175578218918513134717429769376528";
    
    const coordinatorAbi = [
        "event RandomWordsFulfilled(uint256 indexed requestId, uint256 outputSeed, uint256 indexed subId, uint96 payment, bool nativePayment, bool success, bool onlyPremium)"
    ];
    const coordinator = new ethers.Contract(coordinatorAddress, coordinatorAbi, ethers.provider);

    const latestBlock = await ethers.provider.getBlockNumber();
    const fromBlock = latestBlock - 9; // Scan last 10 blocks

    console.log(`Scanning coordinator for RandomWordsFulfilled in blocks ${fromBlock} to ${latestBlock}...`);

    try {
        const filterFulfilled = coordinator.filters.RandomWordsFulfilled(null, null, subId);
        const fulfilledEvents = await coordinator.queryFilter(filterFulfilled, fromBlock, latestBlock);
        console.log(`Found ${fulfilledEvents.length} RandomWordsFulfilled events:`);
        for (const event of fulfilledEvents) {
            console.log(`- Request ID: ${event.args[0].toString()}`);
            console.log(`  Success Status: ${event.args[5]}`);
            console.log(`  Tx Hash: ${event.transactionHash}`);
        }
    } catch (e) {
        console.log("Failed to query RandomWordsFulfilled:", e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
