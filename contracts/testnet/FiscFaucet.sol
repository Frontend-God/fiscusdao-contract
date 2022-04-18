// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.7.5;

import "../interfaces/IERC20.sol";
import "../types/Ownable.sol";

contract FiscFaucet is Ownable {
    IERC20 public fisc;

    constructor(address _fisc) {
        fisc = IERC20(_fisc);
    }

    function setFisc(address _fisc) external onlyOwner {
        fisc = IERC20(_fisc);
    }

    function dispense() external {
        fisc.transfer(msg.sender, 1e9);
    }
}
