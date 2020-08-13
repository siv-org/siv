# SIV Demo

## How to use

Install dependencies and run:

```bash
yarn
yarn dev
```

TODO:

- [x] Admin GUI to add voters by email address
- [x] Admin GUI to add Trustees by email address
- [x] Backend assigns vote tokens and emails invitation to voters
  - [x] Password protected
- [x] Voter interface to cast vote
- [x] Encrypt voters vote
  - [x] Error handling
- [x] Submit Voters vote
  - [x] Validate ballot before sending
- [x] Admin endpoint to receive submitted votes & validate vote token
- [ ] Bulletin board of all valid received votes
- [x] Admin sends voter confirmation that vote was received
- [ ] Vote Tokens can only be used once
- [ ] Admin can manually close voting early
- [ ] Admin does first shuffle
- [ ] Admin posts final results

For strong privacy:

- [ ] Trustee page to take part in Distribute Key Gen
- [ ] Trustee interface to shuffle
- [ ] Trustee interface for partial decryption

After core features complete:

- [ ] Admin can assign time for voting to close automatically
- [ ] Offer voters Extra Private Mode
- [ ] Health check on voter's device:
  - [ ] Can they establish a secure connection?
  - [ ] Is their browser up to date?
  - [ ] Is their OS up to date?
  - [ ] Do they have any fishy extensions?
  - [ ] Have any honeypots been triggered?
