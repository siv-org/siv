# SIV Technical Specification

**Last updated:** 2022.03.31

This document gives a technical specification of what defines a SIV (Secure Internet Voting) election.

-----

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

SIV is fully compatible with alternative voting methods such as Ranked Choice Voting and Approval Voting, and can prevent Voters from accidentally invalidating their ballot.

### c. Register Verifying Observers

The Election Administrator can enroll Verifying Observers. Each Verifying Observer adds additional assurance for voter privacy.

Election Administrators choose who to invite, and Verifying Observers must also opt-in by accepting the invitation.

Verifying Observers key role arrives later, after all votes have been submitted, but they must be registered before the election can begin. Later, they individually anonymize all the votes themselves, and verify the SIV Universal Zero-Knowledge Proofs to ensure all votes' integrity. Only after these two vital steps are completed, they work together to unlock the vote's encryption for final tallying.

To ensure neutrally-credible acceptance of an election's fairness, Observers can be chosen to have competing interests. They are a more powerful version of the traditional concept of Election Observers from in-person elections. Similarly, a reasonable choice would be one Verifying Observer nominated by each candidate's political party, plus the Election Administrator themselves.

Verifying Observers do not need to trust each other, and cannot possibly tamper with votes.

Once all the Verifying Observers have been selected and accepted their invitation, they together preform a joint Decentralized Key Generation Ceremony to create a $t$-of-$n$ Threshold Public Key, with each of them holding a fractional share of the corresponding Private Key, where $n$ is the number of total trustees, and $t$ is the configured threshold — chosen by the election administrator — required to successfully use the private key.

Vote privacy is protected even if individual Observers are malicious or compromised, as long as no more than $t$ Observers are compromised. For example, if the key is 4-of-5, up to 3 Observers can be compromised, and privacy is still protected.

SIV currently uses the Pedersen DKG protocol first described in the 1992 paper "*Non-Interactive and Information-Theoretic Secure Verifiable Secret Sharing*" by Dr. Torben Pedersen. This protocol avoids ever centralizing the full key in any one location, and verifies that all ceremony members are following the protocol correctly.

SIV provides Observer software to automatically run the ceremony for all participants, using cryptographically secure sources of randomness. Every Observer gets their own complete log of exactly each step taken. All private key material is stored in participants browsers' LocalStorage, as well as displayed visually for them to backup to additional locations.

At the end of the ceremony a test encryption is created and jointly decrypted, to test the ceremony's success.

SIV's Observer software can be run entirely in the browser, from any relatively modern desktop, laptop, or smartphone, without requiring any installations.

## Election Begins

### Step 1. Invitations sent to Voters

### Step 2. Voters Make Selections & Encrypt Their Vote

### Step 3. Voters Submit Encrypted Votes

## Voting Period Ends

### Step 4. Votes Are Anonymized

### Step 5. Encrypted Votes Are Unlocked and Tallied

## Post Election Verification

### I. Voters Can Verify Their Own Vote

### II. Admins Can Print Submitted Votes Onto Paper Ballots

### III. Voter Registration List Can Be Audited
