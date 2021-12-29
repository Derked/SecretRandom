#SecretRandom

- Uses ethersJS to generate random bytes and hashes these as a secret commitment
- Once the random seed is received, user gets a dice roll based off their commitment and the random seed (this is off chain and will be secret to the user for a specified portion of time while game mechanics commence)
- To calculate the random secret number , take sha256(secret, randomSeed) % 6 + 1 (also secret for the same portion of time)
- To reveal, verify the hash of the secret and set to sha256(secret, randomSeed) % 6 + 1

This may or may not be secure and actually random. This is just a test concept.
