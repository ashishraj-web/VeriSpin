import { ethers } from "hardhat";

async function main() {
    const raffleAddress = "0xE5f35DDcBF8A333F90A7462625074e41271Ae4D9";
    const raffle = await ethers.getContractAt("Raffle", raffleAddress);

    const latestBlock = await ethers.provider.getBlockNumber();
    const fromBlock = latestBlock - 9; // Scan exactly the last 10 blocks to respect Alchemy free limit

    console.log(`Scanning blocks ${fromBlock} to ${latestBlock}...`);

    try {
        const requestedEvents = await raffle.queryFilter(raffle.filters.RequestedRaffleWinner(), fromBlock, latestBlock);
        console.log(`\nFound ${requestedEvents.length} RequestedRaffleWinner events:`);
        for (const event of requestedEvents) {
            console.log(`- Request ID: ${event.args[0].toString()}`);
            console.log(`  Tx Hash: ${event.transactionHash}`);
        }
    } catch (e) {
        console.log("Failed to query RequestedRaffleWinner events:", e);
    }

    try {
        const winnerEvents = await raffle.queryFilter(raffle.filters.WinnerPicked(), fromBlock, latestBlock);
        console.log(`\nFound ${winnerEvents.length} WinnerPicked events:`);
        for (const event of winnerEvents) {
            console.log(`- Winner: ${event.args[0]}`);
            console.log(`  Tx Hash: ${event.transactionHash}`);
        }
    } catch (e) {
        console.log("Failed to query WinnerPicked events:", e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
