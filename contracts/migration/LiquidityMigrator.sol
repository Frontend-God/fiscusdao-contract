// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "../interfaces/IERC20.sol";
import "../libraries/SafeERC20.sol";
import "../libraries/SafeMath.sol";
import "../interfaces/IUniswapV2Router.sol";
import "../interfaces/IFiscusAuthority.sol";
import "../types/FiscusAccessControlled.sol";
import "../interfaces/ITreasury.sol";

interface IMigrator {
    enum TYPE {
        UNSTAKED,
        STAKED,
        WRAPPED
    }

    // migrate FISCv1, sFISCv1, or wsFISC for FISCv2, sFISCv2, or gFISC
    function migrate(
        uint256 _amount,
        TYPE _from,
        TYPE _to
    ) external;
}

contract LiquidityMigrator is FiscusAccessControlled {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    ITreasury internal immutable oldTreasury = ITreasury(0x31F8Cc382c9898b273eff4e0b7626a6987C846E8);
    ITreasury internal immutable newTreasury = ITreasury(0x9A315BdF513367C0377FB36545857d12e85813Ef);
    IERC20 internal immutable oldFISC = IERC20(0x383518188C0C6d7730D91b2c03a03C837814a899);
    IERC20 internal immutable newFISC = IERC20(0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5);
    IMigrator internal immutable migrator = IMigrator(0x184f3FAd8618a6F458C16bae63F70C426fE784B3);

    constructor(IFiscusAuthority _authority) FiscusAccessControlled(_authority) {}

    /**
     * @notice Migrate LP and pair with new FISC
     */
    function migrateLP(
        address pair,
        IUniswapV2Router routerFrom,
        IUniswapV2Router routerTo,
        address token,
        uint256 _minA,
        uint256 _minB,
        uint256 _deadline
    ) external onlyGovernor {
        // Since we are adding liquidity, any existing balance should be excluded
        uint256 initialNewFISCBalance = newFISC.balanceOf(address(this));
        // Fetch the treasury balance of the given liquidity pair
        uint256 oldLPAmount = IERC20(pair).balanceOf(address(oldTreasury));
        oldTreasury.manage(pair, oldLPAmount);

        // Remove the V1 liquidity
        IERC20(pair).approve(address(routerFrom), oldLPAmount);
        (uint256 amountToken, uint256 amountFISC) = routerFrom.removeLiquidity(
            token,
            address(oldFISC),
            oldLPAmount,
            _minA,
            _minB,
            address(this),
            _deadline
        );

        // Migrate the V1 FISC to V2 FISC
        oldFISC.approve(address(migrator), amountFISC);
        migrator.migrate(amountFISC, IMigrator.TYPE.UNSTAKED, IMigrator.TYPE.UNSTAKED);
        uint256 amountNewFISC = newFISC.balanceOf(address(this)).sub(initialNewFISCBalance); // # V1 out != # V2 in

        // Add the V2 liquidity
        IERC20(token).approve(address(routerTo), amountToken);
        newFISC.approve(address(routerTo), amountNewFISC);
        routerTo.addLiquidity(
            token,
            address(newFISC),
            amountToken,
            amountNewFISC,
            amountToken,
            amountNewFISC,
            address(newTreasury),
            _deadline
        );

        // Send any leftover balance to the governor
        newFISC.safeTransfer(authority.governor(), newFISC.balanceOf(address(this)));
        oldFISC.safeTransfer(authority.governor(), oldFISC.balanceOf(address(this)));
        IERC20(token).safeTransfer(authority.governor(), IERC20(token).balanceOf(address(this)));
    }
}
