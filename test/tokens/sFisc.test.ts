import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { FakeContract, smock } from '@defi-wonderland/smock'

import {
  IStaking,
  IERC20,
  IgFISC,
  FiscusERC20Token,
  FiscusERC20Token__factory,
  SFiscus,
  SFiscus__factory,
  GFISC,
  FiscusAuthority__factory,
  ITreasury,
} from '../../types';

const TOTAL_GONS = 5000000000000000;
const ZERO_ADDRESS = ethers.utils.getAddress("0x0000000000000000000000000000000000000000");

describe("sFisc", () => {
  let initializer: SignerWithAddress;
  let treasury: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let fisc: FiscusERC20Token;
  let sFisc: SFiscus;
  let gFiscFake: FakeContract<GFISC>;
  let stakingFake: FakeContract<IStaking>;
  let treasuryFake: FakeContract<ITreasury>;

  beforeEach(async () => {
    [initializer, alice, bob] = await ethers.getSigners();
    stakingFake = await smock.fake<IStaking>('IStaking');
    treasuryFake = await smock.fake<ITreasury>('ITreasury');
    gFiscFake = await smock.fake<GFISC>('gFISC');

    const authority = await (new FiscusAuthority__factory(initializer)).deploy(initializer.address, initializer.address, initializer.address, initializer.address);
    fisc = await (new FiscusERC20Token__factory(initializer)).deploy(authority.address);
    sFisc = await (new SFiscus__factory(initializer)).deploy();
  });

  it("is constructed correctly", async () => {
    expect(await sFisc.name()).to.equal("Staked FISC");
    expect(await sFisc.symbol()).to.equal("sFISC");
    expect(await sFisc.decimals()).to.equal(9);
  });

  describe("initialization", () => {
    describe("setIndex", () => {
      it("sets the index", async () => {
        await sFisc.connect(initializer).setIndex(3);
        expect(await sFisc.index()).to.equal(3);
      });

      it("must be done by the initializer", async () => {
        await expect(sFisc.connect(alice).setIndex(3)).to.be.reverted;
      });

      it("cannot update the index if already set", async () => {
        await sFisc.connect(initializer).setIndex(3);
        await expect(sFisc.connect(initializer).setIndex(3)).to.be.reverted;
      });
    });

    describe("setgFISC", () => {
      it("sets gFiscFake", async () => {
        await sFisc.connect(initializer).setgFISC(gFiscFake.address);
        expect(await sFisc.gFISC()).to.equal(gFiscFake.address);
      });

      it("must be done by the initializer", async () => {
        await expect(sFisc.connect(alice).setgFISC(gFiscFake.address)).to.be.reverted;
      });

      it("won't set gFiscFake to 0 address", async () => {
        await expect(sFisc.connect(initializer).setgFISC(ZERO_ADDRESS)).to.be.reverted;
      });
    });

    describe("initialize", () => {
      it("assigns TOTAL_GONS to the stakingFake contract's balance", async () => {
        await sFisc.connect(initializer).initialize(stakingFake.address, treasuryFake.address);
        expect(await sFisc.balanceOf(stakingFake.address)).to.equal(TOTAL_GONS);
      });

      it("emits Transfer event", async () => {
        await expect(sFisc.connect(initializer).initialize(stakingFake.address, treasuryFake.address)).
        to.emit(sFisc, "Transfer").withArgs(ZERO_ADDRESS, stakingFake.address, TOTAL_GONS);
      });

      it("emits LogStakingContractUpdated event", async () => {
        await expect(sFisc.connect(initializer).initialize(stakingFake.address, treasuryFake.address)).
        to.emit(sFisc, "LogStakingContractUpdated").withArgs(stakingFake.address);
      });

      it("unsets the initializer, so it cannot be called again", async () => {
        await sFisc.connect(initializer).initialize(stakingFake.address, treasuryFake.address);
        await expect(sFisc.connect(initializer).initialize(stakingFake.address, treasuryFake.address)).to.be.reverted;
      });
    });
  });

  describe("post-initialization", () => {
    beforeEach(async () => {
      await sFisc.connect(initializer).setIndex(1);
      await sFisc.connect(initializer).setgFISC(gFiscFake.address);
      await sFisc.connect(initializer).initialize(stakingFake.address, treasuryFake.address);
    });

    describe("approve", () => {
      it("sets the allowed value between sender and spender", async () => {
        await sFisc.connect(alice).approve(bob.address, 10);
        expect(await sFisc.allowance(alice.address, bob.address)).to.equal(10);
      });

      it("emits an Approval event", async () => {
        await expect(await sFisc.connect(alice).approve(bob.address, 10)).
        to.emit(sFisc, "Approval").withArgs(alice.address, bob.address, 10);
      });
    });

    describe("increaseAllowance", () => {
      it("increases the allowance between sender and spender", async () => {
        await sFisc.connect(alice).approve(bob.address, 10);
        await sFisc.connect(alice).increaseAllowance(bob.address, 4);

        expect(await sFisc.allowance(alice.address, bob.address)).to.equal(14);
      });

      it("emits an Approval event", async () => {
        await sFisc.connect(alice).approve(bob.address, 10);
        await expect(await sFisc.connect(alice).increaseAllowance(bob.address, 4)).
        to.emit(sFisc, "Approval").withArgs(alice.address, bob.address, 14);
      });
    });

    describe("decreaseAllowance", () => {
      it("decreases the allowance between sender and spender", async () => {
        await sFisc.connect(alice).approve(bob.address, 10);
        await sFisc.connect(alice).decreaseAllowance(bob.address, 4);

        expect(await sFisc.allowance(alice.address, bob.address)).to.equal(6);
      });

      it("will not make the value negative", async () => {
        await sFisc.connect(alice).approve(bob.address, 10);
        await sFisc.connect(alice).decreaseAllowance(bob.address, 11);

        expect(await sFisc.allowance(alice.address, bob.address)).to.equal(0);
      });

      it("emits an Approval event", async () => {
        await sFisc.connect(alice).approve(bob.address, 10);
        await expect(await sFisc.connect(alice).decreaseAllowance(bob.address, 4)).
        to.emit(sFisc, "Approval").withArgs(alice.address, bob.address, 6);
      });
    });

    describe("circulatingSupply", () => {
      it("is zero when all owned by stakingFake contract", async () => {
        await stakingFake.supplyInWarmup.returns(0);
        await gFiscFake.totalSupply.returns(0);
        await gFiscFake.balanceFrom.returns(0);

        const totalSupply = await sFisc.circulatingSupply();
        expect(totalSupply).to.equal(0);
      });

      it("includes all supply owned by gFiscFake", async () => {
        await stakingFake.supplyInWarmup.returns(0);
        await gFiscFake.totalSupply.returns(10);
        await gFiscFake.balanceFrom.returns(10);

        const totalSupply = await sFisc.circulatingSupply();
        expect(totalSupply).to.equal(10);
      });


      it("includes all supply in warmup in stakingFake contract", async () => {
        await stakingFake.supplyInWarmup.returns(50);
        await gFiscFake.totalSupply.returns(0);
        await gFiscFake.balanceFrom.returns(0);

        const totalSupply = await sFisc.circulatingSupply();
        expect(totalSupply).to.equal(50);
      });
    });
  });
});
