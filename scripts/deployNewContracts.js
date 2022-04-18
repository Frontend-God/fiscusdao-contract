const { ethers } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ' + deployer.address);


  const firstEpochNumber = "";
  const firstBlockNumber = "";
  const gFISC = "";
  const authority = "";

  const FISC = await ethers.getContractFactory('FiscusERC20Token');
  const fisc = await FISC.deploy(authority);

  const FiscusTreasury = await ethers.getContractFactory('FiscusTreasury');
  const fiscusTreasury = await FiscusTreasury.deploy(fisc.address, '0', authority);

  const SFISC = await ethers.getContractFactory('sFiscus');
  const sFISC = await SFISC.deploy();

  const FiscusStaking = await ethers.getContractFactory('FiscusStaking');
  const staking = await FiscusStaking.deploy(fisc.address, sFISC.address, gFISC, '2200', firstEpochNumber, firstBlockNumber, authority);

  const Distributor = await ethers.getContractFactory('Distributor');
  const distributor = await Distributor.deploy(fiscusTreasury.address, fisc.address, staking.address, authority );

  await sFISC.setIndex('');
  await sFISC.setgFISC(gFISC);
  await sFISC.initialize(staking.address, fiscusTreasury.address);



  console.log("FISC: " + fisc.address);
  console.log("Fiscus Treasury: " + fiscusTreasury.address);
  console.log("Staked Fiscus: " + sFISC.address);
  console.log("Staking Contract: " + staking.address);
  console.log("Distributor: " + distributor.address);
}

main()
  .then(() => process.exit())
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
