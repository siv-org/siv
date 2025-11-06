export const Milestone = (milestone: string) => (
  <h3 key={milestone}>
    {milestone}
    <style jsx>{`
      h3 {
        background: #0a1c47;
        padding: 1rem 30px;

        color: #fffe;
      }
    `}</style>
  </h3>
)
