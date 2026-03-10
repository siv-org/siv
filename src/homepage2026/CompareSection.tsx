import { Fragment, useCallback, useEffect, useReducer, useState } from 'react'

type Category = { name: string; rows: Row[] }

type OpenedModalIndex = [number, number, number] | null

type Row = {
  d_name: string
  desc: string
  scores: [Score, Score, Score]
  scores_with_bounty?: [Score, Score, Score]
}

type Score = [number, { adv: string; disadv: string }]

const methods = ['SIV', 'Mail', 'In Person']

const antiCoercionArguments = {
  all: {
    pro: `Vote selling is hypothetical, not observed.
    Coercion and vote-buying attacks are challenging to scale because every manipulated vote requires a cooperating voter.`,
    withBounty: `Because it is in the best interest of both buyers & sellers to defect, the trust necessary to carry out illegal vote selling diminishes significantly.`,
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
          As with SIV, biggest deterrent is heavy criminal penalties for both buyer and seller: large fines, jail time, loss of voting-rights.`,
    withBounty: `With Vote Selling Bounty Rewards:`,
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
          ${antiCoercionArguments.paper.pro}
          ${antiCoercionArguments.all.pro}`,
    disadv: `${antiCoercionArguments.inPerson.con}
             ${antiCoercionArguments.paper.con}`,
  },
  inPerson_w_bounty: {
    adv: `${antiCoercionArguments.inPerson.pro}
          ${antiCoercionArguments.all.pro}
          ${antiCoercionArguments.paper.pro}
          ${antiCoercionArguments.paper.withBounty} ${antiCoercionArguments.all.withBounty}`,
    disadv: `${antiCoercionArguments.inPerson.con}
             ${antiCoercionArguments.paper.con}`,
  },
  mail: {
    adv: `${antiCoercionArguments.paper.pro}
          ${antiCoercionArguments.all.pro}`,
    disadv: `${antiCoercionArguments.mail.con}
             ${antiCoercionArguments.paper.con}`,
  },
  mail_w_bounty: {
    adv: `${antiCoercionArguments.paper.pro}
          ${antiCoercionArguments.all.pro}
          ${antiCoercionArguments.paper.withBounty} ${antiCoercionArguments.all.withBounty}`,
    disadv: `${antiCoercionArguments.mail.con}
             ${antiCoercionArguments.paper.con}`,
  },
  siv: {
    adv: `${antiCoercionArguments.siv.pro}
          ${antiCoercionArguments.all.pro}`,
    disadv: antiCoercionArguments.siv.con,
  },
  siv_w_bounty: {
    adv: `${antiCoercionArguments.siv.pro}
          ${antiCoercionArguments.all.pro}
          SIV's *Verifiable Private Overrides* enable voters to trick coercers into thinking they voted a different way than they did.
          With a bounty reward system in place, the unique and unforgeable proofs that SIV creates turn into benefits against vote selling, as strong evidence of prosecutable illegal activity if shared.
          ${antiCoercionArguments.all.withBounty}`,
    disadv: `${antiCoercionArguments.siv.con}
            Even with bounty rewards, buyers may still be able to stay anonymous, thus hard to prosecute.`,
  },
}

const tableData: Category[] = [
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
          [3, coercionScore.siv],
          [6, coercionScore.mail],
          [8, coercionScore.inPerson],
        ],
        scores_with_bounty: [
          [9, coercionScore.siv_w_bounty],
          [8, coercionScore.mail_w_bounty],
          [9, coercionScore.inPerson_w_bounty],
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

const getScore = (s: number | Score): number => (typeof s === 'number' ? s : s[0])

const interpolateColor = (score: number): string => {
  const clamped = Math.max(0, Math.min(score, 10))

  const startColor = { b: 94, g: 63, r: 244 } // softer red
  const middleColor = { b: 250, g: 250, r: 250 } // near-white
  const endColor = { b: 74, g: 163, r: 22 } // emerald-ish

  let r: number
  let g: number
  let b: number

  if (clamped <= 5) {
    const ratio = clamped / 5
    r = Math.round(startColor.r * (1 - ratio) + middleColor.r * ratio)
    g = Math.round(startColor.g * (1 - ratio) + middleColor.g * ratio)
    b = Math.round(startColor.b * (1 - ratio) + middleColor.b * ratio)
  } else {
    const ratio = (clamped - 5) / 5
    r = Math.round(middleColor.r * (1 - ratio) + endColor.r * ratio)
    g = Math.round(middleColor.g * (1 - ratio) + endColor.g * ratio)
    b = Math.round(middleColor.b * (1 - ratio) + endColor.b * ratio)
  }

  return `rgb(${r}, ${g}, ${b})`
}

type SwitchProps = {
  checked: boolean
  label: string
  onClick: () => void
}

export function CompareSection() {
  const [bountyEnabled, toggleBounty] = useReducer((t: boolean) => !t, true)
  const [isDescriptionShown, toggleDescription] = useReducer((t: boolean) => !t, true)
  const [isCollapsed, toggleCollapsed] = useReducer((t: boolean) => !t, true)
  const [openedModalIndex, setOpenedModalIndex] = useState<OpenedModalIndex>(null)

  function getModalContent(index: OpenedModalIndex) {
    if (!index) return null
    const [catIndex, rowIndex, colIndex] = index

    const cat = tableData[catIndex]
    const row = cat.rows[rowIndex]
    const scores = bountyEnabled ? row.scores_with_bounty || row.scores : row.scores
    const score = scores[colIndex]

    return {
      advantages: score[1]?.adv || '',
      d_name: row.d_name,
      disadvantages: score[1]?.disadv || '',
      title: `${methods[colIndex]} – ${row.d_name}: ${getScore(score)} / 10`,
    }
  }

  const modalContent = getModalContent(openedModalIndex)

  const closeModal = () => setOpenedModalIndex(null)

  const goRight = useCallback(() => {
    setOpenedModalIndex((current) => {
      if (!current) return current
      const [catIndex, rowIndex, colIndex] = current
      if (colIndex + 1 >= methods.length) return current
      return [catIndex, rowIndex, colIndex + 1]
    })
  }, [])

  const goLeft = useCallback(() => {
    setOpenedModalIndex((current) => {
      if (!current) return current
      const [catIndex, rowIndex, colIndex] = current
      if (colIndex === 0) return current
      return [catIndex, rowIndex, colIndex - 1]
    })
  }, [])

  const goDown = useCallback(() => {
    setOpenedModalIndex((current) => {
      if (!current) return current
      const [catIndex, rowIndex, colIndex] = current
      const nextRowIndex = rowIndex + 1

      if (nextRowIndex < tableData[catIndex].rows.length) return [catIndex, nextRowIndex, colIndex]
      if (catIndex + 1 < tableData.length) return [catIndex + 1, 0, colIndex]

      return current
    })
  }, [])

  const goUp = useCallback(() => {
    setOpenedModalIndex((current) => {
      if (!current) return current
      const [catIndex, rowIndex, colIndex] = current
      const previousRowIndex = rowIndex - 1

      if (previousRowIndex >= 0) return [catIndex, previousRowIndex, colIndex]
      if (catIndex - 1 >= 0) {
        const prevCatLastRowIndex = tableData[catIndex - 1].rows.length - 1
        return [catIndex - 1, prevCatLastRowIndex, colIndex]
      }

      return current
    })
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!openedModalIndex) return

      if (event.key.startsWith('Arrow')) event.preventDefault()

      if (event.key === 'ArrowRight') goRight()
      if (event.key === 'ArrowLeft') goLeft()
      if (event.key === 'ArrowDown') goDown()
      if (event.key === 'ArrowUp') goUp()
    },
    [openedModalIndex, goDown, goLeft, goRight, goUp],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <section aria-labelledby="compare-heading" className="px-7 py-16 md:py-24" id="compare">
      <div className="mx-auto max-w-[1060px]">
        <div className="rounded-[28px] border border-white/70 bg-white/60 px-6 py-9 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-md md:px-10 md:py-12">
          <div>
            <p className="font-mono2026 mb-3 text-[0.7rem] uppercase tracking-[0.18em] text-h2026-muted">Compare</p>
            <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
              <h2
                className="font-serif2026 text-[clamp(1.35rem,3vw,2rem)] font-normal leading-[1.2] tracking-tight text-h2026-text"
                id="compare-heading"
              >
                How SIV compares to mail and in-person voting
              </h2>
              <p className="mt-1 max-w-[540px] text-[0.86rem] leading-[1.7] text-h2026-textSecondary md:mt-0 md:text-right">
                Explore how SIV stacks up on accuracy, privacy, coercion-resistance, voter experience, and costs. Click
                any score to see the reasoning behind it.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              aria-expanded={!isCollapsed}
              className="flex w-full items-center justify-between rounded-2xl border border-h2026-border bg-white/70 px-4 py-3 text-[0.82rem] font-medium text-h2026-text shadow-sm transition-colors hover:border-h2026-green/70"
              onClick={toggleCollapsed}
              type="button"
            >
              <span>{isCollapsed ? 'Show detailed comparison table' : 'Hide detailed comparison table'}</span>
              <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-h2026-bg text-[0.9rem] text-h2026-muted">
                <span
                  className={`inline-block transition-transform ${
                    isCollapsed ? 'translate-y-[1px] rotate-0' : 'translate-y-[1px] rotate-90'
                  }`}
                >
                  ›
                </span>
              </span>
            </button>

            {!isCollapsed && (
              <div className="mt-5">
                <div className="flex flex-col items-start gap-2 text-[0.8rem] text-h2026-textSecondary">
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-h2026-border bg-white/70 px-3 py-1 text-[0.78rem] font-medium shadow-sm transition-colors hover:border-h2026-green/70"
                    onClick={toggleDescription}
                    type="button"
                  >
                    <span
                      className={`inline-block h-3 w-3 rounded-full border ${
                        isDescriptionShown ? 'border-h2026-green bg-h2026-green/80' : 'bg-white border-h2026-border'
                      }`}
                    />
                    Show descriptions
                  </button>
                  <p className="max-w-[520px] text-[0.75rem] text-h2026-muted">
                    Show descriptions. Click a cell for a detailed explanation. Use arrow keys to move around.
                  </p>
                </div>

                <div className="overflow-x-auto mt-6">
                  <table className="w-full border-collapse text-[0.8rem]">
                    <thead className="sticky top-0 z-10 hidden bg-white/80 text-left text-[0.75rem] text-h2026-muted backdrop-blur md:table-header-group">
                      <tr>
                        <th className="min-w-[160px] py-2 pr-4 font-normal" />
                        {methods.map((method) => (
                          <th className="w-[14%] py-2 text-center font-normal" key={method}>
                            {method}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((cat, cIndex) => (
                        <Fragment key={cat.name}>
                          <tr>
                            <td className={cIndex === 0 ? 'pt-4' : 'pt-10'} colSpan={4}>
                              <div className="inline-flex rounded-full bg-h2026-green/[0.08] px-3 py-1 text-[0.78rem] font-medium text-h2026-green">
                                {cat.name}
                              </div>
                            </td>
                          </tr>
                          {cat.rows.map((row, rIndex) => (
                            <tr
                              className={`border-b border-h2026-border/50 md:hover:bg-h2026-bg/40 ${
                                isDescriptionShown ? 'align-top' : 'align-middle'
                              }`}
                              key={row.d_name}
                            >
                              <td className="py-4 pr-6">
                                <div className="text-[0.9rem] font-medium text-h2026-text">
                                  {row.d_name}
                                  {row.d_name === 'Coercion resistance' && (
                                    <span className="inline-block ml-2 align-middle">
                                      <BountyRewardsSwitch bountyEnabled={bountyEnabled} toggleBounty={toggleBounty} />
                                    </span>
                                  )}
                                </div>
                                {isDescriptionShown && (
                                  <p className="mt-2 max-w-[360px] text-[0.78rem] leading-[1.6] text-h2026-textSecondary">
                                    {row.desc}
                                  </p>
                                )}
                              </td>
                              {[...(bountyEnabled && row.scores_with_bounty ? row.scores_with_bounty : row.scores)].map(
                                (score, colIndex) => (
                                  <td className="w-[22%] py-3 text-center md:w-auto" key={`${row.d_name}-${colIndex}`}>
                                    <div className="mb-2 rounded-full bg-white/70 px-2 py-1 text-[0.7rem] font-medium text-h2026-muted md:hidden">
                                      {methods[colIndex]}
                                    </div>
                                    <button
                                      className={`flex w-full items-center justify-center rounded-[10px] border border-white/60 px-2 text-[0.9rem] font-semibold text-slate-900 shadow-[0_1px_4px_rgba(15,23,42,0.16)] transition-all hover:shadow-[0_6px_18px_rgba(15,23,42,0.22)] ${
                                        openedModalIndex &&
                                        arraysEqual(openedModalIndex, [cIndex, rIndex, colIndex]) &&
                                        'ring-2 ring-h2026-green/80'
                                      } ${isDescriptionShown ? 'h-12' : 'h-9'}`}
                                      onClick={() => setOpenedModalIndex([cIndex, rIndex, colIndex])}
                                      style={{
                                        backgroundColor: interpolateColor(getScore(score)),
                                      }}
                                      type="button"
                                    >
                                      {getScore(score)}
                                    </button>
                                  </td>
                                ),
                              )}
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!!modalContent && (
        <div
          className="flex fixed inset-0 z-40 justify-center items-center px-4 py-8 bg-slate-900/60"
          onClick={closeModal}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-[640px] overflow-y-auto rounded-2xl border border-white/10 bg-h2026-bg px-6 py-6 text-left shadow-[0_24px_80px_rgba(15,23,42,0.65)] md:px-8 md:py-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close comparison details"
              className="absolute top-4 right-4 p-1 rounded-full transition-colors text-h2026-muted hover:bg-white/5 hover:text-h2026-text"
              onClick={closeModal}
              type="button"
            >
              <span className="block w-4 h-4">
                <span className="absolute h-[1px] w-4 rotate-45 bg-current" />
                <span className="absolute h-[1px] w-4 -rotate-45 bg-current" />
              </span>
            </button>

            <div className="flex gap-3 justify-between items-center pr-7">
              <div className="space-y-1">
                <p className="font-mono2026 text-[0.7rem] uppercase tracking-[0.18em] text-h2026-muted">Explanation</p>
                <h3 className="font-serif2026 text-[1.1rem] font-normal leading-[1.4] tracking-tight text-h2026-text">
                  {modalContent.title}
                  {modalContent.d_name === 'Coercion resistance' && (
                    <span className="inline-block ml-3 align-middle">
                      <BountyRewardsSwitch bountyEnabled={bountyEnabled} toggleBounty={toggleBounty} />
                    </span>
                  )}
                </h3>
              </div>
            </div>

            <div className="mt-5 text-[0.85rem] leading-[1.7] text-h2026-textSecondary">
              <div className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Advantages
              </div>
              {modalContent.advantages
                .split('\n')
                .map((c) => c.trim())
                .filter((c) => c)
                .map((advantage, index) => (
                  <div className="flex gap-2 mb-2" key={`adv-${index.toString()}`}>
                    <span className="mt-[1px] text-[1.1rem] font-bold text-emerald-600">+</span>
                    <span>{advantage}</span>
                  </div>
                ))}

              <div className="mt-5 mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-rose-700">
                Disadvantages
              </div>
              {modalContent.disadvantages
                .split('\n')
                .map((c) => c.trim())
                .filter((c) => c)
                .map((disadvantage, index) => (
                  <div className="flex gap-2 mb-2" key={`disadv-${index.toString()}`}>
                    <span className="mt-[1px] text-[1.1rem] font-bold text-rose-600">–</span>
                    <span>{disadvantage}</span>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 text-[0.78rem] text-h2026-muted">
              <div className="flex gap-3">
                <button
                  className="rounded-full border border-h2026-border bg-white/5 px-3 py-1.5 text-[0.76rem] font-medium text-h2026-textSecondary shadow-sm transition-colors hover:border-h2026-green/70 hover:text-h2026-text"
                  onClick={goLeft}
                  type="button"
                >
                  ← Previous
                </button>
                <button
                  className="rounded-full border border-h2026-border bg-white/5 px-3 py-1.5 text-[0.76rem] font-medium text-h2026-textSecondary shadow-sm transition-colors hover:border-h2026-green/70 hover:text-h2026-text"
                  onClick={goRight}
                  type="button"
                >
                  Next →
                </button>
              </div>
              <span>Use arrow keys to move across cells</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function BountyRewardsSwitch({ bountyEnabled, toggleBounty }: { bountyEnabled: boolean; toggleBounty: () => void }) {
  return (
    <div className="mt-1.5 text-[0.78rem] font-normal text-h2026-textSecondary">
      <ToggleSwitch checked={bountyEnabled} label="Show bounty & overrides" onClick={toggleBounty} />
    </div>
  )
}

function ToggleSwitch({ checked, label, onClick }: SwitchProps) {
  return (
    <button
      aria-pressed={checked}
      className="inline-flex items-center gap-2 rounded-full border border-h2026-border bg-white/70 px-3 py-1 text-[0.78rem] font-medium text-h2026-textSecondary shadow-[0_1px_3px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all hover:border-h2026-green/70 hover:text-h2026-text"
      onClick={onClick}
      type="button"
    >
      <span className="inline-flex relative items-center w-7 h-4 rounded-full bg-h2026-border/70">
        <span
          className={`inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-3.5' : 'translate-x-0.5'
          }`}
        />
      </span>
      <span>{label}</span>
    </button>
  )
}
