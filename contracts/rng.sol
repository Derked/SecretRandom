pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract rng {

	mapping(address=>bytes32) public currentRandomSeed;
	mapping(address=>uint256) public currentRoll;
	mapping(address=>bool) public inTurn;
	mapping(address=>bytes32) public committedSecret;
	mapping(address=>bytes32) public hashedRoll;

	//in reality this comes from an oracle, this is for testing
	function rollDice(bytes32 _secretHash) external {
		require(!inTurn[msg.sender]);
		inTurn[msg.sender] = true;
		currentRandomSeed[msg.sender] = keccak256(abi.encodePacked(msg.sender, block.timestamp, block.difficulty));
		committedSecret[msg.sender] = _secretHash;
	}

	function revealNumber(bytes calldata _secret) external {
		require(inTurn[msg.sender]);
		require(sha256(_secret) == committedSecret[msg.sender]);
		hashedRoll[msg.sender] = sha256(abi.encodePacked(_secret, currentRandomSeed[msg.sender]));
		uint256 random = uint256(hashedRoll[msg.sender]) % 6 + 1;
		currentRoll[msg.sender] = random;
		inTurn[msg.sender] = false;
	}
	

}