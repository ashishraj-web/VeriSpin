import { ethers } from "hardhat";

async function main() {
    const txHash = "0xced1b83ab90a9d7144096028439a958f7ac20e0e4a60a5224ef1bd68f65819b0";
    const tx = await ethers.provider.getTransaction(txHash);
    
    if (!tx) {
        console.log("Transaction not found!");
        return;
    }

    console.log(`Transaction Input length: ${tx.data.length}`);
    
    // The constructor arguments are at the end of the deployment bytecode.
    // In our case, the args are:
    // [vrfCoordinatorV2Address (address), entranceFee (uint256), gasLane (bytes32), subscriptionId (uint64), callbackGasLimit (uint32), interval (uint256)]
    // Let's decode them from the end of the data!
    // Total size of args in ABI encoding:
    // address: 32 bytes (64 hex chars)
    // uint256: 32 bytes (64 hex chars)
    // bytes32: 32 bytes (64 hex chars)
    // uint64: 32 bytes (64 hex chars)
    // uint32: 32 bytes (64 hex chars)
    // uint256: 32 bytes (64 hex chars)
    // Total: 6 * 32 = 192 bytes = 384 hex characters!
    
    const argsHex = "0x" + tx.data.slice(-384);
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const decoded = abiCoder.decode(
        ["address", "uint256", "bytes32", "uint256", "uint32", "uint256"], // Ethers treats uint64 as uint256 for decoding
        argsHex
    );

    console.log("\n--------------------------------------------------");
    console.log("Decoded Constructor Arguments from Deployment Tx:");
    console.log("--------------------------------------------------");
    console.log(`vrfCoordinatorV2: ${decoded[0]}`);
    console.log(`entranceFee: ${ethers.formatEther(decoded[1])} ETH (${decoded[1].toString()} wei)`);
    console.log(`gasLane: ${decoded[2]}`);
    console.log(`subscriptionId: ${decoded[3].toString()}`);
    console.log(`callbackGasLimit: ${decoded[4].toString()}`);
    console.log(`interval: ${decoded[5].toString()}`);
    console.log("--------------------------------------------------\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
