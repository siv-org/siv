# SIV Technical Specification

**Last updated:** 2022.09.30

This document gives a technical specification of what defines a SIV — Secure Internet Voting — election.

---

## Before The Election

These three pre-election steps — labeled `a`, `b`, & `c` — can be completed in any order, but are required before the election can begin.

### a. Compile Voter Roll

The Election Administrator must define a list of who is an eligible voter. Every Voter gets assigned a unique Authorization Token ("`Voter Auth Token`").

Auth Tokens are required to cast a vote and can only be used once. They are intentionally infeasible to guess, and only valid for a single election. The SIV Admin Software automatically generates them, using cryptographically secure randomness, whenever an Admin adds a new Voter.

Currently, they are strings of 10 hexadecimal characters (e.g. `2378bf376d`), which creates $16^{10}$ (= $2^{40}$), a little over a trillion possibilities. Attempting to brute force auth tokens is not currently a risk, because validating them is logged per IP address, and can be rate-limited.

All assigned Voter Auth Tokens are known to the Election Administrator. When the election begins, they will be shared with the specific Voter they are assigned to. They act like a traditional API Authorization Token, and should be kept secret from everyone else.

Election Administrators can invalidate individual Auth Tokens & generate new ones, as necessary, such as if a Voter accidentally leaks or loses theirs.

All used Auth Tokens can be audited after the election.

### b. Finalize Ballot Content

As with traditional paper elections, the Administrator must finalize the questions and options that appear on the ballot.

The SIV Admin software provides both a simple Point-and-Click Ballot Designer interface, as well as a machine-readable JSON Schema interface for advanced editing.

Every ballot item should have a unique key, such as "president", "governor", "mayor", "proposition_3".

SIV is fully compatible with alternative voting methods such as Ranked Choice Voting and Approval Voting. SIV makes it easier to adopt these less common methods because SIV provides real-time user-interface feedback, and can prevent Voters from accidentally invalidating their ballot.

### c. Register Privacy Protectors

The Election Administrator can enroll "Privacy Protectors". Each Privacy Protector adds additional assurance for voter privacy.

Election Administrators choose who to invite, and Privacy Protectors must also opt-in by accepting the invitation.

Privacy Protectors' main role arrives later, after all votes have been submitted, but they must be registered before the election can begin. Later, they individually anonymize all the votes themselves, and verify the SIV Universal Zero-Knowledge Proofs to ensure all votes' integrity. Only after these two vital steps are completed, they work together to unlock the vote's encryption for final tallying.

To ensure neutrally-credible acceptance of an election's fairness, Protectors can be chosen to have competing interests. They are a more powerful version of the traditional concept of Election Observers from in-person elections. Similarly, a reasonable choice would be one Privacy Protector nominated by each candidate's political party, plus the Election Administrator themselves.

Privacy Protectors do not need to trust each other, and cannot possibly tamper with votes.

Once all the Privacy Protectors have been selected and accepted their invitation, they together preform a joint Decentralized Key Generation Ceremony to create a $t$-of-$n$ Threshold Public Key, with each of them holding a fractional share of the corresponding Private Key, where $n$ is the number of total trustees, and $t$ is the configured threshold — chosen by the election administrator — required to successfully use the private key.

Vote privacy is protected even if individual Protectors are malicious or compromised, as long as no more than $t$ Protectors are compromised. For example, if the key is 4-of-5, up to 3 Protectors can be compromised, and privacy is still protected.

SIV currently uses the Pedersen DKG protocol first described in the 1992 paper "_Non-Interactive and Information-Theoretic Secure Verifiable Secret Sharing_" by Dr. Torben Pedersen. This protocol avoids ever centralizing the full key in any one location, and verifies that all ceremony members are following the protocol correctly.

SIV provides Privacy Protector software to automatically run the ceremony for all participants, using cryptographically secure sources of randomness. Every Protector gets their own complete log of exactly each step taken. All private key material is stored in participants browsers' LocalStorage, as well as displayed visually for them to backup to additional locations.

At the end of the ceremony a test encryption is created and jointly decrypted, to test the ceremony's success.

SIV's Privacy Protector software can be run entirely in the browser, from any relatively modern desktop, laptop, or smartphone, without requiring any installations.

## Election Begins

### Step 1. Invitations sent to Voters

The Election begins with Administrators delivering to each voter their `Voter Auth Tokens`.

The specific process for issuing Voter Tokens is up to Election Administrators.

This can include any combination of:

1. Verified email
2. Verified SMS messages
3. Verified physical mail letters
4. Drawn signature verification
5. Photo verification of Government IDs and/or selfies
6. IP address geolocation
7. Unique codes given in-person
8. Cryptographic public keys
9. Time-based One-Time Passwords

Each has their own trade-offs in terms of (a) speed, (b) cost, (c) ease-of-use, (d) difficulty to attack, and (e) accessibility.

SIV is intentionally flexible and non-prescriptive on this point, to accommodate different elections' and jurisdictions' requirements.

For some voters, such as Overseas voters who already receive invitations to vote via email, sticking with email alone might be sufficient. This can be augmented by also requiring additional factors like drawn signatures, to improve upon existing processes.

For other voters that are easier to reach via physical mail, Admins can elect to continue to send them physical letters with unique codes per voter to verify their receipt.

In this way, SIV can match the Voter Authentication requirements of existing processes, while upgrading the return ballot process to be faster, more accessible, and fully verifiable.

No matter which methods are chosen, the entire process leaves a written audit trail, for independent verification.

As already mentioned in Pre-A, Election Administrators can invalidate individual Auth Tokens & generate new ones, as necessary for remediation, such as if a voter accidentally leaks or loses theirs.

### Step 2. Voters Make Selections & Encrypt Their Vote

Once voters have been successfully authenticated, they can view their blank ballot.

They can make their selections with a simple point-and-click interface, similar to the ease of filling out something like a Google Form.

#### Encryption Overview

Under the hood, the SIV Voter software automatically encrypts every vote selection using Elliptic Curve ElGamal Encryption, over the Ristretto255 prime-order subgroup of Curve25519 (IETF RFC 8031), which provides a NIST-recommended security level of 128-bits, and is a so-called "SafeCurve".

The Public Key used, which SIV calls the "Encryption Address", is the Threshold Public Key generated by the Privacy Protectors in the Pre-C Ceremony.

We'll now detail all the steps that go into building the encrypted ciphertexts.

#### Voter's Device Generates a Secret Verification \#

Before encryption, the SIV Voter software automatically generates a cryptographically random and secret twelve digit decimal number, of the form `####-####-####`, called a `Voter Verification #`.

This number is distinct from the `Voter Auth Token`. It is intentionally not known which voter any individual Verification # belongs to, other than to that voter themselves. This includes the Election Administrator and the SIV server.

It is used later, for Post Election Voter Verification, but is necessary to include inside the encrypted ciphertext.

The SIV Voter software automatically stores the Verification # on the voter's device in the browser LocalStorage, so it can be retrieved later.

#### Aside on Verification # Collisions

Because the Verification # is generated privately and independently by each Voter's device, there is a small risk of collisions. Since they are made of 12 decimal digits, there are $10^{12}$ (approximately $2^{40}$) distinct Verification #'s possible. Per the Birthday Problem, we can expect a collision after around $2^{40/2}$ votes, approximately one million.

A collision is not a critical issue, but only a slight inconvenience for the voters whose Verification #'s collide. Individual voter verification is still fully possible. Furthermore, Verification #'s are specific to a single election. Since many jurisdictions report vote-totals precinct-by-precinct, there is no adverse impact on privacy to segment Verification #'s to precincts as well. Even the largest cities rarely have precincts above 10,000 voters, so we expect Verification # collisions to be quite rare, and of low-impact.

#### Building the Vote Plaintext

When the Voter has made their selection, the SIV software concatenates a string `${verification}:${vote_selection}`, e.g. `3476-7608-1222:Abraham Lincoln`.

All ballot items use the same Verification #.

### Encoding the Vote to a Ristretto Point

The SIV software then reversibly encodes the string to a point in the Ristretto255 elliptic curve prime-order subgroup by:

1. Generating a random array of 32 bytes
2. Overriding the first byte with the length `l` of the encoded string as a single 8-bit byte
3. Overriding bytes 2 through `l + 1` with a UTF-8 byte encoding of the string.
4. Converting this `length + encoded string + random bits` to a hexadecimal string, and then checking if it is a valid Ristretto point. If it's not, the embed function loops back again to Step 1 to generate new random bits to try again until it succeeds, which is approximately 1/16th of the time.

This entire process of finding a valid embedding point can be completed in a single digit number of milliseconds.

### ElGamal Encryption

SIV uses Elliptic Curve ElGamal Encryption, which uses this formula to calculate two values:

```
Encrypted = Encoded + (ElectionPublicKey * RandomNonce)
```

and

```
Lock = (Generator * RandomNonce)
```

- `+` is Elliptic Curve Point Addition
- `*` is Elliptic Curve Point Multiplication, a cryptographically hard one-way function
- `RandomNonce` is a cryptographically-secure random value, generated on the voter's device
- `Generator` is the subgroup's generator point.

The Ciphertext is the tuple `{ Encrypted, Lock }`, where each of these values are Ristretto Points converted to hex strings.

One ciphertext tuple is generated for each individual ballot item.

### Items Left Blank Are Still Encrypted

To avoid leaking which items a voter chose to vote on or not, which could accidentally de-anonymize a voter later when ballots are unlocked, all items left blank on the ballot are encrypted with the vote selection set as the string `BLANK`.

### Everything Is Handled Automatically For Voters, To Make Their Job Simple

Although a lot happens under the hood, the complex privacy and verification pieces are handled automatically for the voter by the SIV Voter software.

This entire Selection & Encryption step can be completed in a web browser, using any desktop, laptop, or smartphone made in the last few years, without requiring any installations. If necessary, voters can even make use of borrowed devices.

### All Vote Data Is Stored On the Voter's Device

For Post-Election Auditing, a "Detailed Encryption Receipt" is stored on the voter's device in their browser's LocalStorage.

This includes:

- the full ballot schema they were presented, with the specific wording of every question, description, and options
- the election's public key Encryption Address
- the voter's secret Verification #
- the plaintext of their vote selections
- their encoded Ristretto Points
- the individual Random Nonces used for encryption
- the resulting encrypted ciphertexts
- a timestamp of when everything was encrypted

Voters can delete this data if they want, but SIV defaults to storing it, to help with later verification, which can done by the voter or via larger Risk-Limiting Audits.

None of this data other than their encrypted ciphertexts leaves their device.

### Step 3. Voters Submit Encrypted Votes

After the voter has reviewed their selections, they can press "Submit" to send their encrypted vote data, along with their unique Voter Auth Token, to the election administrator via the siv.org server.

This looks like a standard POST request to https://siv.org/submit-vote, with a JSON body like:

```
{
  auth: "20bc371dc4",
  election_id: "1658271670580",
  mayor:
    {
      encrypted: "fc88a5d7e3996bb26c59ea99101571c377e2a4dbb0834f22d30d35ebf990997c",
      lock: "28cb5650c9d9c3c3a93dac60d46702219ddd1f4c301287df7d6cbf6b27fdcc1a"
    }
}
```

The SIV server automatically checks that the Voter Auth Token matches an eligible voter, and that it hasn't already been used.

If it passes, the vote is added to a public list of all votes received so far.

The voter is sent a confirmation email that their encrypted vote has been received and accepted.

This lets the voter know their job is done. It also alerts them in case someone else somehow gained access to their auth token. And it serves as a written receipt that the vote was accepted, to allow for auditing.

Because of the strong encryption, the election administrator still has no way to know how individual voters choose to vote.

## Voting Period Ends

### Step 4. Votes Are Anonymized

Although the anonymization step is conceptually simple, it involves some strong cryptography.

Conceptually, we're simply going to shuffle the list of encrypted votes.

If we just shuffled the encrypted votes, people could see where they were permuted, so the person shuffling them is also going to re-encrypt each vote in such a way that it cannot be matched with the original, and yet decrypts to the same value.

However, this still allows the shuffler to know where the votes went, so we will have each Privacy Protector perform a shuffle sequentially. This way, no single Privacy Protector will know how the votes were shuffled, and neither will anyone else.

To accomplish this step, we need an operation that takes a list of encrypted votes as input, and outputs a shuffled list of re-encrypted votes, in such a way that external observers can verify that this is what happened, i.e., a zero-knowledge proof that the output list is a re-encrypted shuffle of the input list.

We use an algorithm based on Dr. Andrew Neff's 2004 paper "Verifiable Mixing (Shuffling) of ElGamal Pairs", with the only difference being that we replace modular exponentiation with Elliptic Curve Point Multiplication.

The proofs of completeness, soundness and zero-knowledge remain the same in the case of Elliptic Curve Point Multiplication, and we get the benefit of a higher ratio of encryption strength to key-size.

### Step 5. Encrypted Votes Are Unlocked and Tallied

Now that the encrypted votes have been shuffled and re-encrypted, it is ok to decrypt them without anyone knowing whose vote is whose.

We need to decrypt them without leaking the secret key, because then it could be used to decrypt the original encrypted votes, before they were shuffled.

This decryption is done in another decentralized ceremony, involving a sufficient threshold number of Privacy Protectors, whereby each Privacy Protector submits a partial decryption of each vote, but the information is useless beyond that.

Note that this decryption is also provable -- meaning parties cannot cheat in such a way as to make the vote decrypt to something else without people knowing. These ZK Proofs of a Valid Shuffle are verifiable by everyone, and automatically checked by all the other Privacy Protectors & SIV Admin Server.

Once the votes are decrypted, their complete contents are shown to everyone, and it is trivial to tally them. The tally totals can be independently recounted, for confirmation.

## Post Election Verification

### I. Voters Can Verify Their Own Vote

We go over the steps for conducting post election verification here: https://docs.google.com/spreadsheets/d/13NDrSCkqdy7r90tJ9ivCKTM3oDWpHOU09Mb1_qI8qy4/edit?usp=sharing

### II. Admins Can Print Submitted Votes Onto Paper Ballots

The SIV Admin software has a digital-vote-to-paper-ballot automatic PDF creation function. This allows election administrators to merge SIV votes into their collection of paper votes. Every generated vote is stamped with its unique Voter Verification #, so it can still be tracked and audited after the fact.

### III. Voter Registration List Can Be Audited

Anyone with access to the voter registration list can go through the list and see independently confirm with the voter's that they did indeed vote in the election, and additionally are able to confirm their vote is in the final tally. This does not require all voters, but can use similar statistical sampling for high confidence, using the Risk-Limiting Audit Math detailed in
https://docs.google.com/spreadsheets/d/13NDrSCkqdy7r90tJ9ivCKTM3oDWpHOU09Mb1_qI8qy4/edit?usp=sharing
