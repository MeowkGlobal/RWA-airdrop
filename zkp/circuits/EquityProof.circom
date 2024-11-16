pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template EquityProof() {
    signal input address; // Address of the user
    signal input stockQuantity; // Current Stock holding of the user
    signal input stockQuantityThreshold; // Stock quantity threshold 
    
    signal input stockBuyTimestamp; // Timestamp of the stock purchase
    signal input currentTimestamp; // Current time in seconds
    signal input holdingPeriodThreshold; // Holding period threshold
    
    signal input hash; // Hash of the address, stock quantity and stock buy timestamp

    signal holdingPeriod;
    holdingPeriod <== currentTimestamp - stockBuyTimestamp;

    // Check if the holding period is greater than the threshold (using 32 bits)
    component gte1 = GreaterEqThan(32);
    gte1.in[0] <== holdingPeriod;
    gte1.in[1] <== holdingPeriodThreshold;
    gte1.out === 1;

    // Check if the stock quantity is greater than the threshold
    component gte2 = GreaterEqThan(32);
    gte2.in[0] <== stockQuantity;
    gte2.in[1] <== stockQuantityThreshold;
    gte2.out === 1;

    // Check if the hash is valid
    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== address;
    poseidon.inputs[1] <== stockQuantity;
    poseidon.inputs[2] <== stockBuyTimestamp;
    hash === poseidon.out;

}

component main {public [address, stockQuantityThreshold, currentTimestamp, holdingPeriodThreshold, hash]} = EquityProof();
