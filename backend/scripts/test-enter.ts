import { ethers } from "hardhat";

async function main() {
    const raffleAddress = "0xE5f35DDcBF8A333F90A7462625074e41271Ae4D9";
    const raffle = await ethers.getContractAt("Raffle", raffleAddress);

    console.log("Sending enterRaffle transaction...");
    const tx = await raffle.enterRaffle({
        value: ethers.parseEther("0.01"),
        gasLimit: 100000
    });
    console.log(`Transaction sent! Hash: ${tx.hash}`);
    
    console.log("Waiting for transaction receipt...");
    const receipt = await tx.wait(1);
    console.log(`Transaction confirmed in block ${receipt?.blockNumber}!`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
