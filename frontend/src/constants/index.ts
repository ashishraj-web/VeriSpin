export const RAFFLE_ADDRESS = "0xE5f35DDcBF8A333F90A7462625074e41271Ae4D9";

export const RAFFLE_ABI = [
  "function enterRaffle() external payable",
  "function performUpkeep(bytes calldata performData) external",
  "function getEntranceFee() external view returns (uint256)",
  "function getNumberOfPlayers() external view returns (uint256)",
  "function getRaffleState() external view returns (uint256)",
  "function getRecentWinner() external view returns (address)",
  "function getLastTimeStamp() external view returns (uint256)",
  "function getInterval() external view returns (uint256)",
  "function getPlayer(uint256 index) external view returns (address)"
];
