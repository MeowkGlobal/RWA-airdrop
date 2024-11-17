# RWA Airdrop

A decentralized platform for Real World Asset (RWA) token airdrops with zero-knowledge proof verification.

## Overview

This project enables secure and privacy-preserving distribution of RWA tokens through a combination of zero-knowledge proofs, smart contracts, and a user-friendly interface.

### Scenario

The scenario is that a company wants to distribute tokens to its share holders based on their equity ownership for following reasons: 
1. In order to reward them for their loyalty and incentivize long-term holding
2. Onboard new users to their web3 asset platforms

The company wants to ensure that the distribution is fair and transparent, while also preserving the privacy of the share holders.

It is built on Scroll Testnet.



## Project Structure

The repository consists of three main components:

- [`/backend`](./backend/README.md) - Server-side implementation for handling user data and proof verification
- [`/frontend`](./frontend/README.md) - Web interface for users to participate in airdrops
- [`/zkp`](./zkp/README.md) - Zero-knowledge proof circuits and verification logic

## Quick Start

1. Clone the repository:
- git clone https://github.com/MeowkGlobal/RWA-airdrop


2. Follow the setup instructions in each component's README:
- [Backend Setup](./backend/README.md#setup)
- [Frontend Setup](./frontend/README.md#setup)
- [ZKP Setup](./zkp/README.md#setup)

## Features

- Privacy-preserving eligibility verification
- Secure token distribution
- User-friendly claim interface
- On-chain proof verification
- Administrative dashboard for airdrop management

## Architecture

The system follows a two-phase architecture for secure and private token distribution:

### Proof Generation Flow
![Proof Generation Flow](./images/proofGen.png)

The proof generation process ensures user privacy while validating eligibility:
1. Users submit their credentials and eligibility data
2. The client-side application generates a zero-knowledge proof of eligibility
3. The proof is created without revealing the underlying sensitive information
4. The generated proof is submitted to the smart contract for verification

### Proof Verification Flow
![Proof Verification Flow](./images/proofVerify.png)

The verification flow maintains security and transparency:
1. The smart contract receives the submitted proof
2. The verification process checks the proof's validity on-chain
3. If verified, the contract releases tokens to the eligible address
4. All verification steps are recorded on-chain for transparency

This architecture ensures:
- User privacy is preserved through zero-knowledge proofs
- Eligibility requirements are enforced without exposing sensitive data
- Token distribution is automated and trustless
- The entire process is verifiable on-chain


### Price Feed Integration
![Pyth Price Feed Integration](./images/pythFeed.png)

The system integrates with Pyth Network Oracle to fetch real-time TSLA stock price data:
1. Smart contracts connect to Pyth's Price Feed contract
2. Price updates are received through Pyth's off-chain to on-chain bridge
3. Price feeds are updated regularly to ensure accuracy

Example usage in smart contracts: