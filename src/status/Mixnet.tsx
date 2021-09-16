export const Mixnet = () => {
  const observers = ['SIV Server', 'David Ernst', 'Ariana Ivan']
  return (
    <section>
      <h3>Anonymization Mixnet</h3>
      <div>
        <span className="votes">Originally Submitted Votes</span>
        {observers.map((o) => (
          <>
            <img src="/vote/shuffle.png" />
            <span className="votes">Votes shuffled by {o}</span>
          </>
        ))}
      </div>
      <style jsx>{`
        section {
          margin-bottom: 3rem;
        }

        div {
          display: flex;
          align-items: center;
        }

        .votes {
          border: 1px solid #666;
          border-radius: 3px;
          width: 80px;
          padding: 5px;
          display: inline-block;
        }

        img {
          width: 40px;
          margin: 0 15px;
        }
      `}</style>
    </section>
  )
}
