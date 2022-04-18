// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.7.5;

import "../interfaces/IERC20.sol";
import "../interfaces/IOwnable.sol";
import "../types/Ownable.sol";
import "../libraries/SafeERC20.sol";

contract CrossChainMigrator is Ownable {
    using SafeERC20 for IERC20;

    IERC20 internal immutable wsFISC; // v1 token
    IERC20 internal immutable gFISC; // v2 token

    constructor(address _wsFISC, address _gFISC) {
        require(_wsFISC != address(0), "Zero address: wsFISC");
        wsFISC = IERC20(_wsFISC);
        require(_gFISC != address(0), "Zero address: gFISC");
        gFISC = IERC20(_gFISC);
    }

    // migrate wsFISC to gFISC - 1:1 like kind
    function migrate(uint256 amount) external {
        wsFISC.safeTransferFrom(msg.sender, address(this), amount);
        gFISC.safeTransfer(msg.sender, amount);
    }

    // withdraw wsFISC so it can be bridged on ETH and returned as more gFISC
    function replenish() external onlyOwner {
        wsFISC.safeTransfer(msg.sender, wsFISC.balanceOf(address(this)));
    }

    // withdraw migrated wsFISC and unmigrated gFISC
    function clear() external onlyOwner {
        wsFISC.safeTransfer(msg.sender, wsFISC.balanceOf(address(this)));
        gFISC.safeTransfer(msg.sender, gFISC.balanceOf(address(this)));
    }
}
