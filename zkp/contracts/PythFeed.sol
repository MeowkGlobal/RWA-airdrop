// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
 
contract PythFeed {
  IPyth pyth;
  bytes32 equityTeslaPriceId;
  uint256 age;
 
  constructor(address _pyth, bytes32 _equityTeslaPriceId, uint256 _age) {
    pyth = IPyth(_pyth);
    equityTeslaPriceId = _equityTeslaPriceId;
    age = _age;
  }

    function getEquityPrice() public payable returns (int64){
 
    PythStructs.Price memory price = pyth.getPriceNoOlderThan(equityTeslaPriceId, age);
    return price.price;
  }
}
 