# SIV

## Development

Install dependencies:

```bash
yarn
```

Start dev server:

```bash
yarn dev

# ready - started server on http://localhost:3000
```

## Layout

- http://secureinternetvoting.org - Landing page
- http://secureinternetvoting.org/create - Create New Election
- http://secureinternetvoting.org/protocol - Protocol Description
- http://secureinternetvoting.org/faq - FAQ

## Next steps

For strong privacy:

- [ ] Trustee page to take part in Distribute Key Gen
- [ ] Trustee interface to shuffle
- [ ] Trustee interface for partial decryption

After core features complete:

- [ ] Improve Verification instructions
- [ ] Extra Private Mode (Airplane + Incognito) instructions
- [ ] Health check on voter's device:
  - [ ] Can they establish a secure connection?
  - [ ] Is their browser up to date?
  - [ ] Is their OS up to date?
  - [ ] Do they have any fishy extensions?
  - [ ] Have any honeypots been triggered?
