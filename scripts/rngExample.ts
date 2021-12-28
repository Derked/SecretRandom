import { ethers } from "hardhat";
import { Rng__factory } from "../typechain";

const main = async () => {
  const [owner, player1, player2] = await ethers.getSigners();

  const rngFactory = new Rng__factory(owner);
  const rngContract = await rngFactory.deploy();
  await rngContract.deployed();

  const player1Random = await rngContract.connect(player1).createRandomNumberHash();
  await player1Random.wait();
  const player2Random = await rngContract.connect(player2).createRandomNumberHash();
  await player2Random.wait();

  const p1RandSeed = await rngContract.currentRandomSeed(player1.address);
  const p2RandSeed = await rngContract.currentRandomSeed(player2.address);

  const player1Sig = await player1.signMessage(ethers.utils.arrayify(p1RandSeed));
  const player2Sig = await player2.signMessage(ethers.utils.arrayify(p2RandSeed));

  const randomNum1 = ethers.BigNumber.from(ethers.utils.sha256(player1Sig));
  const randomNum2 = ethers.BigNumber.from(ethers.utils.sha256(player2Sig));

  console.log("Player 1 Number:", randomNum1.mod(6).add(1));
  console.log("Player 2 Number:", randomNum2.mod(6).add(1));

  const p1Reveal = await rngContract.connect(player1).revealNumber(player1Sig);
  await p1Reveal.wait();

  const p2Reveal = await rngContract.connect(player2).revealNumber(player2Sig);
  await p2Reveal.wait();

  const p1RandomContract = await rngContract.currentNum(player1.address);
  const p2RandomContract = await rngContract.currentNum(player2.address);

  console.log("Player 1 Number From Contract", ethers.utils.formatUnits(p1RandomContract, "wei"));
  console.log("Player 2 Number From Contract", ethers.utils.formatUnits(p2RandomContract, "wei"));
};

main();
