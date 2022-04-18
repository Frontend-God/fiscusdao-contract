const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    const oldsFISC = "0x1Fecda1dE7b6951B248C0B62CaeBD5BAbedc2084";

    const WSFISC = await ethers.getContractFactory('wFISC');
    const wsFISC = await WSFISC.deploy(oldsFISC);

  console.log("old wsFISC: " + wsFISC.address);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})
