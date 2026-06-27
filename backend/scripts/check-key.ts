import { ethers } from "hardhat";

async function main() {
    const signers = await ethers.getSigners();
    console.log("Signer 0 Address:", signers[0].address);
    const balance = await ethers.provider.getBalance(signers[0].address);
    console.log("Signer 0 Balance:", ethers.formatEther(balance), "ETH");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
