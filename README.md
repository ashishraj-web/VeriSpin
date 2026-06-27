# VeriSpin (Full-Stack Blockchain Raffle dApp)

A full-stack, decentralized, and transparent Smart Lottery application. This project combines a secure Solidity smart contract backend with a modern, high-fidelity Web3 frontend architecture. Users can enter open raffle pools with verifiably fair mechanics, ensuring absolute trust and automation without centralized intermediaries.

---

## 📂 Repository Structure

This repository is organized as a monorepo:

* **[backend/](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/verispin/backend)**: Solidity smart contracts built and tested with Hardhat, utilizing Chainlink VRF V2.5 and Chainlink Keepers.
* **[frontend/](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/verispin/frontend)**: Next.js (v15) Client UI built with TypeScript and Tailwind CSS, utilizing Ethers.js (v6) to communicate with the Sepolia testnet.

---

## 🛠️ Tech Stack

### Backend
* **Language/Framework:** Solidity (^0.8.28), Hardhat, TypeScript
* **Oracle Infrastructure:** Chainlink VRF V2.5 (Verifiable Randomness) & Chainlink Keepers (Automation)
* **Libraries:** OpenZeppelin Contracts (v4.9.6), Hardhat-Deploy

### Frontend
* **Framework:** Next.js (v15 App Router), React 19, TypeScript
* **Styling:** Tailwind CSS (v4) with glassmorphism custom components
* **Wallet Connection:** Ethers.js (v6) browser provider integration

---

## 🔒 Security Architectures
1. **Checks-Effects-Interactions (CEI) Implementation:** Prevents reentrancy vectors by resetting player arrays and status markers in the contract before paying out.
2. **Access-Protected Callback Resolution:** Callback functions restrict draw triggers to the authentic Chainlink VRF Coordinator contract address.
3. **No Direct Receive Fallbacks:** Raw Ether transfers without method signatures are rejected to avoid stuck assets.
4. **Secret-Free Client Bundle:** Wallet transaction signatures are processed directly on MetaMask browser extensions, keeping private keys completely isolated from the web host.

---

## 🚀 Installation & Quick Start

### 1. Backend Setup (Contracts)
```bash
cd backend
npm install
```
* **Run Unit Tests:** `npx hardhat test`
* **Deploy to Sepolia:** `npx hardhat deploy --network sepolia`

### 2. Frontend Setup (UI Client)
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the dApp in your browser.

---

## 📄 License
This project is licensed under the MIT License.
