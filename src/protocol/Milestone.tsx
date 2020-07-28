export const Milestone = (milestone: string) => (
  <h3 key={milestone}>
    {milestone}
    <style jsx>{`
      h3 {
        background: #e5eafd;
        padding: 1rem 30px;
      }
    `}</style>
  </h3>
)
