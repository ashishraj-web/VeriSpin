import { ethers } from "hardhat";

async function main() {
    const raffleAddress = "0xE5f35DDcBF8A333F90A7462625074e41271Ae4D9";
    const raffle = await ethers.getContractAt("Raffle", raffleAddress);

    const vrfCoordinatorV2PlusAddress = "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B";
    const vrfCoordinatorAbi = [
        "function getSubscription(uint256 subId) external view returns (uint96 balance, uint96 nativeBalance, uint64 reqCount, address owner, address[] memory consumers)"
    ];
    const vrfCoordinator = new ethers.Contract(vrfCoordinatorV2PlusAddress, vrfCoordinatorAbi, ethers.provider);

    const balance = await ethers.provider.getBalance(raffleAddress);
    const numPlayers = await raffle.getNumberOfPlayers();
    const raffleState = await raffle.getRaffleState();
    const recentWinner = await raffle.getRecentWinner();
    const lastTimeStamp = await raffle.getLastTimeStamp();

    console.log("\n--------------------------------------------------");
    console.log("Raffle Contract Live Status on Sepolia:");
    console.log("--------------------------------------------------");
    console.log(`Contract Balance: ${ethers.formatEther(balance)} ETH`);
    console.log(`Number of Players: ${numPlayers.toString()}`);
    console.log(`Raffle State: ${raffleState.toString()} (0 = OPEN, 1 = CALCULATING)`);
    console.log(`Recent Winner: ${recentWinner}`);
    console.log(`Last Time Stamp: ${lastTimeStamp.toString()} (${new Date(Number(lastTimeStamp) * 1000).toLocaleString()})`);
    
    try {
        const subId = "48187539322531669621812936502648729785259731175578218918513134717429769376528";
        const subInfo = await vrfCoordinator.getSubscription(subId);
        const subBalance = subInfo[0];
        const subNativeBalance = subInfo[1];
        const subReqCount = subInfo[2];
        const subOwner = subInfo[3];
        const subConsumers = subInfo[4];

        console.log("\n--------------------------------------------------");
        console.log(`Chainlink VRF Subscription Info (ID: ${subId}):`);
        console.log("--------------------------------------------------");
        console.log(`LINK Balance: ${ethers.formatEther(subBalance)} LINK`);
        console.log(`Native Balance: ${ethers.formatEther(subNativeBalance)} ETH`);
        console.log(`Request Count: ${subReqCount.toString()}`);
        console.log(`Subscription Owner: ${subOwner}`);
        console.log(`Registered Consumers:`, subConsumers);
    } catch (e) {
        console.log("\nFailed to fetch Chainlink VRF subscription details:", e);
    }
    console.log("--------------------------------------------------\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
