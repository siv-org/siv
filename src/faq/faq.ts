export const faq: { q: string; resp?: string }[] = [
  {
    q: 'How does SIV authenticate voters?',
    resp: `Different jurisdictions have different requirements and options available to them.

It's easier to think of SIV as focused on the Casting & Tallying parts of a vote, after voters have already been authenticated.

SIV isn't strict about how voters are authenticated, only requiring that Election Administrators send individualized Vote Tokens to voters in some way. It's also important that this process generates written records, for auditing.

For many non-governmental elections, a simple email can suffice. Voters still gain the strong Privacy & Verifiability benefits of SIV.

Government elections, on the other hand, have a much higher bar.

But they also have large resources available to them. Current budgets range from $5 - $20 per voter, per election.

In general, SIV can build upon any authentication system, including existing Vote by Mail or even In-Person Voting systems. Used this way, SIV can greatly improve the process for casting, returning, & tallying ballots. Compared to paper methods, SIV can be much faster, more accessible, entirely verifiable, provably private, and all with lower costs.

Long term, there are much faster & cheaper digital options for Vote Token distribution. If desired, jurisdictions can move towards going entirely paperless over time.

But as a starting place, SIV can be easily implemented with exactly what Vote by Mail does: (1) Mail voters a sealed envelop to their address on file, and (2) Require them to send back a signature.

This can all take place well ahead of the election, entirely eliminating concerns about delays from overloaded postal systems, or other last minute scheduling issues.

SIV also makes it much more practical to add additional authentication requirements, such as allowing voters to provide an email address or phone number ahead of time as an extra authentication factor.

SIV can also make it easy to limit Vote Token distribution to specific IP address geolocations, so that Election Administrators can draw a geographic fence, and only allow Vote Tokens to be downloaded by devices within that area.

At the end of the day, the authentication process is up to Election Administrators.

Election officials can always contact us to schedule a personalized consultation if they'd like advice on the best approach for their jurisdiction: contact@secureinternetvoting.org.`,
  },

  {
    q: "What if a voter's device is compromised? From malware, viruses, keyloggers, etc?",
    resp: `Yes, this is definitely a concern, especially at massive scale.

But some nice things to consider:

1. SIV is meant to be opt-in: if you don't trust your devices, you can stick with Vote by Mail or In-Person.

2. Each step of the process can be inspected & verified, including by separate hardware. So you can quickly use a friend's phone to confirm your vote was encrypted correctly, or submitted correctly.

3. In case there is a problem, you can submit a request to the Election Admin to invalidate that vote token. We hope this option will only be necessary in rare cases, but it's always available.

Stepping back, we agree that malware is a serious concern. Not just for voting, but for everything in our increasingly digital world. And yet, for comparison, many people shop, manage their bank accounts, and pay taxes online. Some people have even chosen to entrust over $300bn to cryptocurrency algorithms, secured by nothing more than a secret integer on their (or their custodian's) device, and with no reversibility.

If some people prefer internet money, it's not hard to imagine many would likewise prefer internet voting.

We're not looking to force SIV on anyone, just to offer it as an additional option. 🙂`,
  },
]
