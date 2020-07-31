export const faq: { q: string; resp?: string }[] = [
  {
    q: "What if a voter's device is compromised? From malware, viruses, keyloggers, etc?",
    resp: `Yes, definitely a concern, especially at massive scale.

But some nice things to consider:

1. SIV is meant to be opt-in: if you don't trust your devices, you can stick with Vote by Mail or In-Person.

2. Each step of the process can be inspected & verified, including by separate hardware. So you can quickly use a friend's phone to confirm your vote was encrypted correctly, or submitted correctly.

3. In case there is a problem, you can submit a request to the Election Admin to invalidate that vote token. We hope this option will only be necessary in rare cases, but it's always available.

Stepping back, we agree that malware is a serious concern. Not just for voting, but for everything in our increasingly digital world. And yet, for comparison, many people shop, manage their bank accounts, and pay taxes online. Some people have even chosen to entrust over $300bn to cryptocurrency algorithms, secured by nothing more than a secret integer on their (or their custodian's) device, and with no reversibility.

If some people prefer internet money, it's not hard to imagine many would likewise prefer internet voting.

We're not looking to force SIV on anyone, just to offer it as an additional option. 🙂`,
  },
]
