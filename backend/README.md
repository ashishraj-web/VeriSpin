# VeriSpin Smart Contracts (Backend)

This repository contains the backend smart contracts for **VeriSpin**, a provably fair, decentralized lottery protocol built on Ethereum. The system uses **Chainlink VRF V2.5** to retrieve cryptographically secure random numbers and **Chainlink Automation** to automatically trigger drawings.

## 🛠️ Tech Stack & Architecture

* **Framework:** Hardhat with TypeScript
* **Verification:** Etherscan contract validation
* **Dependencies:**
  * `@chainlink/contracts` (v1.5.0) - For VRF V2.5 consumer contracts
  * `@openzeppelin/contracts` (v4.9.6) - Security primitives
* **Automated Mocks:** Custom VRF Coordinator mock (`VRFCoordinatorV2_5Mock`) for isolated local unit testing.

---

## 🔒 Security Specifications

* **Checks-Effects-Interactions (CEI):** Reentrancy is prevented by updating the contract state (clearing players list, setting status to `OPEN`) *before* executing the transfer transaction.
* **Access Control:** Randomness callbacks (`fulfillRandomWords`) are protected by modifiers ensuring only the authentic Chainlink VRF Coordinator contract can call them.
* **Fallback Safety:** The contract does not implement a raw `receive()` or `fallback()` function. This prevents accidental direct ether transfers from getting permanently locked in the contract.

---

## ⚙️ Local Development & Testing

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Run Local Unit Tests
Executes the suite of 14 tests verifying entrance restrictions, upkeep validation, event emissions, and mock VRF resolution:
```bash
npx hardhat test
```

### 3. Deploy to Sepolia Testnet
Configure your environment keys in `.env` (refer to `.env.example`) and deploy:
```bash
npx hardhat deploy --network sepolia
```

### 4. Run Staging Tests
Runs integration tests against the live Sepolia network:
```bash
npx hardhat test --network sepolia
```
*Note: The staging tests include a custom pre-check guard to prevent tests from hanging if a Chainlink VRF draw is currently resolving.*

---

## 📄 License
This project is licensed under the MIT License.
