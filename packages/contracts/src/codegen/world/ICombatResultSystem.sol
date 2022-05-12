// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

import { CombatResultData } from "./../index.sol";

/**
 * @title ICombatResultSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface ICombatResultSystem {
  function setCombatResult(bytes32 matchEntity, bytes32 attacker, CombatResultData memory combatResultData) external;
}