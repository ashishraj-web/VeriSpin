import { deployments, ethers, network, getNamedAccounts } from "hardhat";
import { assert, expect } from "chai";
import { Raffle, VRFCoordinatorV2_5Mock } from "../../typechain-types";
import { developmentChains, networkConfig } from "../../helper-hardhat-config";

// Run unit tests ONLY on local development chains (Hardhat / Localhost)
// Live testnet testing is handled via staging tests
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", function () {
      let raffle: Raffle;
      let vrfCoordinatorV2_5Mock: VRFCoordinatorV2_5Mock;
      let deployer: string;
      let raffleEntranceFee: bigint;
      let interval: bigint;
      const chainId = network.config.chainId!;

      beforeEach(async function () {
        // 1. Fetch named account address
        deployer = (await getNamedAccounts()).deployer;

        // 2. Deploy mocks and raffle contract using hardhat-deploy fixtures
        await deployments.fixture(["all"]);

        // 3. Fetch contract instances using the deployed addresses
        raffle = await ethers.getContractAt(
          "Raffle",
          (
            await deployments.get("Raffle")
          ).address,
        );
        vrfCoordinatorV2_5Mock = await ethers.getContractAt(
          "VRFCoordinatorV2_5Mock",
          (
            await deployments.get("VRFCoordinatorV2_5Mock")
          ).address,
        );

        // 4. Cache parameters to use across multiple tests
        raffleEntranceFee = await raffle.getEntranceFee();
        interval = await raffle.getInterval();
      });

      describe("constructor", function () {
        it("initializes the raffle correctly", async function () {
          const raffleState = await raffle.getRaffleState();
          const raffleInterval = await raffle.getInterval();

          // State 0 = OPEN
          assert.equal(raffleState.toString(), "0");
          assert.equal(raffleInterval.toString(), interval.toString());
        });
      });

      describe("enterRaffle", function () {
        it("reverts when you don't pay enough", async function () {
          await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(
            raffle,
            "Raffle__NotEnoughETHEntered",
          );
        });

        it("records players when they enter", async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          const playerFromContract = await raffle.getPlayer(0);
          assert.equal(playerFromContract, deployer);
        });

        it("emits event on enter", async function () {
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee }),
          ).to.emit(raffle, "RaffleEnter");
        });

        it("does not allow entrance when raffle is calculating", async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });

          // Simulate passage of time and mine block
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);

          // Request drawing a winner (state shifts to CALCULATING)
          await raffle.performUpkeep("0x");

          // Try to enter again and check for custom error revert
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee }),
          ).to.be.revertedWithCustomError(raffle, "Raffle__NotOpen");
        });
      });

      describe("checkUpkeep", function () {
        it("returns false if people haven't sent any ETH", async function () {
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);

          // checkUpkeep is a view function, so we simulate it using callStatic equivalent in Ethers v6
          const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x");
          assert(!upkeepNeeded);
        });

        it("returns false if raffle isn't open", async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);

          await raffle.performUpkeep("0x"); // Shifts state to CALCULATING

          const raffleState = await raffle.getRaffleState();
          const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x");

          assert.equal(raffleState.toString(), "1"); // CALCULATING
          assert(!upkeepNeeded);
        });

        it("returns false if enough time hasn't passed", async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          // Increase time but NOT enough to exceed interval
          await network.provider.send("evm_increaseTime", [
            Number(interval) - 5,
          ]);
          await network.provider.send("evm_mine", []);

          const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x");
          assert(!upkeepNeeded);
        });

        it("returns true if enough time has passed, has players, has eth, and is open", async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);

          const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x");
          assert(upkeepNeeded);
        });
      });

      describe("performUpkeep", function () {
        it("can only run if checkUpkeep is true", async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);

          const tx = await raffle.performUpkeep("0x");
          assert(tx);
        });

        it("reverts with Raffle__UpkeepNotNeeded if checkUpkeep is false", async function () {
          await expect(
            raffle.performUpkeep("0x"),
          ).to.be.revertedWithCustomError(raffle, "Raffle__UpkeepNotNeeded");
        });

        it("updates the raffle state, emits an event, and calls the vrf coordinator", async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);

          const txResponse = await raffle.performUpkeep("0x");
          const txReceipt = await txResponse.wait(1);

          // Extract the requestId from our emitted event RequestedRaffleWinner
          // Index 1 because VRFCoordinatorV2_5Mock emits RandomWordsRequested (Index 0) first
          const eventLog = raffle.interface.parseLog(txReceipt!.logs[1]);
          const requestId = eventLog?.args.requestId;

          const raffleState = await raffle.getRaffleState();

          assert(Number(requestId) > 0);
          assert.equal(raffleState.toString(), "1"); // CALCULATING
        });
      });

      describe("fulfillRandomWords", function () {
        beforeEach(async function () {
          // Setup to ensure upkeep is needed before callback tests
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
        });

        it("can only be called after performUpkeep", async function () {
          await expect(
            vrfCoordinatorV2_5Mock.fulfillRandomWords(
              0,
              await raffle.getAddress(),
            ),
          ).to.be.revertedWithCustomError(
            vrfCoordinatorV2_5Mock,
            "InvalidRequest",
          );

          await expect(
            vrfCoordinatorV2_5Mock.fulfillRandomWords(
              1,
              await raffle.getAddress(),
            ),
          ).to.be.revertedWithCustomError(
            vrfCoordinatorV2_5Mock,
            "InvalidRequest",
          );
        });

        it("picks a winner, resets the lottery, and sends the money", async function () {
          const additionalEntrants = 3;
          const startingAccountIndex = 1; // deployer = 0
          const accounts = await ethers.getSigners();

          // Connect additional accounts to enter the raffle
          for (
            let i = startingAccountIndex;
            i < startingAccountIndex + additionalEntrants;
            i++
          ) {
            const accountConnectedRaffle = raffle.connect(accounts[i]);
            await accountConnectedRaffle.enterRaffle({
              value: raffleEntranceFee,
            });
          }

          const startingTimeStamp = await raffle.getLastTimeStamp();

          // Cache starting balances for all accounts (so we can check them dynamically later)
          const startingBalances: bigint[] = [];
          for (let i = 0; i < startingAccountIndex + additionalEntrants; i++) {
            startingBalances[i] = await ethers.provider.getBalance(
              accounts[i].address,
            );
          }

          // Trigger performUpkeep to request random number
          const txResponse = await raffle.performUpkeep("0x");
          const txReceipt = await txResponse.wait(1);

          // Calculate gas details in case deployer wins
          const gasUsed = txReceipt!.gasUsed;
          const effectiveGasPrice = txReceipt!.effectiveGasPrice;

          // Parse the requestId from our emitted event
          const eventLog = raffle.interface.parseLog(txReceipt!.logs[1]);
          const requestId = eventLog?.args.requestId;

          // Simulating VRF Coordinator triggering fulfillRandomWords callback
          // On a local chain, this resolves synchronously
          await vrfCoordinatorV2_5Mock.fulfillRandomWords(
            requestId,
            await raffle.getAddress(),
          );

          // Now verify results
          const recentWinner = await raffle.getRecentWinner();
          const raffleState = await raffle.getRaffleState();
          const endingTimeStamp = await raffle.getLastTimeStamp();
          const numPlayers = await raffle.getNumberOfPlayers();
          const winnerEndingBalance = await ethers.provider.getBalance(
            recentWinner,
          );

          // Find which account won
          const winnerAccount = accounts.find(
            (acc) => acc.address === recentWinner,
          )!;
          const winnerIndex = accounts.indexOf(winnerAccount);
          const winnerStartingBalance = startingBalances[winnerIndex];

          // 1. Assert state reset
          assert.equal(numPlayers.toString(), "0");
          assert.equal(raffleState.toString(), "0"); // OPEN
          assert(endingTimeStamp > startingTimeStamp);

          // 2. Assert winner got funded
          // Total pool = entranceFee * totalPlayers (additionalEntrants + 1)
          const totalPool =
            raffleEntranceFee * BigInt(additionalEntrants + 1);

          if (winnerIndex === 0) {
            // If deployer won, they paid gas for performUpkeep
            const gasCost = gasUsed * effectiveGasPrice;
            assert.equal(
              winnerEndingBalance.toString(),
              (winnerStartingBalance + totalPool - gasCost).toString(),
            );
          } else {
            // Any other player won
            assert.equal(
              winnerEndingBalance.toString(),
              (winnerStartingBalance + totalPool).toString(),
            );
          }
        });
      });
    });
