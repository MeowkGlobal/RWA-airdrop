# Equity Airdrop ZKP

Circom is a programming language and a toolchain for building and verifying zero-knowledge proofs (ZKPs). Zero-knowledge proofs are cryptographic protocols that allow a prover to demonstrate the validity of a statement to a verifier without revealing any additional information beyond the truth of the statement itself. Circom allows developers to write ZKP circuits using a high-level language and then compile them to a low-level representation that can be used to generate proofs. Circom is often used in combination with other tools and languages such as SnarkJS, which is a JavaScript library for creating and verifying ZKPs, and Solidity, which is a smart contract language used for building decentralized applications on the Ethereum blockchain.


## Circuit Used
This is a Zero-Knowledge Proof (ZKP) circuit written in Circom that verifies three main conditions for equity ownership:
- Holding Period Verification: Checks if the user has held their stocks longer than a required threshold period by comparing currentTimestamp - stockBuyTimestamp against holdingPeriodThreshold
- Quantity Verification: Verifies if the user owns more stocks than a required minimum threshold by comparing stockQuantity against stockQuantityThreshold
- Data Integrity: Validates the authenticity of the provided data by checking if the Poseidon hash of the user's address, stock quantity, and purchase timestamp matches a provided hash value

The circuit allows users to prove they meet certain equity requirements (minimum holding period and quantity) without revealing their exact holdings or purchase timing. Public inputs include the user's address, thresholds, current timestamp, and the hash, while the actual stock quantity and purchase timestamp remain private.


### Run the following commands to setup the project

#### 1. bash bash/0_install_circom.sh <a name = "install circom"></a>
#### 2. bash bash/1_plonk_setup.sh  <a name = "local contributor plonk setup"></a>
#### 3. bash bash/2_build_circuits.sh  <a name = "build circuit"></a>

### Run the following commands to run the project

## Usage <a name="usage"></a>
Add notes about how to use the starter kit.

### 🧐 npm run install <a name = "install"></a>

### 🚀 npm run test <a name = "test"></a>