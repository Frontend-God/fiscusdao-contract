import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import {
  FiscusERC20Token,
  FiscusERC20Token__factory,
  FiscusAuthority__factory
} from '../../types';

describe("FiscusTest", () => {
  let deployer: SignerWithAddress;
  let vault: SignerWithAddress;
  let bob: SignerWithAddress;
  let alice: SignerWithAddress;
  let fisc: FiscusERC20Token;

  beforeEach(async () => {
    [deployer, vault, bob, alice] = await ethers.getSigners();

    const authority = await (new FiscusAuthority__factory(deployer)).deploy(deployer.address, deployer.address, deployer.address, vault.address);
    await authority.deployed();

    fisc = await (new FiscusERC20Token__factory(deployer)).deploy(authority.address);

  });

  it("correctly constructs an ERC20", async () => {
    expect(await fisc.name()).to.equal("Fiscus");
    expect(await fisc.symbol()).to.equal("FISC");
    expect(await fisc.decimals()).to.equal(9);
  });

  describe("mint", () => {
    it("must be done by vault", async () => {
      await expect(fisc.connect(deployer).mint(bob.address, 100)).
      to.be.revertedWith("UNAUTHORIZED");
    });

    it("increases total supply", async () => {
      let supplyBefore = await fisc.totalSupply();
      await fisc.connect(vault).mint(bob.address, 100);
      expect(supplyBefore.add(100)).to.equal(await fisc.totalSupply());
    });
  });

  describe("burn", () => {
    beforeEach(async () => {
      await fisc.connect(vault).mint(bob.address, 100);
    });

    it("reduces the total supply", async () => {
      let supplyBefore = await fisc.totalSupply();
      await fisc.connect(bob).burn(10);
      expect(supplyBefore.sub(10)).to.equal(await fisc.totalSupply());
    });

    it("cannot exceed total supply", async () => {
      let supply = await fisc.totalSupply();
      await expect(fisc.connect(bob).burn(supply.add(1))).
      to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("cannot exceed bob's balance", async () => {
      await fisc.connect(vault).mint(alice.address, 15);
      await expect(fisc.connect(alice).burn(16)).
      to.be.revertedWith("ERC20: burn amount exceeds balance");
    });
  });
});
