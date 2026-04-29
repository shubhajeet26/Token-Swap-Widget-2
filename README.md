<<<<<<< HEAD
# Token Swap Widget

A decentralized application (dApp) built on the Stellar network using Soroban smart contracts. This project provides a comprehensive widget interface for swapping tokens.

## Project Structure

This project is a monorepo consisting of two main parts:

- **/client**: The frontend application built with [Next.js](https://nextjs.org), React, Tailwind CSS, `@stellar/freighter-api`, and `@stellar/stellar-sdk`.
- **/contract**: The backend smart contracts written in Rust using the [Soroban SDK](https://soroban.stellar.org/docs).

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or newer)
- npm, yarn, pnpm, or bun
- [Rust toolchain](https://rustup.rs/) (for smart contract development)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)
- [Freighter Wallet](https://www.freighter.app/) extension in your browser

## Getting Started

### 1. Smart Contract (`/contract`)

Navigate to the `contract` directory to build and test the Soroban smart contracts.

```bash
cd contract

# Build the contract
soroban contract build

# Run tests
cargo test
```

For more details on Soroban contracts, please refer to the [Soroban Documentation](https://soroban.stellar.org/docs).

### 2. Frontend Client (`/client`)

Navigate to the `client` directory to run the Next.js development server.

```bash
cd client

# Install dependencies (e.g., using npm)
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application will auto-update as you edit the files in `client/app`.

## Technologies Used

- **Blockchain**: Stellar Network, Soroban Smart Contracts
- **Frontend Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS
- **Wallet Integration**: Freighter API (`@stellar/freighter-api`)
- **Stellar SDK**: `@stellar/stellar-sdk`
- **Smart Contract Language**: Rust
=======
## 🚀 Token Swap Widget

A sleek and customizable Token Swap Widget that allows users to seamlessly swap cryptocurrencies directly within a web application. This project provides a modern UI and integrates Web3 functionality to enable fast, secure, and user-friendly token swaps.


<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6a39970c-b4b0-4e23-9772-176e4b75a894" />

## 📌 Deployed Contract 

- Network : Stellar Testnet
- Contract Address : CD4WOKVETURYJHLN63MM2SHIGYFUBLF3DPTTLEDTWTENMSCFT7GPSNM5
- Contract Explorar : https://lab.stellar.org/smart-contracts/contract-explorer?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&smartContracts$explorer$contractId=CD4WOKVETURYJHLN63MM2SHIGYFUBLF3DPTTLEDTWTENMSCFT7GPSNM5;;


## 📌 Overview

The Token Swap Widget is a reusable frontend component designed for decentralized applications (dApps). It enables users to:

- Swap tokens across supported blockchain networks

- View real-time token prices and balances

- Connect wallets and execute transactions

- Experience a smooth and interactive UI

- Token swap widgets are commonly used in DeFi apps to embed trading functionality without requiring users to leave the platform

## ✨ Features

🔄 Token Swapping – Swap between supported tokens

💼 Wallet Integration – Connect Web3 wallets (e.g., Freighter / MetaMask)

⚡ Real-Time Data – Live price and balance updates

🎨 Modern UI/UX – Interactive and responsive design

🔧 Customizable – Easily modify tokens, themes, and behavior

🌐 Decentralized – Built for Web3 environments

## 🛠️ Tech Stack

- Frontend: React / Next.js

- Blockchain Interaction: Web3 / Ethers / Stellar SDK (based on your setup)

- Styling: CSS / Tailwind / Styled Components

- APIs: Token price / swap routing APIs


## 📂 Project Structure
Token-Swap-Widget/
│── public/             # Static assets
│── src/
│   ├── components/     # UI components
│   ├── pages/          # App pages (if Next.js)
│   ├── utils/          # Helper functions
│   ├── services/       # API / blockchain logic
│── package.json
│── README.md

## ⚙️ Installation & Setup

1️⃣ Clone the repository
git clone https://github.com/shubhajeet26/Token-Swap-Widget-2.git
cd Token-Swap-Widget-2

2️⃣ Install dependencies
npm install

or

yarn install

3️⃣ Run the development server
npm run dev
## 🔗 Usage

1. Connect your crypto wallet

2. Select input and output tokens

3. Enter the amount

4. Confirm the swap

## 🔐 Environment Variables

Create a .env file and add:

API_KEY=your_api_key_here
RPC_URL=your_rpc_url

## 📸 Screenshots of the UI

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/63c87977-cb24-4355-809b-38ecfe730167" />




## 🚀 Future Improvements

🌉 Cross-chain swaps

📊 Advanced analytics (charts, slippage info)

🧠 Smart routing optimization

📱 Mobile-first UI improvements

## 🤝 Contributing

Contributions are welcome!

- Fork the repo

- Create a new branch

- Make your changes

- Submit a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙌 Acknowledgements

Inspired by popular DeFi swap widgets like Uniswap & 1inch

Open-source Web3 ecosystem

## 📬 Contact

Shubhajeet Saha
>>>>>>> 77fa3706c14dfc43962877661c338bc482784fe3
