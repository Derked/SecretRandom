import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

import { HardhatUserConfig } from "hardhat/types";

import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";

const config = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: [1000, 5000],
      },
    },
  },
  solidity: "0.8.0",
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
