export interface NetworkConfig {
    name: string;
    vrfCoordinatorV2Plus?: string;
    entranceFee: string;
    gasLane: string;
    subscriptionId?: string;
    callbackGasLimit: string;
    interval: string;
}

export const networkConfig: { [chainId: number]: NetworkConfig } = {
    // Sepolia Testnet
    11155111: {
        name: "sepolia",
        vrfCoordinatorV2Plus: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
        entranceFee: "10000000000000000", // 0.01 ETH
        gasLane: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae", // 100 gwei gas lane keyHash for Sepolia V2.5
        subscriptionId: process.env.SEPOLIA_SUBSCRIPTION_ID || "0", // Users will define this in their .env
        callbackGasLimit: "100000", // 100k gas limit (lowered from 500k so that 15 LINK subscription balance is enough)
        interval: "30", // 30 seconds
    },
    // Local / Hardhat
    31337: {
        name: "hardhat",
        entranceFee: "10000000000000000", // 0.01 ETH
        gasLane: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        callbackGasLimit: "100000",
        interval: "30",
    },
};

export const developmentChains = ["hardhat", "localhost"];

// Mocks configuration parameters for VRF V2.5
// BASE_FEE: 0.25 LINK per request (premium fee charged by Chainlink VRF)
export const BASE_FEE = "250000000000000000"; // 0.25 LINK in Wei (1e18)
// GAS_PRICE_LINK: 1e9 LINK per gas (gas price link value calculated by Chainlink)
export const GAS_PRICE_LINK = "1000000000";
// WEI_PER_UNIT_LINK: used by V2.5 mocks to calculate LINK/native conversion
export const WEI_PER_UNIT_LINK = "4000000000000000"; // 0.004 ETH per LINK
