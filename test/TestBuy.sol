pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Buy.sol";

contract TestBuy {
  Buy buyContract = Buy(DeployedAddresses.Buy());

  // Testing the buy() function
  function testUserCanBuyPlanet() public {
    uint returnedId = buyContract.buy(1);
    uint expected = 1;
    Assert.equal(returnedId, expected, "Buy of planet ID 1 should be recorded.");
  }

  // Testing retrieval of a single planet's owner
  function testGetCustomerAddressByPlanetId() public {
    // Expected owner is this contract
    address expected = this;
    address customer = buyContract.customers(1);
    Assert.equal(customer, expected, "Buy planet. Owner of planet ID 1 should be recorded.");
  }

  // Testing retrieval of all planets owners
  function testGetCustomerAddressByPlanetIdInArray() public {
    // Expected owner is this contract
    address expected = this;
    // Store customers in memory rather than contract's storage
    address[7] memory customers = buyContract.getCustomers();
    Assert.equal(customers[1], expected, "Owner of planet ID 1 should be recorded.");
  }

  // Testing the sale() function
  function testUserCanSalePlanet() public {
    uint returnedId = buyContract.sale(1);
    uint expected = 1;
    Assert.equal(returnedId, expected, "Sale of planet ID 1 should be recorded.");
  }

  // Testing the sale() function
  function testPlanetWasBought() public {
    // Expected owner is this contract
    address expected = this;
    address customer = buyContract.customers(1);
    Assert.notEqual(customer, expected, "Owner of planet ID 1 should be cleared.");
  }

  // Testing the sale() function
  function testPlanetOwnerShouldBeCleared() public {
    // Expected owner has address 0x0
    address expected = 0x0;
    address customer = buyContract.customers(1);
    Assert.equal(customer, expected, "Owner of planet ID 1 should be equal to 0x0.");
  }
}
