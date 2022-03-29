# SIV Technical Specification

**Last updated:** 2022.03.29

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
