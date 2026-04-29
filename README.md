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