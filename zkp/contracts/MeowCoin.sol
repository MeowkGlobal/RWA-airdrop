// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MeowCoin is ERC20 {
    address public _owner;
    constructor() ERC20("MEOWCOIN", "MEOW"){
        _owner = msg.sender;
    }

    function mint(address account, uint256 value) external {
        require(msg.sender == _owner, "Only Owner can mint");
        _mint(account, value);
    }
}