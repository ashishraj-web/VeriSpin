import { ethers } from "hardhat";

async function main() {
    const coordinatorAddress = "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B";
    
    console.log(`Checking coordinator address ${coordinatorAddress} activity...`);
    
    // Let's get the latest block number
    const latestBlock = await ethers.provider.getBlockNumber();
    console.log(`Current Block: ${latestBlock}`);

    // Let's query the coordinator's recent events in the last 20 blocks
    const coordinatorAbi = [
        "event RandomWordsFulfilled(uint256 indexed requestId, uint256 outputSeed, uint256 indexed subId, uint96 payment, bool nativePayment, bool success, bool onlyPremium)"
    ];
    const coordinator = new ethers.Contract(coordinatorAddress, coordinatorAbi, ethers.provider);

    const fromBlock = latestBlock - 9; // Last 10 blocks (respecting Alchemy free limits)
    try {
        const filter = coordinator.filters.RandomWordsFulfilled();
        const events = await coordinator.queryFilter(filter, fromBlock, latestBlock);
        console.log(`\nFound ${events.length} RandomWordsFulfilled events across all subscriptions in the last 10 blocks.`);
        if (events.length > 0) {
            console.log("Coordinator is active! Latest fulfillments:");
            for (const event of events.slice(0, 5)) {
                console.log(`- Request ID: ${event.args[0].toString()}`);
                console.log(`  Sub ID: ${event.args[2].toString()}`);
                console.log(`  Tx Hash: ${event.transactionHash}`);
            }
        } else {
            console.log("No fulfillments found in the last 10 blocks. The Sepolia VRF oracle nodes might be experiencing a delay or downtime.");
        }
    } catch (e) {
        console.log("Error querying coordinator events:", e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
