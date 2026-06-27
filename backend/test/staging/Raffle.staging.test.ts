import { deployments, ethers, network, getNamedAccounts } from "hardhat";
import { assert, expect } from "chai";
import { Raffle } from "../../typechain-types";
import { developmentChains } from "../../helper-hardhat-config";

// Run staging tests ONLY on live testnets (e.g. Sepolia)
developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Staging Tests", function () {
      this.timeout(500000); // 500s timeout limit

      let raffle: Raffle;
      let deployer: string;
      let raffleEntranceFee: bigint;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContractAt(
          "Raffle",
          (await deployments.get("Raffle")).address
        );
        raffleEntranceFee = await raffle.getEntranceFee();
      });

      describe("fulfillRandomWords", function () {
        it("works with live Chainlink VRF and Chainlink Keepers, picking a winner dynamically", async function () {
          console.log("Setting up test...");
          const startingTimeStamp = await raffle.getLastTimeStamp();
          const accounts = await ethers.getSigners();

          console.log("Setting up listener for WinnerPicked event...");
          await new Promise<void>(async (resolve, reject) => {
            // Setup listener
            raffle.once(raffle.filters.WinnerPicked, async () => {
              console.log("WinnerPicked event fired!");
              try {
                // Fetch final states
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerEndingBalance = await ethers.provider.getBalance(accounts[0].address);
                const endingTimeStamp = await raffle.getLastTimeStamp();

                // Asserts
                await expect(raffle.getPlayer(0)).to.be.reverted;
                assert.equal(recentWinner, accounts[0].address);
                assert.equal(raffleState.toString(), "0"); // Reset to OPEN
                assert(endingTimeStamp > startingTimeStamp);
                
                // Assert balance updated correctly (accounting for gas)
                assert.equal(
                  winnerEndingBalance.toString(),
                  (winnerStartingBalance + raffleEntranceFee).toString() // winner got their entrance fee back minus gas
                );
                resolve();
              } catch (error) {
                console.log(error);
                reject(error);
              }
            });

            const raffleState = await raffle.getRaffleState();
            if (raffleState.toString() !== "0") {
              reject(new Error("Raffle is currently in CALCULATING state (waiting for Chainlink VRF fulfillment from the previous draw). Please wait for the oracle node to deliver the random number and reset the contract to OPEN before running this test."));
              return;
            }

            console.log("Entering Raffle...");
            const tx = await raffle.enterRaffle({ 
              value: raffleEntranceFee,
              gasLimit: 100000 // Bypass gas estimation to prevent RPC node hang
            });
            await tx.wait(1);
            console.log("Entered Raffle successfully!");
            const winnerStartingBalance = await ethers.provider.getBalance(accounts[0].address);

            // In staging, we do not call performUpkeep manually.
            // We let Chainlink Automation (or VRF) do its job in the background and wait.
            console.log("Waiting for WinnerPicked event (this may take a few minutes)...");
          });
        });
      });
    });
