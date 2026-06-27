import { ethers } from "hardhat";
async function main() {
    const raffle = await ethers.getContractAt("Raffle", "0xdbbb19e91c2ba911dc350ca22b5ace10de948029");
    const events = await raffle.queryFilter("RequestedRaffleWinner");
    console.log(events.map(e => ({ requestId: e.args?.requestId?.toString(), transactionHash: e.transactionHash })));
}
main();
