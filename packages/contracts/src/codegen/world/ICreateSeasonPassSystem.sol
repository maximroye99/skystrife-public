// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

/**
 * @title ICreateSeasonPassSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface ICreateSeasonPassSystem {
  function createNewSeasonPass(
    bytes14 name,
    uint256 seasonStart,
    uint256 seasonEnd,
    uint256 mintEnd,
    uint256 priceDecreaseRate,
    uint256 startingPrice,
    uint256 minPrice,
    uint256 buyMultiplier
  ) external;
}
