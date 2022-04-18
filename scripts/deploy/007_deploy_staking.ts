import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
    CONTRACTS,
    EPOCH_LENGTH_IN_BLOCKS,
    FIRST_EPOCH_TIME,
    FIRST_EPOCH_NUMBER,
} from "../constants";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const authorityDeployment = await deployments.get(CONTRACTS.authority);
    const fiscDeployment = await deployments.get(CONTRACTS.fisc);
    const sFiscDeployment = await deployments.get(CONTRACTS.sFisc);
    const gFiscDeployment = await deployments.get(CONTRACTS.gFisc);

    await deploy(CONTRACTS.staking, {
        from: deployer,
        args: [
            fiscDeployment.address,
            sFiscDeployment.address,
            gFiscDeployment.address,
            EPOCH_LENGTH_IN_BLOCKS,
            FIRST_EPOCH_NUMBER,
            FIRST_EPOCH_TIME,
            authorityDeployment.address,
        ],
        log: true,
    });
};

func.tags = [CONTRACTS.staking, "staking"];
func.dependencies = [CONTRACTS.fisc, CONTRACTS.sFisc, CONTRACTS.gFisc];

export default func;
