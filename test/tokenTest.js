const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");

describe("tokenTest", async () => {
  let deployer;
  let token;
  let accounts;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    token = await ethers.getContract("ManuelToken", deployer);
  });
  it("msg.sender has all intial token", async () => {
    const ownerBalance = await token.balance(deployer);
    const totalSupply = await token.totalSupplyOfToken();
    assert.equal(ownerBalance.toString(), totalSupply.toString());
  });
  it("owner can approve a new address with specific value", async () => {
    const spender = accounts[1].address;
    const initialSupply = await token.totalSupplyOfToken();
    await token.approve(spender, 5);
    const spenderBalance = await token.balance(spender);
    const spenderAllownce = await token.allowonceOfOwner(spender);
    const finalSupply = await token.totalSupplyOfToken();
    assert.equal(spenderBalance.toString(), spenderAllownce.toString());
    assert.equal(
      finalSupply.toString(),
      initialSupply.add(spenderBalance).toString()
    );
  });
  it("owner can transfer to a new address", async () => {
    const spender = accounts[2].address;
    const initialOwnerBalance = await token.balance(deployer);
    await token.transfer(spender, 5);
    const finalBalanceOfOwner = await token.balance(deployer);
    const spenderBalance = await token.balance(spender);
    assert.equal(
      initialOwnerBalance.sub(finalBalanceOfOwner).toString(),
      spenderBalance.toString()
    );
  });
  it("transfer from one holder to another holder", async () => {
    const spender1 = accounts[2].address;
    const spender2 = accounts[3].address;
    const initialOwnerBalance = await token.balance(deployer);
    await token.transfer(spender1, 10);
    await token.transferFrom(spender1, spender2, 5);
    const finalBalanceOfOwner = await token.balance(deployer);
    const spender1Balance = await token.balance(spender1);
    const spender2Balance = await token.balance(spender2);
    //testting
    assert.equal(
      initialOwnerBalance.sub(finalBalanceOfOwner).toString(),
      spender1Balance.add(spender2Balance).toString()
    );
  });
  it("owner sending token to holder account", async () => {
    const spender = accounts[2].address;
    const initialOwnerBalance = await token.balance(deployer);
    await token.transfer(spender, 10);
    await token.transfer(spender, 5);
    const spenderBalance = await token.balance(spender);
    const finalBalanceOfOwner = await token.balance(deployer);
    assert.equal(
      initialOwnerBalance.sub(finalBalanceOfOwner).toString(),
      spenderBalance.toString()
    );
  });
  it("owner can increase approval", async () => {
    const spender = accounts[2].address;
    const initialSupply = await token.totalSupplyOfToken();
    await token.approve(spender, 10);
    await token.aprrovalIncrease(spender, 5);
    const increaseSpenderBalance = await token.balance(spender);
    const finalSupply = await token.totalSupplyOfToken();
    assert.equal(
      finalSupply.toString(),
      initialSupply.add(increaseSpenderBalance).toString()
    );
  });
  it("burn token from a token holder", async () => {
    const spender = accounts[2].address;
    await token.approve(spender, 10);
    const increaseSupply = await token.totalSupplyOfToken();
    const initialSpenderBalance = await token.balance(spender);
    await token.burnFrom(spender, 4);
    const finalSupply = await token.totalSupplyOfToken();
    const finalSpenderBalance = await token.balance(spender);
    assert.equal(
      increaseSupply.sub(finalSupply).toString(),
      initialSpenderBalance.sub(finalSpenderBalance).toString()
    );
  });
});
