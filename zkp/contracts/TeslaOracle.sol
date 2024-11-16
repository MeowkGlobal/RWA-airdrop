// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


contract TeslaOracle {
    address _owner;
    uint256 public priceInUsd;

    constructor(uint256 initPrice) {
        _owner = msg.sender;
        priceInUsd = initPrice;
    }

    function setPrice(uint256 newPrice_) external {
        require(msg.sender == _owner, "Invalid Wallet");
        priceInUsd = newPrice_;
    }
}
