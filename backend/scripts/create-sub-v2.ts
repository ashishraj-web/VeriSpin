import { ethers, network } from "hardhat";

async function main() {
    if (network.name === "hardhat" || network.name === "localhost") {
        console.log("This script is only for live networks (Sepolia)!");
        return;
    }

    const vrfCoordinatorV2Address = "0x8103b0a8a00be2ddc778e6e7eaa21791cd364625";
    
    const vrfCoordinatorAbi = [
        "function createSubscription() external returns (uint64)",
        "event SubscriptionCreated(uint64 indexed subId, address owner)"
    ];

    const [signer] = await ethers.getSigners();
    console.log(`Creating VRF V2 subscription on Sepolia using account: ${signer.address}`);

    const vrfCoordinator = new ethers.Contract(
        vrfCoordinatorV2Address,
        vrfCoordinatorAbi,
        signer
    );

    console.log("Sending transaction to create subscription...");
    const tx = await vrfCoordinator.createSubscription();
    console.log(`Transaction submitted! Hash: ${tx.hash}`);
    console.log("Waiting for block confirmations...");
    
    const receipt = await tx.wait(1);

    console.log("\n--------------------------------------------------");
    console.log("Transaction Receipt Status:", receipt!.status === 1 ? "SUCCESS" : "FAILED (Reverted)");
    console.log("Receipt Logs Count:", receipt!.logs ? receipt!.logs.length : 0);
    console.log("--------------------------------------------------\n");

    if (!receipt!.logs || receipt!.logs.length === 0) {
        console.log("No logs were found in the receipt. If the transaction failed, please check your gas/ETH balance.");
        return;
    }

    try {
        const event = vrfCoordinator.interface.parseLog(receipt!.logs[0]);
        const subscriptionId = event?.args.subId.toString();

        console.log(`🎉 Success! VRF V2 Subscription Created.`);
        console.log(`Subscription ID: ${subscriptionId}`);
        console.log(`1. Put this ID in your .env file as SEPOLIA_SUBSCRIPTION_ID`);
        console.log(`2. Go to https://vrf.chain.link/ to see it listed under 'My Subscriptions'`);
        console.log(`3. Fund it with LINK via the UI!`);
    } catch (parseError) {
        console.log("Failed to parse logs automatically. Raw logs:");
        console.log(JSON.stringify(receipt!.logs, null, 2));
        console.error(parseError);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
