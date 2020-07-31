export const faq: { q: string; resp?: string }[] = [
  {
    q: 'How does SIV authenticate voters?',
    resp: `Different jurisdictions have different requirements and options available to them.

It's easier to think of SIV as focused on the Casting & Tallying parts of a vote, after voters have already been authenticated.

SIV isn't strict about how voters are authenticated, only requiring that Election Administrators send individualized Vote Tokens to voters in some way. It's also important that this process generates written records, for auditing.

For many non-governmental elections, a simple email can suffice. Voters still gain the strong Privacy & Verifiability benefits of SIV.

Government elections, on the other hand, have a much higher bar.

But they also have large resources available to them. Current budgets range from $5 - $20 per voter, per election.

In general, SIV can build upon any authentication system, including existing Mail or even In-Person protocols. Used this way, SIV can greatly improve the process for marking, submitting, & tallying ballots. Compared to paper methods, SIV can be much faster, more accessible, entirely verifiable, provably private, and all with lower costs.

Long term, there are faster & cheaper digital options for Token distribution. Over time, jurisdictions can move towards going entirely paperless, if desired.

But as a starting place, SIV can be easily implemented with exactly what Vote by Mail does: (1) Mail voters a sealed envelop to their address on file, and (2) Require them to send back a signature.

This can all take place well ahead of the election, entirely eliminating concerns about delays from overloaded postal systems, or other last minute scheduling issues.

SIV also makes it much more practical to add additional authentication requirements, such as allowing voters to list an email address or phone number ahead of time as an extra auth factor.

SIV also enables limiting Token distribution to specific IP address geolocations. Election Administrators can draw a geographic fence to restrict Vote Token downloads to devices within the jurisdiction.

At the end of the day, the authentication process is up to Election Administrators.

Election officials can always contact us to schedule a personalized consultation if they'd like advice on the best approaches for their jurisdiction: contact@secureinternetvoting.org.`,
  },

  {
    q: 'What if voters are subject to phishing attacks?',
    resp: `Yes, phishing attacks are a concern. The good news is there's a record of each step in SIV, to audit everything.

Election Admins can & should send voters a confirmation email as soon as their encrypted vote is received, so if there is unauthorized access, the voter is quickly alerted to it.

Vote tokens can be invalidated, including after they're used, so stolen Vote Tokens can be remedied. The invalidation is posted publicly, for auditability.`,
  },

  {
    q: "What if a voter's device is compromised? From malware, viruses, keyloggers, etc?",
    resp: `Yes, malware is a concern, especially at massive scale.

But some nice things to consider:

1. SIV is meant to be opt-in: if you don't trust your devices, you can stick with Vote by Mail or In-Person.

2. Each step of the process can be inspected & verified, including by separate hardware. So you can quickly use a friend's phone to confirm your vote was encrypted correctly, or submitted correctly.

3. If there is a problem, you can submit a request to the Election Admin to invalidate that vote token. We hope this option will only be necessary in rare cases, but it's always available.

Stepping back, we agree that malware is a serious concern. Not just for voting, but for everything in our increasingly digital world. And yet, for comparison, many people use credit cards, manage their bank accounts, and pay taxes online. Some people have even chosen to entrust over $300bn to cryptocurrency algorithms, secured by nothing more than a secret integer on their (or their custodian's) device, and with no reversibility.

If some people clearly prefer doing things online, it's not hard to imagine many would likewise prefer internet voting.

We're not looking to force SIV on anyone, just to offer it as an additional option. 🙂`,
  },

  {
    q: 'Does SIV enable Vote Selling or Voter Coercion?',
    resp: `SIV does not have built-in technical guards against voters intentionally transferring their vote.

But it's still a crime. It would be hard to hide attempts to purchase votes at any significant scale.

Both sides of the transaction would be committing a felony, punishable with up to $50k in fines and 2 years jail time, per vote. How much would a market pay for individual votes, anyway? Would it really be worth it for such large downside risk if caught?

Unfortunately, Vote by Mail is also easily vulnerable to Voter Coercion. And even In-Person Voting too, now that voters bring smartphones into the voting booth with them. The camera can discreetly record proof of how one votes.

Although preventing coercion is important to maintain free & fair elections, the lack of widespread evidence of it in the US, despite current feasibility, suggests we shouldn't worry about it for now. So long as it remains only theoretical.

Rather, let's recognize that SIV can greatly *strengthen* election security, by offering very real benefits including multi-factor authentication, provable privacy, and end-to-end verifiability.`,
  },
]
