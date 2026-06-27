import { ethers } from "hardhat";

async function main() {
    const feeData = await ethers.provider.getFeeData();
    console.log("Current Sepolia Gas Price:", ethers.formatUnits(feeData.gasPrice || 0n, "gwei"), "gwei");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
