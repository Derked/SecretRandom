#SecretRandom

- Request a hash of a random seed from rng.sol createRandomNumberHash. In reality, this will be from an oracle call or a more secure random number function
- Once the random seed is received, user signs the random seed hash and gets back signature s
- To calculate the random secret number , take sha256(s) % 6 + 1
- To reveal, verify the signature on the random secret number and set to sha256(s) % 6 + 1

This may or may not be secure and actually random. This is just a test concept.
