const { deployments, getNamedAccounts, ethers, network } = require("hardhat");

async function main() {
  let accounts = await ethers.getSigners();
  let spender = accounts[2].address;
  let spender2 = accounts[3].address;
  console.log(network.config.chainId);
  if (network.config.chainId == 31337) {
    await deployments.fixture(["all"]);
  }
  const { deployer } = await getNamedAccounts();
  const token = await ethers.getContract("ManuelToken", deployer);
  const symbol = await token.tokenSymbol();
  console.log("transfering token to a new address");
  const transfer1 = await token.transfer(spender, 5);
  const transferConf = await transfer1.wait(1);
  console.log(
    `successsfully transfered from spender with ${transferConf.events[0].args.value.toString()}  ${symbol}  token`
  );
  console.log("transfering token from one holder to new address");
  const transfer2 = await token.transferFrom(spender, spender2, 3);
  const transfer2conf = await transfer2.wait(1);
  console.log(transfer2conf.events[0].args.value.toString());
  console.log(
    `successsfully transfered from spender with ${transfer2conf.events[0].args.value.toString()} ${symbol} token`
  );
  console.log("transfering to a token holder from owner");
  const transfer3 = await token.transfer(spender2, 5);
  const transfer3conf = await transfer3.wait(1);
  console.log(
    `successsfully transfered from spender with ${transfer3conf.events[0].args.value.toString()}  ${symbol}  token`
  );
  console.log("approving with new address");
  const transfer4 = await token.approve(spender, 5);
  const transfer4Conf = await transfer4.wait(1);
  console.log(
    `successsfully approved  spender with ${transfer4Conf.events[0].args[2].toString()}  ${symbol}  token`
  );
  console.log("burning token from token holder");
  const transfer5 = await token.burnFrom(spender, 2);
  const transfer5Conf = await transfer5.wait(1);
  console.log(
    `successsfully burn  ${transfer5Conf.events[0].args.value.toString()}  ${symbol}  token from spender `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
