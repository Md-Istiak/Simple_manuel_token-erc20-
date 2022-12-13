module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("ManuelToken", {
    from: deployer,
    args: ["ManuelToken", "MT", "500"],
    log: true,
  });
  log("deployed token contract");
};
module.exports.tags = ["all"];
