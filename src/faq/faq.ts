export const faq: { q: string; resp: string }[] = [
  {
    q: 'What is a "Secure" election?',
    resp: `There are three pillars that define a secure election.

I. Authenticated voters (“One person one vote”)
SIV only lets approved people vote, and only once.

II. Private voting (“A secret election”)
SIV encrypts votes on-device, then uses advanced cryptographic shuffles before unlocking & tallying.

III. Independently verifiable tallies (“Auditable results”)
a)  Anyone can recount SIV final tallies
b)  Voters can confirm their vote was counted correctly
c)  SIV provides cryptographic Universal Verification that final results are tamper-free.`,
  },
  {
    q: 'Where does the name SIV come from? How is it pronounced?',
    resp: `SIV is short for Secure Internet Voting.
It’s pronounced like the first syllable of “civilization”.`,
  },
  {
    q: 'How does SIV ensure One Vote per Person?',
    resp: `Each voter is assigned a unique Voter Authorization token. Each token ensures only one submission. They can be revoked, re-issued, and audited as necessary.

The specific process for issuing Voter Tokens is up to Election Administrators.
This can include any combination of:

1. Unique codes sent to email addresses
2. Unique codes sent to SMS numbers
3. Unique codes sent to physical mail addresses
4. Voter drawn signatures
5. ID + selfie photos
6. IP address geolocation
7. Unique codes given in-person

The entire process leaves a written audit trail, for independent verification.
`,
  },

  {
    q: 'How does SIV ensure Vote Privacy?',
    resp: `Submitted votes are encrypted on voters’ own devices.

Once all votes are received, they go through multiple anonymizations for extra assurance, before being unlocked & tallied.`,
  },
  {
    q: 'How does SIV ensure election results are Verifiable?',
    resp: `All final election tallies can independently recounted.

There are two ways in which Votes themselves can be verified.

1. Voters themselves can personally verify their vote in the final tally. When they submit their vote, voters' devices create a random secret Verification #. Once votes are unlocked for tallying, voters can find their Verification # to confirm that their vote was cast and counted exactly as intended. This provides far greater assurance than paper elections offer, where voters have little first-hand verifiability after they submit their vote.

2. SIV also allows for cryptographic Universal Verifiability. Election administrators and approved organizations can run the SIV Universal Verifier. This provides the ability to retrace all the election steps for all votes, from encrypted submissions to final results.`,
  },
  {
    q: 'How can voters be confident in election results?',
    resp: `SIV provides individual vote verifiability.  With the secret Verification # received after votes are submitted, voters themselves can quickly and easily see that their choices are included in the final tally, without error.

This check requires little technical knowledge, can be explained in seconds, and all necessary information is automatically stored on voting device so it can be easily found later.`,
  },
  {
    q: 'How does SIV protect elections from being hacked?',
    resp: `SIV creates an auditable record of each step along the process. Everything can be independently verified for correctness, from beginning to end.

The SIV design is built with extra redundant security so that SIV does not depend on any single point of failure.`,
  },
  {
    q: 'What if voters’ devices are compromised?',
    resp: `SIV is meant to be opt-in. If you don’t trust your devices, you can borrow another or continue to use Vote by Mail or In-Person options.

If a voting device is compromised, the malware might learn how one voted, but the voter can still independently check whether their vote was submitted as intended, including checking with a separate device.

If there is an issue, votes can still be corrected after the fact, with clear justification for independent auditing.`,
  },
  {
    q: 'Aren’t computers inherently less secure than paper?',
    resp: `No, computers can be used for much stronger security than analog options, and already power much of our political, military, and economic infrastructure.

The US House of Representatives has cast all their public votes using electronic voting equipment since 1973. Before this, a single vote took 30 minutes; now it takes seconds.

The US nuclear arsenal is secured by strong multi-party cryptography, and communication from command centers to the front lines goes over digital channels, secured by strong encryption.

In a single day, the NASDAQ Stock Exchange sees hundreds of trillions of dollars of trading volume.

As of September 2021, the collective cryptocurrency algorithms currently represent over $2 trillion of market value, secured by nothing more than a secret integer on individual devices— and with no reversibility, unlike SIV.

Many people clearly prefer online options. It's easy to imagine many would likewise prefer internet voting, especially once shown how it can be even more secure than paper alternatives.
`,
  },
  {
    q: 'How does SIV comply with existing certified tallying equipment?',
    resp:
      'SIV can automatically print votes onto existing ballot designs and be fed through existing certified tallying equipment.',
  },
  {
    q: 'Does the law allow SIV to be used right now?',
    resp: `Voting laws are state by state.

SIV is compatible with overseas and military (UOCAVA) voters, including being tallied by EAC certified equipment.

Many state legislatures have been introducing bills to allow for secure internet voting. Please <a href="/#let-your-govt-know" target="_blank">add your name</a> to let your legislatures know you are interested.`,
  },
  {
    q: 'What is the difference between Secure Internet Voting & other internet voting options?',
    resp: `SIV is designed to be fast, easy, widely accessible, authenticated, cryptographically private, and voter verifiable.

Some systems share some of these properties, however no widely deployed system has all of them.`,
  },
  {
    q: 'Why isn’t internet voting already widespread?',
    resp: `Voting has unique security requirements.

Unlike most information systems, voting needs to be both authenticated (one vote per person), while also preserving strong guarantees of a secret vote, such that even administrators can’t see how anyone voted. This is unusually challenging.

Thankfully now <a href="https://secureinternetvoting.org" target="_blank">secureinternetvoting.org</a> is available and ready to make elections much easier and more trustworthy.`,
  },
  {
    q: 'How does Secure Internet Voting improve upon paper voting?',
    resp: `Voters can quickly and easily verify for themselves that their unique vote is in the final tally and independently recount the votes themselves for vastly stronger assurance that the election is fair and accurate.

It is radically faster. Ballots can be sent to voters and then returned nearly instantly, with voters receiving instant confirmation that their vote was acknowledged.

Votes can be strongly anonymized for far greater privacy guarantees than paper systems can offer, which require vast supervision.

Every encrypted vote can be traced back to a specific registered voter, meaning that the entire voter roll can be audited to provide much stronger protection against ballot stuffing.

The entire process can save election administrators and taxpayers vast amounts of time and money to run elections.`,
  },
  {
    q: 'Can SIV be used alongside paper methods?',
    resp: `SIV is an addition to existing approaches, not a replacement.

Any voter who prefers traditional methods can still use them.

Voter Authorization tokens can be invalidated as soon as a vote is recorded from another channel, or during later de-duplication stages.`,
  },
  {
    q: 'What research is Secure Internet Voting built upon?',
    resp: `SIV is based on a number of peer-reviewed cryptographic technologies:

1. Decentralized Multiparty Key Generation and Decryption
2. Discrete Logarithm Encryption
3. An Anonymization Mixnet, verified by Zero-Knowledge Proofs

The specific research is listed on <a href="https://secureinternetvoting.org/about" target="_blank">secureinternetvoting.org/about</a>.`,
  },
  {
    q: `Does SIV support multiple languages?`,
    resp: `Because SIV runs in web browsers, it works natively with freely accessible translation tools that can translate into hundreds of languages.

This offers far more language options than paper ballots or native apps.`,
  },
  {
    q: 'Does SIV support voters with disabilities?',
    resp: `Yes. Because SIV votes can be securely sent from voters’ own devices, people no longer need to travel to polling places or drop boxes.

Because SIV works in existing web browsers built on W3C Standards, we can leverage decades of work poured into Accessibility APIs.

Voters with disabilities can use their own devices, with their own preferences for Text-to-Speech, Larger Font Sizes, High Contrast Mode, and other Accessibility options.`,
  },
  {
    q: 'Does SIV support other voting methods, like Approval Voting?',
    resp: `Currently, SIV supports Plurality Voting, Block Voting, and Approval Voting. We add new voting methods as requested. Please let us know if you need more: <a href="mailto:voting-methods@secureinternetvoting.org" target="_blank">voting-methods@secureinternetvoting.org</a>.

Digital voting can make it much easier for voters to adopt these more advanced voting methods, with immediate feedback and by automatically preventing voters from accidentally disqualifying their ballot.`,
  },
  {
    q: 'What additional hardware does SIV require?',
    resp: `SIV requires no additional hardware whatsoever, and works with all off the shelf desktops, laptops, tablets, and smartphones in widespread use.`,
  },
  {
    q: 'Do voters need to install anything to use SIV?',
    resp: `No, voters can quickly mark, encrypt, and cast their vote from a web-browser without needing to install anything.

This is not only faster & easier, but also much safer for voters because it protects them in the browser sandbox.`,
  },
  {
    q: 'Does SIV use blockchain technologies?',
    resp: `SIV uses many of the same cryptographic building blocks for strong integrity, accuracy, and verifiability.

It does not require voters to manage their own private keys. Nor does it use Proof-of-Work consensus, which allows it to be very fast and environmentally friendly.

In other words, SIV uses many similar ideas, but specifically designed for the problem of easily running secure elections, not decentralized money.`,
  },
  {
    q: 'How long does it take to run a SIV election?',
    resp: `Ballots can be sent out and returned near instantly, with immediate confirmation for voters.
Once the election closes, SIV can tally millions of ballots in seconds.`,
  },
  {
    q: 'How long does it take for voters to participate in a SIV election?',
    resp:
      'As soon as voters receive their unique vote invitation, they can immediately mark their selections on their own device, then submit their encrypted vote instantly.',
  },
  {
    q: 'How does SIV impact governments’ budgets?',
    resp: `SIV can significantly lower administrative costs for personnel, polling place locations, ballot printing, mail-voting processing, and more.`,
  },
  {
    q: 'How does SIV protect voters in hostile or insecure network environments?',
    resp: `All connections to <a href="https://secureinternetvoting.org" target="_blank">secureinternetvoting.org</a> always require https Transport Layer Security.

This ensures voters' network connection to SIV cannot be tampered or surveilled.
`,
  },
  {
    q: 'Can my group use SIV for our private election?',
    resp: `Most likely, please contact us at <a href="mailto:private-usage@secureinternetvoting.org" target="_blank">private-usage@secureinternetvoting.org</a>.`,
  },
  {
    q: 'How does SIV help election administrators with public records requests?',
    resp: `We have heard from countless election clerks swamped with public records requests.

SIV automatically creates complete end-to-end verifiable elections, so that such record requests will no longer be necessary in the future.`,
  },
  {
    q: 'What are Verifying Observers?',
    resp: `Appointing Verifying Observers is a powerful SIV feature for Election Administrators.

These Verifying Observers are similar to the election observers we use in our existing paper elections. But the SIV process runs on computers and uses advanced mathematics and strong cryptography, including what are called Zero-Knowledge Proofs. It offers total privacy and verifiability, proving that none of the votes are tampered with. And it requires only a small handful of people, unlike our large paper elections which can require tens of thousands of observers, but who can ultimately provide only incomplete security.

Protocol <a href="/protocol#4" target="_blank">Steps 4</a> & <a href="/protocol#5" target="_blank">5</a> detail more about their role.
`,
  },
  {
    q: 'How should Verifying Observers be picked?',
    resp: `The most power comes from assigning Verifying Observers with independent interests, such as one nominated by each participating political party.

To be confident that the privacy of the vote is protected, voters need to trust just a single Verifying Observer. Verifying Observers do not need to trust each other, and cannot possibly tamper with votes.`,
  },
  {
    q: 'Does SIV permit vote recounts?',
    resp: `SIV provides the full list of anonymized votes to allow for independent recounts. In fact, every device that visits the public election status page automatically does its own recount.

In other words, you get thousands of independent recounts for free.`,
  },
  {
    q: 'How does SIV impact Risk Limiting Audits?',
    resp: `SIV greatly strengthens the power of Risk Limiting Audits.

RLAs are often currently used to double check vote tallies. SIV makes this unnecessary because all vote tallies are independently verifiable and automatically recounted by every device that visits the public election status page.

RLAs are still very useful to audit voter rolls & Voter Authorization token issuance, and to help voters check their Voter Verification #’s are in the final tally.`,
  },
  {
    q: `What if voters are subject to phishing attacks?`,
    resp: `SIV automatically sends voters a confirmation email as soon as their encrypted vote is received. If there is unauthorized access, the voter is quickly alerted to it.

Voter Auth Tokens can be invalidated, including even after they're used. Thus stolen Auth Tokens can be remedied.

<i>Note:</i> All invalidations after votes are submitted require clear justification, for independent auditability.
`,
  },
]
