// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config();

let airdrop;
let token;
let Airdrop;
let MyToken;
let signers;

async function main() {
  await deploy();
  await mintTokens();
  await approveTokens();
  await transferTokensFromAirdropSC();
  await transferETHFromAirdropSC();
}

/*
  Deploy all the smart contracts 
  Airdrop : smart contract to allow the transfer of tokens of any ERC20 
  MyToken : an ERC20 example
*/
async function deploy() {
  const Airdrop = await hre.ethers.getContractFactory("Airdrop");
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const signers = await ethers.getSigners();

  this.Airdrop = Airdrop;
  this.MyToken = MyToken;
  this.signers = signers;

  const airdrop = await Airdrop.deploy();
  await airdrop.deployed();
  console.log(
    `Airdrop with deployed to ${airdrop.address}`
  );
  this.airdrop = airdrop.address;


  const mytoken = await MyToken.deploy();
  await mytoken.deployed();
  console.log(
    `MyToken with deployed to ${mytoken.address}`
  );
  this.token = mytoken.address;
}

/*
  Minting of tokens to a specific address
*/
async function mintTokens() {
  const contract = await this.MyToken.attach(
    this.token// The deployed contract address
  );

  const mint = await contract.mint(this.signers[0].address, ethers.utils.parseUnits("10", "ether"));
  mint.wait();
  console.log(`Token minting hash ` + mint.hash);
}

/*
  Approval of tokens to the airdrop smart contract 
  to allow a transferFrom 
*/
async function approveTokens() {
  const contract = await this.MyToken.attach(
    this.token// The deployed contract address
  );

  const approval = await contract.approve(this.airdrop, ethers.utils.parseUnits("10", "ether"));
  approval.wait();
  console.log(`Token approval hash ` + approval.hash);
}

/*
  Transfer of tokens from the smart contract 
  after getting the approval from the user
*/
async function transferTokensFromAirdropSC() {
  const contract = await this.Airdrop.attach(
    this.airdrop// The deployed contract address
  );
  const httpsProvider = new ethers.providers.JsonRpcProvider("https://linea-goerli.infura.io/v3/"+process.env.INFURA_KEY_API);
  let feeData = await httpsProvider.getFeeData();  
  const tokenTransfer = await contract.transferToken(this.token, this.signers[1].address, ethers.utils.parseUnits("10", "ether"),
  {
    maxPriorityFeePerGas: feeData["maxPriorityFeePerGas"].mul(50), // Recommended maxPriorityFeePerGas
    maxFeePerGas: feeData["maxFeePerGas"].mul(50), // Recommended maxFeePerGas
    gasLimit: "100000", // basic transaction costs exactly 21000
  });
  tokenTransfer.wait();
  console.log(`Token transfer hash ` + tokenTransfer.hash);
}

/*
  Transfer of eth from the smart contract 
  transferEth : is a payable function which allow a user to send eth to any other user
*/
async function transferETHFromAirdropSC() {
  const contract = await this.Airdrop.attach(
    this.airdrop// The deployed contract address
  );

  const ethTransfer = await contract.transferEth(this.signers[1].address, {value : ethers.utils.parseUnits("0.00001", "ether")});
  ethTransfer.wait();
  console.log(`Eth transfer hash ` + ethTransfer.hash);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
