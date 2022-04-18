// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.7.5;

import "./IERC20.sol";

// Old wsFISC interface
interface IwsFISC is IERC20 {
  function wrap(uint256 _amount) external returns (uint256);

  function unwrap(uint256 _amount) external returns (uint256);

  function wFISCTosFISC(uint256 _amount) external view returns (uint256);

  function sFISCTowFISC(uint256 _amount) external view returns (uint256);
}
