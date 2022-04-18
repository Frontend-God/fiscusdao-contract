import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS } from "../constants";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const sFiscDeployment = await deployments.get(CONTRACTS.sFisc);
    const migratorDeployment = await deployments.get(CONTRACTS.migrator);

    await deploy(CONTRACTS.gFisc, {
        from: deployer,
        args: [migratorDeployment.address, sFiscDeployment.address],
        log: true,
        skipIfAlreadyDeployed: true,
    });
};

func.tags = [CONTRACTS.gFisc, "migration", "tokens"];
func.dependencies = [CONTRACTS.migrator];

export default func;
