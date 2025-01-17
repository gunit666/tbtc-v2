import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers, getNamedAccounts, helpers } = hre
  const { deployer } = await getNamedAccounts()

  const Bridge = await deployments.get("Bridge")

  const [walletCoordinator, proxyDeployment] =
    await helpers.upgrades.deployProxy("WalletCoordinator", {
      contractName: "WalletCoordinator",
      initializerArgs: [Bridge.address],
      factoryOpts: {
        signer: await ethers.getSigner(deployer),
      },
      proxyOpts: {
        kind: "transparent",
      },
    })

  if (hre.network.tags.etherscan) {
    // We use `verify` instead of `verify:verify` as the `verify` task is defined
    // in "@openzeppelin/hardhat-upgrades" to perform Etherscan verification
    // of Proxy and Implementation contracts.
    await hre.run("verify", {
      address: proxyDeployment.address,
      constructorArgsParams: proxyDeployment.args,
    })
  }

  if (hre.network.tags.tenderly) {
    await hre.tenderly.verify({
      name: "WalletCoordinator",
      address: walletCoordinator.address,
    })
  }
}

export default func

func.tags = ["WalletCoordinator"]
func.dependencies = ["Bridge"]
