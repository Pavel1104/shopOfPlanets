pragma solidity ^0.4.23;

contract Buy {
  address[7] public customers;

  // buying a planet
  function buy(uint planetId) public returns (uint) {
    require(planetId >= 0 && planetId <= 7 && customers[planetId] == 0x0);
    customers[planetId] = msg.sender;
    return planetId;
  }

  function sale(uint planetId) public returns (uint) {
    require(planetId >= 0 && planetId <= 7 && msg.sender == customers[planetId]);
    customers[planetId] = 0x0;
    return planetId;
  }

  // Retrieving the customers
  function getCustomers() public view returns (address[7]) {
    return customers;
  }
}
