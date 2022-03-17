export const faq: { id?: string; q: string; resp: string }[] = [
  {
    id: 'secure',
    q: 'What is a "Secure" election?',
    resp: `There are three pillars that define a secure election.

<b>I. Authenticated voters (“<i>One person one vote</i>”)</b>
SIV only lets registered & authenticated people vote, and only once.

<b>II. Private voting (“<i>A secret election</i>”)</b>
SIV encrypts votes on the voter's personal device, then uses advanced cryptographic shuffles before unlocking & tallying, for provable vote privacy.

<b>III. Independently verifiable tallies (“<i>Auditable results</i>”)</b>
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
    id: '1p1v',
    q: 'How does SIV ensure One Vote per Person?',
    resp: `Each voter is assigned a unique Voter Authorization token. Each token ensures only one submission. They can be revoked, re-issued, and audited as necessary.

The specific process for issuing Voter Tokens is up to Election Administrators.

This can include any combination of:

    1. Unique codes sent to email addresses
    2. Unique codes sent to SMS numbers
    3. Unique codes sent to physical mail addresses
    4. Signature verification
    5. ID + selfie photos
    6. IP address geolocation
    7. Unique codes given in-person
    8. Time-based One-Time Passwords

The entire process leaves a written audit trail, for independent verification.
`,
  },

  {
    id: 'privacy',
    q: 'How does SIV ensure Vote Privacy?',
    resp: `Using <a href="https://en.wikipedia.org/wiki/Threshold_cryptosystem" target="_blank">Threshold Key Cryptography</a>, the SIV system doesn't allow anyone, including the election administrators, to see how anyone else voted.

Once a voter makes their selections, all their options get encrypted on their voting device.
Their plaintext never leaves their device.

Once all votes are received, the Verifying Observers' computers each add their own cryptographic shuffle to all the votes, for thorough anonymization, before working together to unlock the votes for tallying.

This is a similar process as with paper ballots, where voters are confirmed, but the voter's identification is not on the submitted ballot.

The SIV system offers even more rigorous privacy, so nobody has the ability to connect votes to voter's identities, while maintaining complete auditability of who voted & verifiability of final results.`,
  },
  {
    id: 'verifiable',
    q: 'How does SIV ensure election results are Verifiable?',
    resp: `All final election tallies can be independently recounted.

There are two ways in which votes can be verified.

1. Voters themselves can personally verify their vote in the final tally. When they submit their vote, voters' devices create a random secret <i><b>Verification #</b></i>. Once votes are unlocked for tallying, voters can find their <i>Verification #</i> to confirm that their vote was cast and counted exactly as intended. This provides far greater assurance than paper elections offer, where voters have little first-hand verifiability after they submit their vote.

2. SIV also allows for cryptographic <i><b>Universal Verifiability</b></i>. Election administrators and approved organizations can run the SIV Universal Verifier. This provides the ability to retrace all the election steps for all votes, from encrypted submissions to final results.`,
  },
  {
    q: 'How can voters be confident in election results?',
    resp: `Unlike paper methods, SIV provides individual vote verifiability.  With the secret <i>Verification #</i> received after votes are submitted, voters themselves can quickly and easily see that their choices are included in the final tally, without error.

This check requires little technical knowledge, can be explained in seconds, and all necessary information is automatically stored on voting devices so it can be easily found later.`,
  },
  {
    q: 'Does SIV permit vote recounts?',
    resp: `SIV provides the full list of anonymized votes to allow for independent recounts. In fact, every device that visits the public election status page automatically does its own recount.

In other words, you get thousands of independent recounts for free.`,
  },
  {
    q: 'How does SIV protect elections from being hacked?',
    resp: `SIV creates an auditable record of each step along the process. Everything can be independently verified for correctness, from beginning to end.

The SIV design is built with extra redundant security so that SIV does not depend on any single point of failure.

SIV is significantly more trustworthy than paper elections, because all election results can be independently verified.`,
  },
  {
    q: 'What if voters’ devices are compromised?',
    resp: `SIV is meant to be opt-in. If you don’t trust your devices, you can borrow another or continue to use Vote by Mail or In-Person options.

If a voting device is compromised, the malware may learn how one voted, but voters can still check whether their vote was submitted as intended, including checking with a separate device.

If needed, SIV still allows for votes to be corrected even after the shuffling & unlocking stage, with clear justification given for independent auditing. This is a powerful remedial ability not possible with paper elections.`,
  },
  {
    q: 'How can SIV address election irregularities?',
    resp: `Unlike paper elections, SIV allows votes to be corrected even after anonymization.

With paper ballots, courts have only crude and limited tools to address alleged election irregularity, such as throwing out the count from an entire precinct or county, or calling for a new election.

Because SIV is able to preserve all data at every step along the way, a court facing a claim of election irregularities is now empowered with far greater and flexible precision to correct or rollback elections exactly as needed.`,
  },
  {
    q: 'Aren’t computers inherently less secure than paper?',
    resp: `No, computers can be used for much stronger security than analog options, and already power much of our political, military, and economic infrastructure.

The US House of Representatives has cast all their public votes using electronic voting equipment since 1973. Before this, a single vote took 30 minutes; now it takes seconds.

The US nuclear arsenal is secured by strong multi-party cryptography, and communication from command centers to the front lines goes over digital channels, secured by strong encryption.

Millions of Americans have adopted online banking. In a single day, the NASDAQ Stock Exchange sees hundreds of billions of dollars of trading volume.

As of September 2021, the collective cryptocurrency algorithms currently represent over $2 trillion of market value, secured by nothing more than secret integers on individual devices— and with no reversibility, unlike SIV.

Many people clearly prefer online options. It's easy to imagine many would likewise prefer internet voting, especially once shown how it can be even more secure than paper alternatives.`,
  },
  {
    q: 'How does SIV comply with existing certified tallying equipment?',
    resp: 'SIV can automatically print votes onto existing ballot designs and be fed through existing certified tallying equipment.',
  },
  {
    q: 'Does the law allow SIV to be used right now?',
    resp: `Voting laws vary state by state.

Most states already permit internet voting for overseas and military voters (<i>UOCAVA</i>). To comply with state regulations, SIV is compatible with existing EAC certified tallying equipment.

A number of state legislators have introduced bills to allow for wider use of internet voting. Please <a href="/#let-your-govt-know" target="_blank">add your name</a> to let your representatives know you are interested.`,
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

The SIV team has understood these challenges and focused on solving them from day one. <a href="https://siv.org" target="_blank">siv.org</a> is now available to run fast, private, & verifiable elections.`,
  },
  {
    q: 'How does Secure Internet Voting improve upon paper voting?',
    resp: `1. Voters can quickly and easily verify for themselves that their unique vote is in the final tally and independently recount the votes themselves for vastly stronger assurance that the election is fair and accurate.

2. It is radically faster. Ballots can be sent to voters and then returned nearly instantly, with voters receiving instant confirmation that their vote was acknowledged.

3. Every encrypted vote can be traced back to a specific registered voter, meaning that the entire voter roll can be audited to provide much stronger protection against ballot stuffing.

4. Votes can be strongly anonymized for far greater privacy guarantees than paper systems can offer, which require vast supervision.

5. The entire process can save election administrators and taxpayers vast amounts of time and money to hold elections.

6. Votes can now be revoked, with sufficient justification, at any point, even after anonymization & tallying, for powerful new remediation abilities.`,
  },
  {
    q: `Does SIV support multiple languages?`,
    resp: `SIV provides voters with far greater language accessibility than printed options.

Because SIV runs in web browsers, it works natively with freely accessible translation tools that can translate into hundreds of languages.

It also frees Election Administrators from needing to determine into which languages ballots must be translated.`,
  },
  {
    q: 'Does SIV support voters with disabilities?',
    resp: `Yes, because SIV votes can be securely sent from voters’ own devices, people no longer need to travel to polling places or drop boxes.

SIV works in existing web browsers built on W3C Standards, thus leveraging decades of work poured into Accessibility APIs.

Voters with disabilities can use their own devices, with their own preferences for Text-to-Speech, Larger Font Sizes, High Contrast Mode, and other Accessibility options.`,
  },
  {
    q: 'Can SIV be used alongside paper methods?',
    resp: `SIV is an addition to existing approaches, not a replacement.

Any voter who prefers traditional methods can still use them.

Voter Authorization tokens can be invalidated as soon as a vote is recorded from another channel, or during later de-duplication stages. This ensures no voter can cast two ballots by using multiple methods.`,
  },
  {
    id: 'better-voting-methods',
    q: 'Does SIV support other voting methods, like Approval Voting?',
    resp: `Currently, SIV supports Plurality Voting, Block Voting, and Approval Voting. We add new voting methods as requested. Please let us know if you need more: <a href="mailto:voting-methods@siv.org" target="_blank">voting-methods@siv.org</a>.

Digital voting can make it much easier for voters to adopt these more advanced voting methods, with immediate feedback and automatically preventing voters from accidentally disqualifying their ballot.`,
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

In other words, SIV uses many similar ideas, but is specifically designed for the problem of easily running secure elections, not decentralized money.`,
  },
  {
    q: 'What research is Secure Internet Voting built upon?',
    resp: `SIV is based on a number of peer-reviewed cryptographic technologies:

1. Decentralized Multiparty Key Generation and Decryption
2. Discrete Logarithm Encryption
3. An Anonymization Mixnet, verified by Zero-Knowledge Proofs

The specific research is listed on <a href="https://siv.org/about" target="_blank">siv.org/about</a>.`,
  },
  {
    q: 'How long does it take to run a SIV election?',
    resp: `Ballots can be sent out and returned near instantly, with immediate confirmation for voters.
Once the election closes, SIV can tally millions of ballots in seconds.`,
  },
  {
    q: 'How long does it take for voters to participate in a SIV election?',
    resp: 'As soon as voters receive their unique vote invitation, they can immediately mark their selections on their own device, then submit their encrypted vote instantly.',
  },
  {
    q: 'How does SIV impact governments’ budgets?',
    resp: `SIV can significantly lower administrative costs for personnel, polling place locations, ballot printing, mail-voting processing, and more.`,
  },
  {
    q: 'How does SIV protect voters in hostile or insecure network environments?',
    resp: `All connections to <a href="https://siv.org" target="_blank">siv.org</a> always require https Transport Layer Security.

This protects voters' network connection to prevent tampering and surveillance.`,
  },
  {
    q: 'Can my group use SIV for our private election?',
    resp: `Most likely, please contact us at <a href="mailto:private-usage@siv.org" target="_blank">private-usage@siv.org</a>.`,
  },
  {
    q: 'How does SIV help election administrators with public records requests?',
    resp: `We have heard from countless election clerks swamped with public records requests.

SIV automatically creates complete end-to-end verifiable elections, so that anyone who submits record requests can simply be directed to the publicly posted election data.`,
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
    resp: `The most secure and safest approach is to assign Verifying Observers with independent interests, such as one nominated by each participating political party.

To be confident that the privacy of the vote is protected, voters need to trust just a single Verifying Observer. Verifying Observers do not need to trust each other, and cannot possibly tamper with votes.`,
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
