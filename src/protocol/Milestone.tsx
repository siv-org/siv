export const Milestone = (milestone: string) => (
  <h3 key={milestone}>
    {milestone}
    <style jsx>{`
      h3 {
        padding-left: 1rem;
      }
    `}</style>
  </h3>
)
