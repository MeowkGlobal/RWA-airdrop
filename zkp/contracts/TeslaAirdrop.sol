// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./TeslaOracle.sol";
import "./EquityProofVerifier.sol";

interface IEquityProofVerifier {
    function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns(bool);
}

contract TeslaAirdrop {
    IERC20 _meowCoin;
    TeslaOracle _oracle;
    uint256 _airdropAmount;

    IEquityProofVerifier _verifier;
    
    address _owner;
    uint256 _stockQuantityThreshold;
    uint256 _holdingPeriodThreshold;
    uint256 _stockPriceThreshold;

    constructor(address meowCoinAddress_,
        uint256 airdropAmount_,
        address oracleAddress_,
        uint256 stockPriceThreshold_,
        address verifierAddress_, 
        uint256 stockQuantityThreshold_,
        uint256 holdingPeriodThreshold_) {
        _owner = msg.sender;
        _meowCoin = IERC20(meowCoinAddress_);
        _airdropAmount = airdropAmount_;

        _oracle = TeslaOracle(oracleAddress_);
        _stockPriceThreshold = stockPriceThreshold_;

        _verifier = IEquityProofVerifier(verifierAddress_);

        _stockQuantityThreshold = stockQuantityThreshold_;
        _holdingPeriodThreshold = holdingPeriodThreshold_;
    }

    function claimAirdrop(bytes memory proof_, uint[] memory input_) external {
        require(input_[0] == uint256(uint160(msg.sender)), "Invalid input for user address");
        require(input_[1] == _stockQuantityThreshold, "Invalid stock price threshold for proof");
        require(input_[3] == _holdingPeriodThreshold, "Invalid holding period threshold for proof");


        require(_verifier.verifyProof(proof_, input_), "Failed to verify proof");
        require(_oracle.priceInUsd() > _stockPriceThreshold, "Equity under threshold");
        require(_meowCoin.transfer(msg.sender, _airdropAmount), "Failed to transfer aridrop");
    }
}