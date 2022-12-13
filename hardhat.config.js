require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("dotenv").config();
const goerli_RPC_url =
  "https://eth-goerli.g.alchemy.com/v2/0AqE8Bnj71I_kGHMkT94H1Xf-5afdYIB";
const goerli_accounts = process.env.goerli_accounts;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  defaultNetwork: "hardhat",
  network: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      chainId: 5,
      url: goerli_RPC_url,
      accounts: [goerli_accounts],
    },
  },
  // etherscan: {
  //   apiKey: etherscan_api,
  // },
};
