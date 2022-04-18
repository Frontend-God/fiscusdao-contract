const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: " + deployer.address);

  const DAI = "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C";
  const oldFISC = "0xC0b491daBf3709Ee5Eb79E603D73289Ca6060932";
  const oldsFISC = "0x1Fecda1dE7b6951B248C0B62CaeBD5BAbedc2084";
  const oldStaking = "0xC5d3318C0d74a72cD7C55bdf844e24516796BaB2";
  const oldwsFISC = "0xe73384f11Bb748Aa0Bc20f7b02958DF573e6E2ad";
  const sushiRouter = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
  const uniRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const oldTreasury = "0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7";

  const FRAX = "0x2f7249cb599139e560f0c81c269ab9b04799e453";
  const LUSD = "0x45754df05aa6305114004358ecf8d04ff3b84e26";

  const Authority = await ethers.getContractFactory("FiscusAuthority");
  const authority = await Authority.deploy(
    deployer.address,
    deployer.address,
    deployer.address,
    deployer.address
  );

  const Migrator = await ethers.getContractFactory("FiscusTokenMigrator");
  const migrator = await Migrator.deploy(
    oldFISC,
    oldsFISC,
    oldTreasury,
    oldStaking,
    oldwsFISC,
    sushiRouter,
    uniRouter,
    "0",
    authority.address
  );

  const firstEpochNumber = "550";
  const firstBlockNumber = "9505000";

  const FISC = await ethers.getContractFactory("FiscusERC20Token");
  const fisc = await FISC.deploy(authority.address);

  const SFISC = await ethers.getContractFactory("sFiscus");
  const sFISC = await SFISC.deploy();

  const GFISC = await ethers.getContractFactory("gFISC");
  const gFISC = await GFISC.deploy(migrator.address, sFISC.address);

  await migrator.setgFISC(gFISC.address);

  const FiscusTreasury = await ethers.getContractFactory("FiscusTreasury");
  const fiscusTreasury = await FiscusTreasury.deploy(fisc.address, "0", authority.address);

  await fiscusTreasury.queueTimelock("0", migrator.address, migrator.address);
  await fiscusTreasury.queueTimelock("8", migrator.address, migrator.address);
  await fiscusTreasury.queueTimelock("2", DAI, DAI);
  await fiscusTreasury.queueTimelock("2", FRAX, FRAX);
  await fiscusTreasury.queueTimelock("2", LUSD, LUSD);

  await authority.pushVault(fiscusTreasury.address, true); // replaces fisc.setVault(treasury.address)

  const FiscusStaking = await ethers.getContractFactory("FiscusStaking");
  const staking = await FiscusStaking.deploy(
    fisc.address,
    sFISC.address,
    gFISC.address,
    "2200",
    firstEpochNumber,
    firstBlockNumber,
    authority.address
  );

  const Distributor = await ethers.getContractFactory("Distributor");
  const distributor = await Distributor.deploy(
    fiscusTreasury.address,
    fisc.address,
    staking.address,
    authority.address
  );

  // Initialize sfisc
  await sFISC.setIndex("7675210820");
  await sFISC.setgFISC(gFISC.address);
  await sFISC.initialize(staking.address, fiscusTreasury.address);

  await staking.setDistributor(distributor.address);

  await fiscusTreasury.execute("0");
  await fiscusTreasury.execute("1");
  await fiscusTreasury.execute("2");
  await fiscusTreasury.execute("3");
  await fiscusTreasury.execute("4");

  console.log("Fiscus Authority: ", authority.address);
  console.log("FISC: " + fisc.address);
  console.log("sFisc: " + sFISC.address);
  console.log("gFISC: " + gFISC.address);
  console.log("Fiscus Treasury: " + fiscusTreasury.address);
  console.log("Staking Contract: " + staking.address);
  console.log("Distributor: " + distributor.address);
  console.log("Migrator: " + migrator.address);
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
