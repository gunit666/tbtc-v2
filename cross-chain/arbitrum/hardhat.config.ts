import type { HardhatUserConfig } from "hardhat/config"

import "@nomiclabs/hardhat-etherscan"
import "@keep-network/hardhat-helpers"
import "@nomiclabs/hardhat-waffle"
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"
import "hardhat-deploy"
import "@typechain/hardhat"
import "hardhat-dependency-compiler"

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },

  paths: {
    artifacts: "./build",
  },

  networks: {
    hardhat: {
      deploy: [
        // "deploy_l1",
        "deploy_l2",
      ],
    },
    goerli: {
      url: process.env.L1_CHAIN_API_URL || "",
      chainId: 5,
      deploy: ["deploy_l1"],
      accounts: process.env.L1_ACCOUNTS_PRIVATE_KEYS
        ? process.env.L1_ACCOUNTS_PRIVATE_KEYS.split(",")
        : undefined,
      tags: ["etherscan"],
    },
    mainnet: {
      url: process.env.L1_CHAIN_API_URL || "",
      chainId: 1,
      deploy: ["deploy_l1"],
      accounts: process.env.L1_ACCOUNTS_PRIVATE_KEYS
        ? process.env.L1_ACCOUNTS_PRIVATE_KEYS.split(",")
        : undefined,
      tags: ["etherscan"],
    },
    arbitrumGoerli: {
      url: process.env.L2_CHAIN_API_URL || "",
      chainId: 421613,
      deploy: ["deploy_l2"],
      accounts: process.env.L2_ACCOUNTS_PRIVATE_KEYS
        ? process.env.L2_ACCOUNTS_PRIVATE_KEYS.split(",")
        : undefined,
      tags: ["arbiscan"],
      // companionNetworks: {
      //   l1: "goerli",
      // },
    },
    arbitrumOne: {
      url: process.env.L2_CHAIN_API_URL || "",
      chainId: 42161,
      deploy: ["deploy_l2"],
      accounts: process.env.L2_ACCOUNTS_PRIVATE_KEYS
        ? process.env.L2_ACCOUNTS_PRIVATE_KEYS.split(",")
        : undefined,
      tags: ["arbiscan"],
      // companionNetworks: {
      //   l1: "mainnet",
      // },
    },
  },

  external: {
    deployments: {
      goerli: ["./external/goerli"],
      mainnet: ["./external/mainnet"],
      arbitrumGoerli: ["./external/arbitrumGoerli"],
      arbitrumOne: ["./external/arbitrumOne"],
    },
  },

  deploymentArtifactsExport: {
    goerli: "artifacts/l1",
    mainnet: "artifacts/l1",
    arbitrumGoerli: "artifacts/l2",
    arbitrumOne: "artifacts/l2",
  },

  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
      arbitrumGoerli: process.env.ARBISCAN_API_KEY,
      arbitrumOne: process.env.ARBISCAN_API_KEY,
    },
  },

  namedAccounts: {
    deployer: {
      default: 1,
      goerli: 0,
      arbitrumGoerli: 0,
      mainnet: "0x123694886DBf5Ac94DDA07135349534536D14cAf",
      arbitrumOne: "0x123694886DBf5Ac94DDA07135349534536D14cAf",
    },
    governance: {
      default: 2,
      goerli: 0,
      arbitrumGoerli: 0,
      mainnet: "0x9f6e831c8f8939dc0c830c6e492e7cef4f9c2f5f",
      arbitrumOne: "0x9f6e831c8f8939dc0c830c6e492e7cef4f9c2f5f",
    },
  },
  mocha: {
    timeout: 60_000,
  },
  typechain: {
    outDir: "typechain",
  },
}

export default config
