import { ethers } from "hardhat";

async function main() {
    const raffleAddress = "0xdbbb19e91c2ba911dc350ca22b5ace10de948029";
    
    // We get the transaction count of the contract address to see how many txs it has interacted with,
    // but a better way to check recent transactions is to search the history or scan the block range.
    // Since we know the contract was deployed recently, we can scan the last 1000 blocks for transactions
    // going to our contract!
    
    const latestBlock = await ethers.provider.getBlockNumber();
    console.log(`Current Block: ${latestBlock}`);
    console.log("Scanning recent blocks for transactions to our contract...");
    
    const startBlock = latestBlock - 9; // Scan last 10 blocks (within Alchemy free tier limits)
    
    // We can fetch logs emitted by our contract instead, which is extremely fast and reliable!
    console.log("Fetching logs emitted by the Raffle contract...");
    const filter = {
        address: raffleAddress,
        fromBlock: startBlock,
        toBlock: latestBlock
    };
    
    const logs = await ethers.provider.getLogs(filter);
    console.log(`Found ${logs.length} logs.`);
    
    const raffleInterface = new ethers.Interface([
        "event RaffleEnter(address indexed player)",
        "event RequestedRaffleWinner(uint256 indexed requestId)",
        "event WinnerPicked(address indexed winner)"
    ]);

    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        try {
            const parsedLog = raffleInterface.parseLog(log);
            console.log(`Log ${i}: Event: ${parsedLog?.name}, Args: ${JSON.stringify(parsedLog?.args)}`);
            console.log(`  Tx Hash: ${log.transactionHash}`);
        } catch (e) {
            console.log(`Log ${i}: Unrecognized log topics: ${log.topics}`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
