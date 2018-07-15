pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Buy.sol";

contract TestBuy {
  Buy buy = Buy(DeployedAddresses.Buy());

  // Testing the buy() function
  function testUserCanBuyPlanet() public {
    uint returnedId = buy.buy(7);
    uint expected = 7;
    Assert.equal(returnedId, expected, "Buy of planet ID 7 should be recorded.");
  }

  // Testing retrieval of a single pet's owner
  function testGetCustomerAddressByPlanetId() public {
    // Expected owner is this contract
    address expected = this;
    address customer = buy.customers(7);
    Assert.equal(customer, expected, "Owner of planet ID 7 should be recorded.");
  }

  // Testing retrieval of all pet owners
  function testGetCustomerAddressByPlanetIdInArray() public {
    // Expected owner is this contract
    address expected = this;
    // Store adopters in memory rather than contract's storage
    address[16] memory customers = buy.getCustomers();
    Assert.equal(customers[7], expected, "Owner of planet ID 7 should be recorded.");
  }
}
