require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    lineaTestnet: {
      url: "https://linea-goerli.infura.io/v3/"+process.env.INFURA_KEY_API,
      chainId: 59140,
      accounts: {
        mnemonic: process.env.MNEMONIC
      },
    },
  },
  solidity: {
    version: "0.8.21",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: 'paris',
    },
  },
  etherscan: {
    // Your API key for Etherscan
    apiKey: {
      // Linea testnet 
      lineaTestnet : process.env.LINEA_TESTNET_KEY_API,
    }
  }
};
