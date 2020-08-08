const endorsements = [
  {
    author: `Sunny Gonnabathula`,
    quote: `As long as I’ve known Dave, improving our democratic processes has been a core imperative of his. SIV is perhaps his greatest contribution yet and could not come at a better time - it’s easy to use, easy to deploy at scale, and addresses the greatest risks in our health crisis and upcoming election. And to top it off, it’s both more private for the voter and more transparent for the election commission than any ballot used today.`,
    title: 'Software Engineer, Near Space Labs',
  },
  {
    author: 'Ben Creasy',
    quote: `Secure Internet Voting is the future. This protocol does it right.`,
    title: 'Software engineer, former civil servant of Alaska State Government',
  },
]

export const Endorsements = () => (
  <>
    <h3>What people are saying</h3>
    {endorsements.map((e, index) => (
      <>
        <blockquote key={index}>{e.quote}</blockquote>
        <p>
          — {e.author}, {e.title}
        </p>
      </>
    ))}
    <style jsx>{`
      p {
        white-space: pre-wrap;
      }
    `}</style>
  </>
)
