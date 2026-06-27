import { ethers } from "hardhat";

async function main() {
    const coordinatorAddress = "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B";
    const requestId = "39224041480237982523213299491472955690894367573720367143331978990714570275717";

    const coordinatorAbi = [
        "function s_requestCommitments(uint256 requestId) external view returns (bytes32)"
    ];
    const coordinator = new ethers.Contract(coordinatorAddress, coordinatorAbi, ethers.provider);

    console.log(`Checking request commitment for Request ID ${requestId}...`);
    try {
        const commitment = await coordinator.s_requestCommitments(requestId);
        console.log(`Commitment: ${commitment}`);
        if (commitment === ethers.ZeroHash) {
            console.log("Commitment is zero. The request is either non-existent or has already been fulfilled!");
        } else {
            console.log("Commitment is non-zero. The request is pending fulfillment by the oracle node.");
        }
    } catch (e) {
        console.log("Failed to query commitment:", e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
