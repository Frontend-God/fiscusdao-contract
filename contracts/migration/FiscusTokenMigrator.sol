// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.7.5;

import "../interfaces/IERC20.sol";
import "../interfaces/IsFISC.sol";
import "../interfaces/IwsFISC.sol";
import "../interfaces/IgFISC.sol";
import "../interfaces/ITreasury.sol";
import "../interfaces/IStaking.sol";
import "../interfaces/IOwnable.sol";
import "../interfaces/IUniswapV2Router.sol";
import "../interfaces/IStakingV1.sol";
import "../interfaces/ITreasuryV1.sol";

import "../types/FiscusAccessControlled.sol";

import "../libraries/SafeMath.sol";
import "../libraries/SafeERC20.sol";


contract FiscusTokenMigrator is FiscusAccessControlled {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for IgFISC;
    using SafeERC20 for IsFISC;
    using SafeERC20 for IwsFISC;

    /* ========== MIGRATION ========== */

    event TimelockStarted(uint256 block, uint256 end);
    event Migrated(address staking, address treasury);
    event Funded(uint256 amount);
    event Defunded(uint256 amount);

    /* ========== STATE VARIABLES ========== */

    IERC20 public immutable oldFISC;
    IsFISC public immutable oldsFISC;
    IwsFISC public immutable oldwsFISC;
    ITreasuryV1 public immutable oldTreasury;
    IStakingV1 public immutable oldStaking;

    IUniswapV2Router public immutable sushiRouter;
    IUniswapV2Router public immutable uniRouter;

    IgFISC public gFISC;
    ITreasury public newTreasury;
    IStaking public newStaking;
    IERC20 public newFISC;

    bool public ohmMigrated;
    bool public shutdown;

    uint256 public immutable timelockLength;
    uint256 public timelockEnd;

    uint256 public oldSupply;

    constructor(
        address _oldFISC,
        address _oldsFISC,
        address _oldTreasury,
        address _oldStaking,
        address _oldwsFISC,
        address _sushi,
        address _uni,
        uint256 _timelock,
        address _authority
    ) FiscusAccessControlled(IFiscusAuthority(_authority)) {
        require(_oldFISC != address(0), "Zero address: FISC");
        oldFISC = IERC20(_oldFISC);
        require(_oldsFISC != address(0), "Zero address: sFISC");
        oldsFISC = IsFISC(_oldsFISC);
        require(_oldTreasury != address(0), "Zero address: Treasury");
        oldTreasury = ITreasuryV1(_oldTreasury);
        require(_oldStaking != address(0), "Zero address: Staking");
        oldStaking = IStakingV1(_oldStaking);
        require(_oldwsFISC != address(0), "Zero address: wsFISC");
        oldwsFISC = IwsFISC(_oldwsFISC);
        require(_sushi != address(0), "Zero address: Sushi");
        sushiRouter = IUniswapV2Router(_sushi);
        require(_uni != address(0), "Zero address: Uni");
        uniRouter = IUniswapV2Router(_uni);
        timelockLength = _timelock;
    }

    /* ========== MIGRATION ========== */

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
    ) external {
        require(!shutdown, "Shut down");

        uint256 wAmount = oldwsFISC.sFISCTowFISC(_amount);

        if (_from == TYPE.UNSTAKED) {
            require(ohmMigrated, "Only staked until migration");
            oldFISC.safeTransferFrom(msg.sender, address(this), _amount);
        } else if (_from == TYPE.STAKED) {
            oldsFISC.safeTransferFrom(msg.sender, address(this), _amount);
        } else {
            oldwsFISC.safeTransferFrom(msg.sender, address(this), _amount);
            wAmount = _amount;
        }

        if (ohmMigrated) {
            require(oldSupply >= oldFISC.totalSupply(), "FISCv1 minted");
            _send(wAmount, _to);
        } else {
            gFISC.mint(msg.sender, wAmount);
        }
    }

    // migrate all Fiscus tokens held
    function migrateAll(TYPE _to) external {
        require(!shutdown, "Shut down");

        uint256 ohmBal = 0;
        uint256 sFISCBal = oldsFISC.balanceOf(msg.sender);
        uint256 wsFISCBal = oldwsFISC.balanceOf(msg.sender);

        if (oldFISC.balanceOf(msg.sender) > 0 && ohmMigrated) {
            ohmBal = oldFISC.balanceOf(msg.sender);
            oldFISC.safeTransferFrom(msg.sender, address(this), ohmBal);
        }
        if (sFISCBal > 0) {
            oldsFISC.safeTransferFrom(msg.sender, address(this), sFISCBal);
        }
        if (wsFISCBal > 0) {
            oldwsFISC.safeTransferFrom(msg.sender, address(this), wsFISCBal);
        }

        uint256 wAmount = wsFISCBal.add(oldwsFISC.sFISCTowFISC(ohmBal.add(sFISCBal)));
        if (ohmMigrated) {
            require(oldSupply >= oldFISC.totalSupply(), "FISCv1 minted");
            _send(wAmount, _to);
        } else {
            gFISC.mint(msg.sender, wAmount);
        }
    }

    // send preferred token
    function _send(uint256 wAmount, TYPE _to) internal {
        if (_to == TYPE.WRAPPED) {
            gFISC.safeTransfer(msg.sender, wAmount);
        } else if (_to == TYPE.STAKED) {
            newStaking.unwrap(msg.sender, wAmount);
        } else if (_to == TYPE.UNSTAKED) {
            newStaking.unstake(msg.sender, wAmount, false, false);
        }
    }

    // bridge back to FISC, sFISC, or wsFISC
    function bridgeBack(uint256 _amount, TYPE _to) external {
        if (!ohmMigrated) {
            gFISC.burn(msg.sender, _amount);
        } else {
            gFISC.safeTransferFrom(msg.sender, address(this), _amount);
        }

        uint256 amount = oldwsFISC.wFISCTosFISC(_amount);
        // error throws if contract does not have enough of type to send
        if (_to == TYPE.UNSTAKED) {
            oldFISC.safeTransfer(msg.sender, amount);
        } else if (_to == TYPE.STAKED) {
            oldsFISC.safeTransfer(msg.sender, amount);
        } else if (_to == TYPE.WRAPPED) {
            oldwsFISC.safeTransfer(msg.sender, _amount);
        }
    }

    /* ========== OWNABLE ========== */

    // halt migrations (but not bridging back)
    function halt() external onlyPolicy {
        require(!ohmMigrated, "Migration has occurred");
        shutdown = !shutdown;
    }

    // withdraw backing of migrated FISC
    function defund(address reserve) external onlyGovernor {
        require(ohmMigrated, "Migration has not begun");
        require(timelockEnd < block.number && timelockEnd != 0, "Timelock not complete");

        oldwsFISC.unwrap(oldwsFISC.balanceOf(address(this)));

        uint256 amountToUnstake = oldsFISC.balanceOf(address(this));
        oldsFISC.approve(address(oldStaking), amountToUnstake);
        oldStaking.unstake(amountToUnstake, false);

        uint256 balance = oldFISC.balanceOf(address(this));

        if(balance > oldSupply) {
            oldSupply = 0;
        } else {
            oldSupply -= balance;
        }

        uint256 amountToWithdraw = balance.mul(1e9);
        oldFISC.approve(address(oldTreasury), amountToWithdraw);
        oldTreasury.withdraw(amountToWithdraw, reserve);
        IERC20(reserve).safeTransfer(address(newTreasury), IERC20(reserve).balanceOf(address(this)));

        emit Defunded(balance);
    }

    // start timelock to send backing to new treasury
    function startTimelock() external onlyGovernor {
        require(timelockEnd == 0, "Timelock set");
        timelockEnd = block.number.add(timelockLength);

        emit TimelockStarted(block.number, timelockEnd);
    }

    // set gFISC address
    function setgFISC(address _gFISC) external onlyGovernor {
        require(address(gFISC) == address(0), "Already set");
        require(_gFISC != address(0), "Zero address: gFISC");

        gFISC = IgFISC(_gFISC);
    }

    // call internal migrate token function
    function migrateToken(address token) external onlyGovernor {
        _migrateToken(token, false);
    }

    /**
     *   @notice Migrate LP and pair with new FISC
     */
    function migrateLP(
        address pair,
        bool sushi,
        address token,
        uint256 _minA,
        uint256 _minB
    ) external onlyGovernor {
        uint256 oldLPAmount = IERC20(pair).balanceOf(address(oldTreasury));
        oldTreasury.manage(pair, oldLPAmount);

        IUniswapV2Router router = sushiRouter;
        if (!sushi) {
            router = uniRouter;
        }

        IERC20(pair).approve(address(router), oldLPAmount);
        (uint256 amountA, uint256 amountB) = router.removeLiquidity(
            token,
            address(oldFISC),
            oldLPAmount,
            _minA,
            _minB,
            address(this),
            block.timestamp
        );

        newTreasury.mint(address(this), amountB);

        IERC20(token).approve(address(router), amountA);
        newFISC.approve(address(router), amountB);

        router.addLiquidity(
            token,
            address(newFISC),
            amountA,
            amountB,
            amountA,
            amountB,
            address(newTreasury),
            block.timestamp
        );
    }

    // Failsafe function to allow owner to withdraw funds sent directly to contract in case someone sends non-ohm tokens to the contract
    function withdrawToken(
        address tokenAddress,
        uint256 amount,
        address recipient
    ) external onlyGovernor {
        require(tokenAddress != address(0), "Token address cannot be 0x0");
        require(tokenAddress != address(gFISC), "Cannot withdraw: gFISC");
        require(tokenAddress != address(oldFISC), "Cannot withdraw: old-FISC");
        require(tokenAddress != address(oldsFISC), "Cannot withdraw: old-sFISC");
        require(tokenAddress != address(oldwsFISC), "Cannot withdraw: old-wsFISC");
        require(amount > 0, "Withdraw value must be greater than 0");
        if (recipient == address(0)) {
            recipient = msg.sender; // if no address is specified the value will will be withdrawn to Owner
        }

        IERC20 tokenContract = IERC20(tokenAddress);
        uint256 contractBalance = tokenContract.balanceOf(address(this));
        if (amount > contractBalance) {
            amount = contractBalance; // set the withdrawal amount equal to balance within the account.
        }
        // transfer the token from address of this contract
        tokenContract.safeTransfer(recipient, amount);
    }

    // migrate contracts
    function migrateContracts(
        address _newTreasury,
        address _newStaking,
        address _newFISC,
        address _newsFISC,
        address _reserve
    ) external onlyGovernor {
        require(!ohmMigrated, "Already migrated");
        ohmMigrated = true;
        shutdown = false;

        require(_newTreasury != address(0), "Zero address: Treasury");
        newTreasury = ITreasury(_newTreasury);
        require(_newStaking != address(0), "Zero address: Staking");
        newStaking = IStaking(_newStaking);
        require(_newFISC != address(0), "Zero address: FISC");
        newFISC = IERC20(_newFISC);

        oldSupply = oldFISC.totalSupply(); // log total supply at time of migration

        gFISC.migrate(_newStaking, _newsFISC); // change gFISC minter

        _migrateToken(_reserve, true); // will deposit tokens into new treasury so reserves can be accounted for

        _fund(oldsFISC.circulatingSupply()); // fund with current staked supply for token migration

        emit Migrated(_newStaking, _newTreasury);
    }

    /* ========== INTERNAL FUNCTIONS ========== */

    // fund contract with gFISC
    function _fund(uint256 _amount) internal {
        newTreasury.mint(address(this), _amount);
        newFISC.approve(address(newStaking), _amount);
        newStaking.stake(address(this), _amount, false, true); // stake and claim gFISC

        emit Funded(_amount);
    }

    /**
     *   @notice Migrate token from old treasury to new treasury
     */
    function _migrateToken(address token, bool deposit) internal {
        uint256 balance = IERC20(token).balanceOf(address(oldTreasury));

        uint256 excessReserves = oldTreasury.excessReserves();
        uint256 tokenValue = oldTreasury.valueOf(token, balance);

        if (tokenValue > excessReserves) {
            tokenValue = excessReserves;
            balance = excessReserves * 10**9;
        }

        oldTreasury.manage(token, balance);

        if (deposit) {
            IERC20(token).safeApprove(address(newTreasury), balance);
            newTreasury.deposit(balance, token, tokenValue);
        } else {
            IERC20(token).safeTransfer(address(newTreasury), balance);
        }
    }
}
