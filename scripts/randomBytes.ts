import { ethers } from "hardhat";
import { Rng__factory } from "../typechain";

const main = async () => {
  const randomBig = ethers.utils.randomBytes(32);
  const rBN = ethers.BigNumber.from(randomBig);
  console.log(ethers.utils.formatUnits(rBN, "wei"));

  const randomHash = ethers.utils.sha256(randomBig);
  console.log("Hash from ethers: ", randomHash);

  const [owner, player1, player2] = await ethers.getSigners();

  const rngFactory = new Rng__factory(owner);
  const rngContract = await rngFactory.deploy();
  await rngContract.deployed();

  const rollDiceTx = await rngContract.connect(player1).rollDice(randomHash);
  await rollDiceTx.wait();

  const committedHash = await rngContract.committedSecret(player1.address);
  console.log("Committed to Contract: ", committedHash);

  const randomNumHash = await rngContract.currentRandomSeed(player1.address);

  const rolledNumberBytes = ethers.utils.soliditySha256(["bytes", "bytes32"], [randomBig, randomNumHash]);
  console.log("Roll Hash Ethers: ", rolledNumberBytes);
  const rolledNumber = ethers.BigNumber.from(rolledNumberBytes).mod(6).add(1);

  console.log("Rolled Number Ethers: ", ethers.utils.formatUnits(rolledNumber, "wei"));

  const revealTx = await rngContract.connect(player1).revealNumber(randomBig);
  await revealTx.wait();

  const contractNum = await rngContract.currentRoll(player1.address);
  const contractHashRoll = await rngContract.hashedRoll(player1.address);
  console.log("Rolled Number Contract: ", ethers.utils.formatUnits(contractNum, "wei"));
  console.log("Roll Hash Contract: ", contractHashRoll);
};

main();
