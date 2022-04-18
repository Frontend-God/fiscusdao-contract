// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.7.5;
pragma abicoder v2;

import "ds-test/test.sol"; // ds-test

import "../../../contracts/libraries/SafeMath.sol";
import "../../../contracts/libraries/FixedPoint.sol";
import "../../../contracts/libraries/FullMath.sol";
import "../../../contracts/Staking.sol";
import "../../../contracts/OFiscusERC20.sol";
import "../../../contracts/sFiscusERC20.sol";
import "../../../contracts/governance/gFISC.sol";
import "../../../contracts/Treasury.sol";
import "../../../contracts/StakingDistributor.sol";
import "../../../contracts/FiscusAuthority.sol";

import "./util/Hevm.sol";
import "./util/MockContract.sol";

contract StakingTest is DSTest {
    using FixedPoint for *;
    using SafeMath for uint256;
    using SafeMath for uint112;

    FiscusStaking internal staking;
    FiscusTreasury internal treasury;
    FiscusAuthority internal authority;
    Distributor internal distributor;

    FiscusERC20Token internal fisc;
    sFiscus internal sfisc;
    gFISC internal gfisc;

    MockContract internal mockToken;

    /// @dev Hevm setup
    Hevm internal constant hevm = Hevm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
    uint256 internal constant AMOUNT = 1000;
    uint256 internal constant EPOCH_LENGTH = 8; // In Seconds
    uint256 internal constant START_TIME = 0; // Starting at this epoch
    uint256 internal constant NEXT_REBASE_TIME = 1; // Next epoch is here
    uint256 internal constant BOUNTY = 42;

    function setUp() public {
        // Start at timestamp
        hevm.warp(START_TIME);

        // Setup mockToken to deposit into treasury (for excess reserves)
        mockToken = new MockContract();
        mockToken.givenMethodReturn(abi.encodeWithSelector(ERC20.name.selector), abi.encode("mock DAO"));
        mockToken.givenMethodReturn(abi.encodeWithSelector(ERC20.symbol.selector), abi.encode("MOCK"));
        mockToken.givenMethodReturnUint(abi.encodeWithSelector(ERC20.decimals.selector), 18);
        mockToken.givenMethodReturnBool(abi.encodeWithSelector(IERC20.transferFrom.selector), true);

        authority = new FiscusAuthority(address(this), address(this), address(this), address(this));

        fisc = new FiscusERC20Token(address(authority));
        gfisc = new gFISC(address(this), address(this));
        sfisc = new sFiscus();
        sfisc.setIndex(10);
        sfisc.setgFISC(address(gfisc));

        treasury = new FiscusTreasury(address(fisc), 1, address(authority));

        staking = new FiscusStaking(
            address(fisc),
            address(sfisc),
            address(gfisc),
            EPOCH_LENGTH,
            START_TIME,
            NEXT_REBASE_TIME,
            address(authority)
        );

        distributor = new Distributor(address(treasury), address(fisc), address(staking), address(authority));
        distributor.setBounty(BOUNTY);
        staking.setDistributor(address(distributor));
        treasury.enable(FiscusTreasury.STATUS.REWARDMANAGER, address(distributor), address(0)); // Allows distributor to mint fisc.
        treasury.enable(FiscusTreasury.STATUS.RESERVETOKEN, address(mockToken), address(0)); // Allow mock token to be deposited into treasury
        treasury.enable(FiscusTreasury.STATUS.RESERVEDEPOSITOR, address(this), address(0)); // Allow this contract to deposit token into treeasury

        sfisc.initialize(address(staking), address(treasury));
        gfisc.migrate(address(staking), address(sfisc));

        // Give the treasury permissions to mint
        authority.pushVault(address(treasury), true);

        // Deposit a token who's profit (3rd param) determines how much fisc the treasury can mint
        uint256 depositAmount = 20e18;
        treasury.deposit(depositAmount, address(mockToken), BOUNTY.mul(2)); // Mints (depositAmount- 2xBounty) for this contract
    }

    function testStakeNoBalance() public {
        uint256 newAmount = AMOUNT.mul(2);
        try staking.stake(address(this), newAmount, true, true) {
            fail();
        } catch Error(string memory error) {
            assertEq(error, "TRANSFER_FROM_FAILED"); // Should be 'Transfer exceeds balance'
        }
    }

    function testStakeWithoutAllowance() public {
        try staking.stake(address(this), AMOUNT, true, true) {
            fail();
        } catch Error(string memory error) {
            assertEq(error, "TRANSFER_FROM_FAILED"); // Should be 'Transfer exceeds allowance'
        }
    }

    function testStake() public {
        fisc.approve(address(staking), AMOUNT);
        uint256 amountStaked = staking.stake(address(this), AMOUNT, true, true);
        assertEq(amountStaked, AMOUNT);
    }

    function testStakeAtRebaseToGfisc() public {
        // Move into next rebase window
        hevm.warp(EPOCH_LENGTH);

        fisc.approve(address(staking), AMOUNT);
        bool isSfisc = false;
        bool claim = true;
        uint256 gFISCRecieved = staking.stake(address(this), AMOUNT, isSfisc, claim);

        uint256 expectedAmount = gfisc.balanceTo(AMOUNT.add(BOUNTY));
        assertEq(gFISCRecieved, expectedAmount);
    }

    function testStakeAtRebase() public {
        // Move into next rebase window
        hevm.warp(EPOCH_LENGTH);

        fisc.approve(address(staking), AMOUNT);
        bool isSfisc = true;
        bool claim = true;
        uint256 amountStaked = staking.stake(address(this), AMOUNT, isSfisc, claim);

        uint256 expectedAmount = AMOUNT.add(BOUNTY);
        assertEq(amountStaked, expectedAmount);
    }

    function testUnstake() public {
        bool triggerRebase = true;
        bool isSfisc = true;
        bool claim = true;

        // Stake the fisc
        uint256 initialFiscBalance = fisc.balanceOf(address(this));
        fisc.approve(address(staking), initialFiscBalance);
        uint256 amountStaked = staking.stake(address(this), initialFiscBalance, isSfisc, claim);
        assertEq(amountStaked, initialFiscBalance);

        // Validate balances post stake
        uint256 fiscBalance = fisc.balanceOf(address(this));
        uint256 sFiscBalance = sfisc.balanceOf(address(this));
        assertEq(fiscBalance, 0);
        assertEq(sFiscBalance, initialFiscBalance);

        // Unstake sFISC
        sfisc.approve(address(staking), sFiscBalance);
        staking.unstake(address(this), sFiscBalance, triggerRebase, isSfisc);

        // Validate Balances post unstake
        fiscBalance = fisc.balanceOf(address(this));
        sFiscBalance = sfisc.balanceOf(address(this));
        assertEq(fiscBalance, initialFiscBalance);
        assertEq(sFiscBalance, 0);
    }

    function testUnstakeAtRebase() public {
        bool triggerRebase = true;
        bool isSfisc = true;
        bool claim = true;

        // Stake the fisc
        uint256 initialFiscBalance = fisc.balanceOf(address(this));
        fisc.approve(address(staking), initialFiscBalance);
        uint256 amountStaked = staking.stake(address(this), initialFiscBalance, isSfisc, claim);
        assertEq(amountStaked, initialFiscBalance);

        // Move into next rebase window
        hevm.warp(EPOCH_LENGTH);

        // Validate balances post stake
        // Post initial rebase, distribution amount is 0, so sFISC balance doens't change.
        uint256 fiscBalance = fisc.balanceOf(address(this));
        uint256 sFiscBalance = sfisc.balanceOf(address(this));
        assertEq(fiscBalance, 0);
        assertEq(sFiscBalance, initialFiscBalance);

        // Unstake sFISC
        sfisc.approve(address(staking), sFiscBalance);
        staking.unstake(address(this), sFiscBalance, triggerRebase, isSfisc);

        // Validate balances post unstake
        fiscBalance = fisc.balanceOf(address(this));
        sFiscBalance = sfisc.balanceOf(address(this));
        uint256 expectedAmount = initialFiscBalance.add(BOUNTY); // Rebase earns a bounty
        assertEq(fiscBalance, expectedAmount);
        assertEq(sFiscBalance, 0);
    }

    function testUnstakeAtRebaseFromGfisc() public {
        bool triggerRebase = true;
        bool isSfisc = false;
        bool claim = true;

        // Stake the fisc
        uint256 initialFiscBalance = fisc.balanceOf(address(this));
        fisc.approve(address(staking), initialFiscBalance);
        uint256 amountStaked = staking.stake(address(this), initialFiscBalance, isSfisc, claim);
        uint256 gfiscAmount = gfisc.balanceTo(initialFiscBalance);
        assertEq(amountStaked, gfiscAmount);

        // test the unstake
        // Move into next rebase window
        hevm.warp(EPOCH_LENGTH);

        // Validate balances post-stake
        uint256 fiscBalance = fisc.balanceOf(address(this));
        uint256 gfiscBalance = gfisc.balanceOf(address(this));
        assertEq(fiscBalance, 0);
        assertEq(gfiscBalance, gfiscAmount);

        // Unstake gFISC
        gfisc.approve(address(staking), gfiscBalance);
        staking.unstake(address(this), gfiscBalance, triggerRebase, isSfisc);

        // Validate balances post unstake
        fiscBalance = fisc.balanceOf(address(this));
        gfiscBalance = gfisc.balanceOf(address(this));
        uint256 expectedFisc = initialFiscBalance.add(BOUNTY); // Rebase earns a bounty
        assertEq(fiscBalance, expectedFisc);
        assertEq(gfiscBalance, 0);
    }
}
