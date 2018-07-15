pragma solidity ^0.4.23;

contract Buy {
  address[16] public customers;

  // buying a planet
  function buy(uint planetId) public returns (uint) {
    require(planetId >= 0 && planetId <= 7);
    customers[planetId] = msg.sender;
    return planetId;
  }

  // Retrieving the customers
  function getCustomers() public view returns (address[16]) {
    return customers;
  }
}
