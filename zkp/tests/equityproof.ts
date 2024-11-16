import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Circuit } from "../utils/Circuit";
import { poseidon } from "../utils/Circomlib";
import { EquityProofVerifier__factory, EquityProofVerifier } from "../typechain-types";

describe("Equity Proof tests", () => {
    const address = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";
    const deployVerifier = async () => {
        const [deployer, relayer] = await ethers.getSigners();
        const Verifier: EquityProofVerifier__factory = await ethers.getContractFactory("EquityProofVerifier", deployer);
        const verifier: EquityProofVerifier = await Verifier.deploy();
        await verifier.deployed();
        return { verifier, deployer, relayer };
    };

    describe("Verify Offchain", () => {
        it("Should verify the zksnark for correct signals", async () => {
            const EquityProof = new Circuit("EquityProof");
            const inputs = {
                address: BigInt(address),
                stockQuantity: BigInt(150),
                stockQuantityThreshold: BigInt(100),
                stockBuyTimestamp: BigInt(1000),
                currentTimestamp: BigInt(2000),
                holdingPeriodThreshold: BigInt(500),
                hash: null
            };
            
            const hash = await poseidon([
                inputs.address.toString(),
                inputs.stockQuantity.toString(),
                inputs.stockBuyTimestamp.toString()
            ]);
            inputs.hash = hash;
            const { proofJson, publicSignals } = await EquityProof.generateProof(inputs);
            
            let verify;
            verify = await EquityProof.verifyProof(proofJson, publicSignals);
            expect(verify).to.be.true;

			verify = await EquityProof.verifyProof(proofJson, [
                inputs.address.toString(),
                inputs.stockQuantityThreshold.toString(),
                inputs.currentTimestamp.toString(),
                inputs.holdingPeriodThreshold.toString(),
                hash.toString()
            ]);
			expect(verify).to.be.true;
        });
    });

    describe("Verify Onchain", () => {
        it("Should verify the zksnark for correct signals", async () => {
            const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
            const EquityProof = new Circuit("EquityProof");
            const inputs = {
                address: BigInt(address),
                stockQuantity: BigInt(150),
                stockQuantityThreshold: BigInt(20),
                stockBuyTimestamp: BigInt(1000),
                currentTimestamp: BigInt(2000),
                holdingPeriodThreshold: BigInt(300),
                hash: null
            };
            
            const hash = await poseidon([
                inputs.address.toString(),
                inputs.stockQuantity.toString(),
                inputs.stockBuyTimestamp.toString()
            ]);
            inputs.hash = hash;
            const { proofCalldata, publicSignals } = await EquityProof.generateProof(inputs);

            console.log("Current Timestamp:", inputs.currentTimestamp);
            console.log("Proof Calldata:", proofCalldata);
            console.log("Hash:", hash);

            let verify;
			verify = await verifier.connect(relayer).verifyProof(proofCalldata, publicSignals);
            expect(verify).to.be.true;

            console.log("input 1:", inputs.address.toString());
            console.log("input 2:", inputs.stockQuantityThreshold.toString());
            console.log("input 3:", inputs.currentTimestamp.toString());
            console.log("input 4:", inputs.holdingPeriodThreshold.toString());
            console.log("input 5:", hash.toString());

            verify = await verifier.connect(relayer).verifyProof(proofCalldata, [
                inputs.address.toString(),
                inputs.stockQuantityThreshold.toString(),
                inputs.currentTimestamp.toString(),
                inputs.holdingPeriodThreshold.toString(),
                hash.toString()
            ]);
			expect(verify).to.be.true;
        });
    });
});
