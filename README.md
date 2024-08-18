# SIV — the Secure Internet Voting protocol

Internet voting system designed for **government-grade election security**, with mathematically provable privacy & vote verifiability.

<p align="center"><img alt="screenshot-of-siv-voter-interface" src="https://hack-siv-org.vercel.app/images-for-decon-2024/screenshot-of-siv-voter-interface.png" width="300px" /></p>

## Core Security Goals

- **Authenticated voters:** Only legitimately registered voters are allowed to vote, and only once per person.
- **Private voting:** A fair election requires that voters can freely choose without anyone learning how they voted.
- **Verifiable tallies:** For widely accepted results, vote totals must be independently auditable for accuracy.

## Resources

- Homepage: [siv.org](https://siv.org)
- Documentation: [docs.siv.org](https://docs.siv.org)
- Illustrated Guide to the SIV Protocol: [siv.org/protocol](https://siv.org/protocol)
- SIV compared to other government elections options: [docs.siv.org/compare](https://docs.siv.org/compare)

## License & Restrictions

SIV is designed to [create verifiable proof of accurate election results](https://docs.siv.org/verifiability), without needing to inspect any source code — which is not feasible of remote servers anyway.

Nonetheless, the SIV Source Code is made available for transparency, to enable deep security inspections.

Permission is **_not granted_** for commercial or governmental usage, without first acquiring a separate Commercial or Government License. Contact team@siv.org if interested.

See the [SIV Public License](/LICENSE) for further details.

## Local Development Instructions

### Initial set up

1. Fork the repo
2. Duplicate the file `.env.local.TEMPLATE` into `.env.local`
3. Create (free) accounts with the providers listed in that file, adding your new API keys. [These detailed instructions](/cloud-services.md) can help if stuck.
4. Install local dependencies:

```bash
npm install
```

### Then, to start dev server

```bash
npm run dev
```

And you should see:

> Ready - server started on http://localhost:3000

🎉
