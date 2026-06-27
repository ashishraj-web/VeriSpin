import { ethers } from "hardhat";

async function main() {
    const address = "0x676Bcb9Fd998D8283f43F3a7e438AaA7670b4D67";
    const minedCount = await ethers.provider.getTransactionCount(address, "latest");
    const pendingCount = await ethers.provider.getTransactionCount(address, "pending");

    console.log(`Mined Transaction Count: ${minedCount}`);
    console.log(`Pending Transaction Count: ${pendingCount}`);

    if (pendingCount > minedCount) {
        console.log(`There are ${pendingCount - minedCount} pending transactions stuck in the mempool for this address!`);
    } else {
        console.log("No pending transactions in the mempool.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
