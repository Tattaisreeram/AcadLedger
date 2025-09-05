# AcadLedger - Academic Records on the Blockchain

**Track and Issue Non-Transferable Certificates using Soulbound Tokens (SBT) - ERC1155**

<p align="center">
  A Web3-based decentralized solution to issue, manage, and view student certificates securely.<br/>
  <a href="https://github.com/Abhisharmika/Digital_Certificate">Project Repository</a>
</p>

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Project Breakdown](#project-breakdown)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Smart Contract](#smart-contract)
- [Contributions](#contributions)
- [License](#license)

---

## 🧐 About the Project

**AcadLedger** is a decentralized application built to help educational institutes issue digital academic certificates using **SoulBound Tokens (SBTs)** on the Ethereum blockchain.

These certificates:
- Are minted using the ERC1155 standard with non-transferability.
- Cannot be transferred, sold, or tampered with.
- Are securely linked to a student's wallet.
- Are stored on-chain with metadata on **IPFS** for verification.

---

## 🔨 Project Breakdown

- 🚀 Uses a smart contract (`SBT721Certificate.sol`) deployed to **Sepolia Testnet**.
- 🧾 IPFS integration to store and serve metadata and certificates using Web3.Storage.
- 🔗 Ethers.js is used for all blockchain interactions from the frontend.
- 🎓 Colleges can batch-upload JSON data and mint SBT certificates.
- 🧠 Frontend includes a dynamic dashboard and transaction history per batch.

---

### 🛠 Built With

**Frontend:**
- React.js
- JavaScript
- Ethers.js
- Particles-bg (for UI animation)
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB
- dotenv

**Blockchain:**
- Solidity (ERC1155 with SoulBound properties)
- Web3.Storage / IPFS
- Sepolia Ethereum Testnet

---

## 🚀 Getting Started

### 🔨 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Abhisharmika/Digital_Certificate.git
cd Digital_Certificate
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
