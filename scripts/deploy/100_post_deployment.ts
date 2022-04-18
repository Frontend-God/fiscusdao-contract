import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { waitFor } from "../txHelper";
import { CONTRACTS, INITIAL_REWARD_RATE, INITIAL_INDEX, BOUNTY_AMOUNT } from "../constants";
import {
  FiscusAuthority__factory,
  Distributor__factory,
  FiscusERC20Token__factory,
  FiscusStaking__factory,
  SFiscus__factory,
  GFISC__factory,
  FiscusTreasury__factory,
} from "../../types";

// TODO: Shouldn't run setup methods if the contracts weren't redeployed.
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deployer } = await getNamedAccounts();
  const signer = await ethers.provider.getSigner(deployer);

  const authorityDeployment = await deployments.get(CONTRACTS.authority);
  const fiscDeployment = await deployments.get(CONTRACTS.fisc);
  const sFiscDeployment = await deployments.get(CONTRACTS.sFisc);
  const gFiscDeployment = await deployments.get(CONTRACTS.gFisc);
  const distributorDeployment = await deployments.get(CONTRACTS.distributor);
  const treasuryDeployment = await deployments.get(CONTRACTS.treasury);
  const stakingDeployment = await deployments.get(CONTRACTS.staking);

  const authorityContract = await FiscusAuthority__factory.connect(
    authorityDeployment.address,
    signer
  );
  const fisc = FiscusERC20Token__factory.connect(fiscDeployment.address, signer);
  const sFisc = SFiscus__factory.connect(sFiscDeployment.address, signer);
  const gFisc = GFISC__factory.connect(gFiscDeployment.address, signer);
  const distributor = Distributor__factory.connect(distributorDeployment.address, signer);
  const staking = FiscusStaking__factory.connect(stakingDeployment.address, signer);
  const treasury = FiscusTreasury__factory.connect(treasuryDeployment.address, signer);

  // Step 1: Set treasury as vault on authority
  await waitFor(authorityContract.pushVault(treasury.address, true));
  console.log("Setup -- authorityContract.pushVault: set vault on authority");

  // Step 2: Set distributor as minter on treasury
  await waitFor(treasury.enable(8, distributor.address, ethers.constants.AddressZero)); // Allows distributor to mint fisc.
  console.log("Setup -- treasury.enable(8):  distributor enabled to mint fisc on treasury");

  // Step 3: Set distributor on staking
  await waitFor(staking.setDistributor(distributor.address));
  console.log("Setup -- staking.setDistributor:  distributor set on staking");

  // Step 4: Initialize sFISC and set the index
  if ((await sFisc.gFISC()) == ethers.constants.AddressZero) {
    await waitFor(sFisc.setIndex(INITIAL_INDEX)); // TODO
    await waitFor(sFisc.setgFISC(gFisc.address));
    await waitFor(sFisc.initialize(staking.address, treasuryDeployment.address));
  }
  console.log("Setup -- sfisc initialized (index, gfisc)");

  // Step 5: Set up distributor with bounty and recipient
  await waitFor(distributor.setBounty(BOUNTY_AMOUNT));
  await waitFor(distributor.addRecipient(staking.address, INITIAL_REWARD_RATE));
  console.log("Setup -- distributor.setBounty && distributor.addRecipient");

  // Approve staking contact to spend deployer's FISC
  // TODO: Is this needed?
  // await fisc.approve(staking.address, LARGE_APPROVAL);
};

func.tags = ["setup"];
func.dependencies = [CONTRACTS.fisc, CONTRACTS.sFisc, CONTRACTS.gFisc];

export default func;
