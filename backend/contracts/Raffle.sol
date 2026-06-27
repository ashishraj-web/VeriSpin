// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

/**
 * @title Raffle Smart Contract
 * @author Hardhat & TS Course Student (Mentored by Antigravity)
 * @notice This contract implements a decentralized, verifiably fair lottery using Chainlink VRF V2.5
 *         and Chainlink Automation (Keepers).
 */
contract Raffle is VRFConsumerBaseV2Plus {
    /* Type declarations */
    enum RaffleState {
        OPEN,         // Players can enter
        CALCULATING   // Drawing a winner (no new entries allowed)
    }

    /* State Variables */
    // Lottery Configurations
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    RaffleState private s_raffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    // Chainlink VRF V2.5 Configurations
    bytes32 private immutable i_gasLane; // keyHash (gas price limit for requesting randomness)
    uint256 private immutable i_subscriptionId; // Subscription ID (uint256 in V2.5)
    uint32 private immutable i_callbackGasLimit; // Limit on gas consumed by fulfillRandomWords callback
    uint16 private constant REQUEST_CONFIRMATIONS = 3; // How many block confirmations coordinator should wait
    uint32 private constant NUM_WORDS = 1; // How many random numbers we want

    // Lottery Lot State
    address private s_recentWinner;

    /* Events */
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    /* Custom Errors (Gas-efficient reverts) */
    error Raffle__NotEnoughETHEntered();
    error Raffle__TransferFailed();
    error Raffle__NotOpen();
    error Raffle__UpkeepNotNeeded(
        uint256 currentBalance,
        uint256 numPlayers,
        uint256 raffleState
    );

    /* Constructor */
    /**
     * @param vrfCoordinatorV2Plus Address of the Chainlink VRF V2.5 Coordinator contract on Sepolia or local mock
     * @param entranceFee Entry fee in Wei
     * @param gasLane Key hash (max gas price you are willing to pay for request)
     * @param subscriptionId Subscription ID funded with LINK for Coordinator fees
     * @param callbackGasLimit Gas limit for the callback fulfillRandomWords call
     * @param interval Time interval (in seconds) between lottery rounds
     */
    constructor(
        address vrfCoordinatorV2Plus,
        uint256 entranceFee,
        bytes32 gasLane,
        uint256 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2Plus(vrfCoordinatorV2Plus) {
        i_entranceFee = entranceFee;
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    /* Core Functions */

    /**
     * @notice Allows a player to enter the lottery by paying the entrance fee
     */
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__NotOpen();
        }
        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    /**
     * @dev This is the function that the Chainlink Keeper nodes look at
     *      to see if they should trigger `performUpkeep`.
     *      The following conditions must be true for upkeepNeeded to be true:
     *      1. Time interval must have passed
     *      2. Raffle must have at least 1 player and some ETH balance
     *      3. Subscription must be funded with LINK
     *      4. Raffle state must be OPEN (we shouldn't trigger if we are already calculating a winner!)
     */
    function checkUpkeep(
        bytes memory /* checkData */
    ) public view returns (bool upkeepNeeded, bytes memory /* performData */) {
        bool isOpen = (RaffleState.OPEN == s_raffleState);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = (address(this).balance > 0);
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
        return (upkeepNeeded, "0x");
    }

    /**
     * @dev Requests a random number from Chainlink VRF V2.5 to draw the winner.
     *      Automatically called by Chainlink Keeper nodes when checkUpkeep returns true.
     */
    function performUpkeep(bytes calldata /* performData */) external {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );
        }
        s_raffleState = RaffleState.CALCULATING;

        // Request random numbers from coordinator using the V2.5 struct format
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_gasLane,
                subId: i_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        emit RequestedRaffleWinner(requestId);
    }

    /**
     * @dev Callback function called by Chainlink VRF Coordinator once the random number is generated.
     *      We override this function from VRFConsumerBaseV2Plus.
     * @param randomWords Array of random numbers generated by Chainlink VRF
     */
    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] calldata randomWords
    ) internal override {
        // Use modulo arithmetic to select the winner from our players array
        // randomWord % players.length = index of the winner (e.g. 524582947239 % 5 = 4)
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;

        // Reset lottery state
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;

        // Send the balance of the contract to the winner
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    /* Getter Functions (Clean storage encapsulation) */

    function getEntranceFee() external view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) external view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() external view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() external view returns (RaffleState) {
        return s_raffleState;
    }

    function getNumWords() external pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() external view returns (uint256) {
        return s_players.length;
    }

    function getLastTimeStamp() external view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getInterval() external view returns (uint256) {
        return i_interval;
    }
}
