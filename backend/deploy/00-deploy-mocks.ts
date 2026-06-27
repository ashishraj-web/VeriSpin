import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, BASE_FEE, GAS_PRICE_LINK, WEI_PER_UNIT_LINK } from "../helper-hardhat-config";

// Deploy function for mocks (only runs on local networks)

const deployMocks: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    // Check if the current network requires mock deployments
    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...");

        // Deploy the VRF Coordinator V2.5 mock contract
        await deploy("VRFCoordinatorV2_5Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK, WEI_PER_UNIT_LINK], // V2.5 mock requires 3 args
        });

        log("Mocks deployed!");
        log("--------------------------------------------------");
    }
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];
