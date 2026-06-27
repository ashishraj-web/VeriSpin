# VeriSpin dApp Client (Frontend)

This repository contains the Next.js frontend client for **VeriSpin**, a provably fair, decentralized lottery protocol. It interacts with the deployed Solidity contract on the Ethereum Sepolia testnet, enabling users to connect their Web3 wallets, view live contract states, and buy draw tickets.

## 🎨 Design & Features

* **Modular Tab Navigation:** Toggle between the interactive drawing **Console** and the **Analytics** page.
* **Connected Wallet Capsule:** Sleek pill-shaped header component displaying the connected user's Sepolia ETH balance and address details.
* **Verifiable Drawing Hub:** A dynamic drawing hub with an animated spinning selector wheel indicating the state of the live raffle.
* **On-Chain Queue Tracker:** Lists active players dynamically queried from the smart contract storage during the current round.
* **Analytics Dashboard:** Exposes protocol parameters (blocks confirmations, gas limits, coordinator addresses) directly to users to ensure absolute transparency.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (v15) with App Router
* **Styling:** Tailwind CSS (v4) with custom glassmorphism components
* **Blockchain Library:** Ethers.js (v6)
* **Language:** TypeScript (Strict Typechecked)

---

## ⚙️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Deployed Contract
Verify or update the contract address in `src/constants/index.ts`:
```typescript
export const RAFFLE_ADDRESS = "0xE5f35DDcBF8A333F90A7462625074e41271Ae4D9";
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
Compiles and generates the static assets:
```bash
npm run build
```

---

## 🔒 Security Best Practices

* **Metamask Signatures:** The application uses `window.ethereum` to prompt the user's browser wallet for transactions. No private keys are stored or handled by the frontend application.
* **Provider Rate-Limits:** Bypasses public RPC node hangs by implementing fallback static gas limits for all write functions (`enterRaffle` and `performUpkeep`).
* **Secret Protection:** Environment files are ignored via `.gitignore` config rules to prevent leaks during public deployments.

---

## 📄 License
This project is licensed under the MIT License.
