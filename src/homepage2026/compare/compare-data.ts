export type Category = { name: string; rows: Row[] }

export type OpenedModalIndex = [number, number, number] | null

export type Row = {
  d_name: string
  desc: string
  scores: [Score, Score, Score]
}

export type Score = [number, ScoreDetail]

export type ScoreDetail = { adv: string; disadv: string }

export const methods = ['SIV', 'Mail', 'In Person']

const antiCoercionArguments = {
  all: {
    pro: `Vote selling is hypothetical, not observed.
    Coercion and vote-buying attacks are challenging to scale because every manipulated vote requires a cooperating voter.
    Because it is in the best interest of both buyers & sellers to defect, the trust necessary to carry out illegal vote selling diminishes significantly.`,
  },
  inPerson: {
    con: `Coercers can peek from neighboring voting booths.`,
    pro: `In-person voting centers actively watch to prevent coercers.`,
  },
  mail: {
    con: `Trivially easy for a voter to sign a blank ballot and hand it to an in-person coercer, or fill it out in front of them.`,
  },
  paper: {
    con: `Can still provide strong-but-not-perfect evidence of voting a particular way to a remote coercer, such as over a video call or recording.
            Many voters, including high-profile celebrities, have taken pictures of their filled-in ballots and posted it to their social media profiles.`,
    pro: `Challenging to unquestionably prove how one voted to a remote coercer.
          As with SIV, biggest deterrent is heavy criminal penalties for both buyer and seller: large fines, jail time, loss of voting-rights.
          With Vote Selling Bounty Rewards:`,
  },
  siv: {
    con: `Digital receipts make it easier to unforgeably prove to a remote coercer how you voted.
    Remote coercer can more easily be anonymous.`,
    pro: `Vote selling is a serious crime with a hefty financial penalty and jail time.
          As a felony, caught vote sellers can lose their right to vote for life.
          If a SIV vote is discovered sold, it can still be cancelled, at any time. SIV Privacy Protectors can also work together to selectively de-anonymize corrupt votes for prosecution.`,
  },
}

const coercionScore = {
  inPerson: {
    adv: `${antiCoercionArguments.inPerson.pro}
          ${antiCoercionArguments.all.pro}
          ${antiCoercionArguments.paper.pro}`,
    disadv: `${antiCoercionArguments.inPerson.con}
             ${antiCoercionArguments.paper.con}`,
  },
  mail: {
    adv: `${antiCoercionArguments.paper.pro}
          ${antiCoercionArguments.all.pro}`,
    disadv: `${antiCoercionArguments.mail.con}
             ${antiCoercionArguments.paper.con}`,
  },
  siv: {
    adv: `${antiCoercionArguments.siv.pro}
          ${antiCoercionArguments.all.pro}
          SIV's *Verifiable Private Overrides* enable voters to trick coercers into thinking they voted a different way than they did.
          With a bounty reward system in place, the unique and unforgeable proofs that SIV creates turn into benefits against vote selling, as strong evidence of prosecutable illegal activity if shared.`,
    disadv: `${antiCoercionArguments.siv.con}
            Even with bounty rewards, buyers may still be able to stay anonymous, thus hard to prosecute.`,
  },
}

export const tableData: Category[] = [
  {
    name: 'Accurate Results',
    rows: [
      {
        d_name: 'Auditable Voter Authentication',
        desc: 'How sure are we that only legitimate voters are voting, and only once each?',
        scores: [
          [
            8,
            {
              adv: `Allows for a combination of auth methods: verified email delivery, SMS, drawn e-signatures, time-based one-time passwords, IP address geolocation, government ID photos, and cryptographic key pairs.
              Every encrypted vote can be individually audited back to individual submitters.
              By default, every submitter automatically gets a submission receipt in their email (with private data encrypted), so highly likely they will have enough info to carry out audit.
              Any encrypted votes which don't meet standards can be removed, disqualified or re-submitted (as appropriate), and new tallies quickly taken.
              Possible to audit vote submission IP addresses and device user-agents.`,
              disadv: `SIV is not prescriptive about the authentication methods. The specific choice is up to the election administrators.
              Performing audit on voter roll requires voter contact information, and names for individual encrypted votes, which are not automatically given out.`,
            },
          ],
          [
            5,
            {
              adv: `Confirms that the person casting the vote has access to the voter's mailbox.
              Election administrators can require signatures that are verified against the signatures on file.`,
              disadv: `Anyone with access to the mailbox, including children, spouses, roommates, can also access the blank ballot.
              Forging signatures, especially with a reference, is not that difficult. Schoolchildren sometimes do it for their parents.
              Verifying a lot of signatures is a relatively costly manual process.
              Because of postal mail delays, everything needs to be done and executed far in advance. And registration errors cannot quickly be remediated.
              Many mail boxes are not locked.
              Voters sometimes fail to update their mailing address when they move.
              How easy is it to create a bunch of fake votes and add them, without anyone noticing? It is hard to know.`,
            },
          ],
          [
            7,
            {
              adv: `Have to show up in person
              Can limit to resident's unique precinct
              Can require photo ID`,
              disadv: `Vulnerable to ballot stuffing: all ballot boxes must be watched at all times by multiple observers
              Limited post-election auditability
              Once ballots accepted, limited remediation options`,
            },
          ],
        ],
      },
      {
        d_name: 'Verifiable results',
        desc: 'How sure are we that the votes were tallied up correctly, without any votes lost or modified?',
        scores: [
          [
            9.5,
            {
              adv: `Voters and independent parties are able to verify results through various straightforward to complex methods, eliminating reliance on servers or election officials.
              In SIV elections, all votes are anonymously published after the election, which allows voters to use their unique Verification # to check if their vote was recorded correctly. 
              As everyone has access to the votes list, everyone is enable to perform recounts using simple spreadsheet tools. In addition, every device that views the election results page instantly performs its own recount, allowing thousands of automatic checks and quickly spotting any errors.
              To detect malware on device, voters can use multiple devices to make sure their vote was submitted correctly, much like scanning a QR code. This quick check can be done at the time of voting and it helps identify any errors immediately. 
              Anti-Malware Codes allow voters to check their vote via a secondary device using unique codes provided in a mailed invitation. This system not only offers protection against catching malware on the primary device, but also tracks and validates the number of voters performing secondary device checks, improving the overall integrity of voting results.
              Zero-Knowledge Proofs provide mathematical evidence that SIV's anonymization techniques did not modify or tamper with any of the submitted votes.
              SIV RLAs can be performed after results are published. Official and independent parties can gain very high statistical confidence in election outcomes by sampling only a small number of random voters and asking them to confirm their votes.
              SIV votes can be printed onto paper to be verified manually without depending on any digital computations for accuracy.`,
              disadv: `SIV tally is fully verifiable, but people have to actually do the verification to rely on it. Fortunately, the steps are fast and can be done after the fact.`,
            },
          ],
          [
            4,
            {
              adv: `Some jurisdictions provide tracking numbers for voters to look up if their vote was received at the polling station. But this is unverifiable.`,
              disadv: `Inherits all the disadvantages of safely verifying tallying of in-person voting, plus introduces new risks:
              It is hard to know what happens with the ballot once you put your ballot into a mailbox. There are lots of opportunities for it to get tampered with or lost.
              Because mailboxes are so geographically spread out, it is very difficult to comprehensively monitor.
              Limited ability to audit after the fact.`,
            },
          ],
          [
            6,
            {
              adv: `Many jurisdictions require at least two people to supervise all votes at all times. So a single corrupt poll worker is more limited in their ability to tamper.
              My preferred candidate ideally can send election observers. But there is often so many polling locations and times to vote that is very difficult to get anything close to complete coverage.
              Electronic tallying machines themselves can be audited using powerful post-election RLA techniques.`,
              disadv: `I cast a vote but have little-to-no direct evidence whether my vote counted.
              People carrying out the process are usually strangers, with little way for the vast majority of voters to tell if they're trustworthy.
              The process is fundamentally an imperfect system that can try its best to mitigate attacks & errors, but at the end of the day can never provide "proof" of correctness, only absence of uncovered attacks. As Carl Sagan famously noted, "Absence of Evidence does not mean Evidence of Absence".`,
            },
          ],
        ],
      },
    ],
  },
  {
    name: 'Honest Vote Selections',
    rows: [
      {
        d_name: 'Vote privacy',
        desc: 'How confident can individual voters be that no one else will learn their ballot selections?',
        scores: [
          [
            8,
            {
              adv: `Using a cryptographic mixnet, the SIV system does not allow anyone, including the election administrators and the SIV infrastructure, to see how anyone else voted. 
              SIV's privacy architecture and implementation is fully inspectable by the voters, at their own pace.`,
              disadv: `High learning curve because of advanced cryptography to understand how SIV achieves privacy.
              Voter's devices themselves could be infected with spyware, with little ability to detect.`,
            },
          ],
          [
            4.5,
            {
              adv: `There is some effort for vote privacy — vote selections are sealed within an envelope.
              Because it is a spread-out paper process, it is relatively hard to compromise on a huge scale without whistleblowers, especially in jurisdictions with strong opposition parties.`,
              disadv: `You're sending your name & vote selections side-by-side through this relatively opaque process. 
              It is trivially easy to open a letter, read its contents, and reseal it. There have been centuries worth of examples of governments doing this on an industrial scale. E.g. the French "cabinet noir".`,
            },
          ],
          [
            7,
            {
              adv: `Ballots themselves usually don't have names on them.
              Voters are provided a private cubicle to mark their ballots.
              There are little-to-no public widespread scandals of vote privacy compromised in recent elections.`,
              disadv: `Many ballots include unique tracking numbers, which can make vote selections linkable back to voter's identity.
              Voters are not in control of the space they vote in, and have limited time to inspect or test security, such as against cameras watching from overhead.`,
            },
          ],
        ],
      },
      {
        d_name: 'Coercion resistance',
        desc: 'How protected are voters against attempts to threaten or purchase their vote selections?',
        scores: [
          [9, coercionScore.siv],
          [8, coercionScore.mail],
          [9, coercionScore.inPerson],
        ],
      },
    ],
  },
  {
    name: 'Voter Experience',
    rows: [
      {
        d_name: 'Accessibility',
        desc: 'How accessible is the voting process for all members of the electorate, especially those with disabilities?',
        scores: [
          [
            8.5,
            {
              adv: `No need to visit polling stations or drop boxes.
              By utilizing their own devices in the comfort of their homes, voters with disabilities can benefit from customized accessibility features such as larger font sizes, text-to-speech, high contrast mode, and various other well-developed options.
              Allows voters to research and fill out their ballot at their own pace, without feeling rushed.`,
              disadv: `Although many people prefer digital options, many other people are not as comfortable and may become frustrated by digital interfaces.`,
            },
          ],
          [
            6.5,
            {
              adv: `Beneficial for elderly, remote/rural, or voters with disabilities who find it hard to reach polling stations.
              Allows voters to research and fill in their ballot at their own pace, without feeling rushed.`,
              disadv: `Some people might not receive their mail-in ballot due to issues with their registration status, incorrect mailing address, or other administrative errors. This could unintentionally disenfranchise certain voters. This is riskier for vote-by-mail because the process takes a while to get the ballot both out to and back from the voter.
              Can still be challenging for voters with vision impairments.
              Filling the ballot and drawing a signature can be a challenge if they have difficulty using pens.
              Requires getting to a mail drop-off location.`,
            },
          ],
          [
            5,
            {
              adv: `Many jurisdictions try to provide many nearby polling stations, but this is far from universal.
              In-person assistance is usually available for those who need it.`,
              disadv: `May be difficult for individuals with mobility issues or remote/rural voters to reach polling stations.
            Limited voting hours may restrict some people from being able to vote, especially those with many other responsibilities and obligations.
            Standing in long lines can make it even harder for people to vote.`,
            },
          ],
        ],
      },
      {
        d_name: 'Speed of voting',
        desc: 'How quickly can individual voters participate?',
        scores: [
          [
            9,
            {
              adv: `If the person knows how they want to vote, it can be done in seconds.
                    Voters don't need to travel, wait in line at polling stations, or find mail drop boxes.
                    Correcting mistakes is quicker and less messy than with a pen.`,
              disadv: `Before voting, voters must receive their unique Voter Invitations. For public elections, we recommend traditional postal mail, to exceed current Voter Authentication requirements. While this does not directly affect the voting process, potential postal delays could lead to waiting times.`,
            },
          ],
          [
            7,
            {
              adv: `Voter does not need to travel or wait in line at polling stations.`,
              disadv: `Dependent on the postal service speed and reliability.
                       Voter needs to find and travel to ballot drop-off location.
                       Requires voters to plan ahead to ensure their ballot is accepted in time. Different jurisdictions have different postmarked vs delivery deadlines.`,
            },
          ],
          [
            3,
            {
              adv: `Finalizes your vote without the need or option for follow-up confirmation.`,
              disadv: `In-person voting can be time-consuming, requiring travel to the polling station, finding parking, passing through security measures like metal detectors, waiting in line, and checking in before casting a vote, followed by the return journey home.
                       The efficiency and wait time at polling stations can be unpredictable, influenced by both the staffing and organization of the station as well as the number of other voters present.`,
            },
          ],
        ],
      },
      {
        d_name: 'Speed of tallying',
        desc: 'How quickly can results be announced?',
        scores: [
          [
            9,
            {
              adv: `Votes are already digital, so they do not need to be manually fed into counting machines one-by-one.
              Thousands of votes can be anonymized, unlocked, and tallied in seconds. Results can be published near instantly.`,
              disadv: `Signature verification requirements can slow down ballot processing.
                       Subject to delays if Privacy Protectors are tardy to anonymize and unlock encrypted ballots.`,
            },
          ],
          [
            3,
            {
              adv: `Where allowed, pre-tallying mail-in ballots can start before Election Day, speeding up the announcement of results.`,
              disadv: `Signature verification requirements can slow down ballot processing.
              Final election results can be delayed because all mail-in ballots need to be received at Election Centers, sometimes extending well beyond Election Day depending on postmark dates.
              Mail-in ballots often require physical handling to flatten or uncrease them for machine counting, and may be rejected by voting machines if too bent, similar to bent dollars in a vending machine.
              To provide a historical perspective, some elections in 2020 took as long as three weeks to count all mail-in votes, highlighting the potential for substantial delays.`,
            },
          ],
          [
            5,
            {
              adv: `Long history and well-vetted data on expected times. Most election results are usually announced late in the evening of election day, or early next day.`,
              disadv: `Votes need to be processed one-by-one, e.g. fed through vote-counting machines.
              There may be longer wait times for final results if manual recounting is necessary.`,
            },
          ],
        ],
      },
    ],
  },
  {
    name: 'Costs',
    rows: [
      {
        d_name: 'Affordability to administer',
        desc: 'How affordable are the total costs to administer a secure election?',
        scores: [
          [
            8,
            {
              adv: `The average government elections budget is around $20 per voter, regardless of participation. SIV can reduce this cost to approximately $3 per voter.
              There is no charge for voters who choose not to use SIV.
              Governments can pilot SIV for free.
              SIV significantly decreases the workload for election administrators. Comparisons of SIV and in-person paper voting in pilots showed that in-person voting required ten times more personnel for voter check-ins and result tallying.
              If the costs to ask everyone to weigh in on public questions was significantly lower, it can be done much more often, enhancing civic engagement and better reflecting public opinion.`,
              disadv: `There are initial upfront costs for learning new systems and processes.
              In the early years of implementing SIV, most jurisdictions will likely maintain existing levels of vote-by-mail and in-person voting infrastructure, delaying the realization of cost savings for several transition years.`,
            },
          ],
          [
            5,
            {
              adv: `Can be less expensive than In-Person as it requires fewer polling stations, and less staff on election day.
                    Although SIV can take the taxpayer costs of elections down significantly, the current costs are not a very widespread concern.`,
              disadv: `The costs of printing, distributing, and returning ballots can add up when there are a lot of voters. Many of these costs are paid even if voter opts for a different method.
                       Increased cost for verification and handling of mail-in ballots.`,
            },
          ],
          [
            4,
            {
              adv: `Many people are excited to volunteer.
                    Long history of data about the costs.
                    Although SIV can take the taxpayer costs of elections down significantly, the current costs are not a very widespread concern.`,
              disadv: `Requires significant staffing for polling stations.
                       Cost of printing and handling physical ballots.
                       US elections cost ~$4bn/year.
                       Costs can go up during natural disasters and other unforeseen events — eg. the 2020 election cost an additional $4bn ($8bn total) because of COVID-19.`,
            },
          ],
        ],
      },
    ],
  },
]
