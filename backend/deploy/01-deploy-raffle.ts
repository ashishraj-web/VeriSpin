import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import { ethers } from "hardhat";

// 1000 LINK in Wei (1000 * 10^18) to fund our local subscription mock
// V2.5 mock calculates larger payments due to gas-to-LINK conversion
const VRF_SUB_FUND_AMOUNT = "1000000000000000000000";

const deployRaffle: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId!;

    let vrfCoordinatorV2PlusAddress: string;
    let subscriptionId: string;

    if (developmentChains.includes(network.name)) {
        // On local networks, we fetch our deployed Mock VRF Coordinator V2.5
        const vrfCoordinatorV2_5Mock = await ethers.getContractAt(
            "VRFCoordinatorV2_5Mock",
            (await deployments.get("VRFCoordinatorV2_5Mock")).address
        );
        vrfCoordinatorV2PlusAddress = await vrfCoordinatorV2_5Mock.getAddress();

        // Programmatically create a Chainlink VRF V2.5 subscription
        const transactionResponse = await vrfCoordinatorV2_5Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);

        // Parse the SubscriptionCreated event logs to extract the subscription ID
        const event = vrfCoordinatorV2_5Mock.interface.parseLog(transactionReceipt.logs[0]);
        subscriptionId = event?.args.subId.toString() || "0";

        // Fund the mock subscription with mock LINK
        await vrfCoordinatorV2_5Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);
    } else {
        // On live networks, we read addresses from our helper config
        vrfCoordinatorV2PlusAddress = networkConfig[chainId].vrfCoordinatorV2Plus!;
        subscriptionId = networkConfig[chainId].subscriptionId!;
    }

    const entranceFee = networkConfig[chainId].entranceFee;
    const gasLane = networkConfig[chainId].gasLane;
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit;
    const interval = networkConfig[chainId].interval;

    const args = [
        vrfCoordinatorV2PlusAddress,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        interval,
    ];

    log("Deploying Raffle...");
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
    });
    log(`Raffle deployed at ${raffle.address}`);

    // CRITICAL SECURITY STEP FOR CHAINLINK VRF V2.5:
    // We must register the Raffle contract as a consumer on our coordinator subscription.
    // Without this, the coordinator will reject requests from our contract on-chain.
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2_5Mock = await ethers.getContractAt(
            "VRFCoordinatorV2_5Mock",
            vrfCoordinatorV2PlusAddress
        );
        await vrfCoordinatorV2_5Mock.addConsumer(subscriptionId, raffle.address);
        log("Raffle contract added as a consumer to the Mock VRF V2.5 subscription.");
    }

    log("--------------------------------------------------");
};

export default deployRaffle;
deployRaffle.tags = ["all", "raffle"];
