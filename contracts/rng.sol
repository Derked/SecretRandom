pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract rng {

	mapping(address=>bytes32) public currentRandomSeed;
	mapping(address=>uint256) public currentNum;
	mapping(address=> bool) public inTurn;

	//in reality this comes from an oracle, this is for testing
	function createRandomNumberHash() external {
		require(!inTurn[msg.sender], "Reveal First");
		 inTurn[msg.sender] = true;
		currentRandomSeed[msg.sender] = keccak256(abi.encodePacked(msg.sender, block.timestamp, block.difficulty));
	}

	function revealNumber(bytes calldata _sig) external {
		require(inTurn[msg.sender], "Roll First");
		bytes32 signedHash = ECDSA.toEthSignedMessageHash(currentRandomSeed[msg.sender]);
		require(ECDSA.recover(signedHash, _sig)==msg.sender, "invalid signature");
		currentNum[msg.sender] = uint256(sha256(_sig)) % 6 + 1;
		inTurn[msg.sender] = false;
	}

	function verifyNumber(bytes32 _hash, bytes calldata _sig) external pure returns(address) {
		bytes32 signedMsgHash = ECDSA.toEthSignedMessageHash(_hash);
		return ECDSA.recover(signedMsgHash, _sig);
	}

	function getSignedMessageHash(bytes32 _hash) external pure returns (bytes32) {
		return ECDSA.toEthSignedMessageHash(_hash);
	}
	

}