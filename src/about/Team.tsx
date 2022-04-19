export const Team = () => (
  <>
    <div className="columns">
      <div className="left">
        <img src="about/david.jpg" style={{ height: 'auto', width: '80%' }} />
      </div>
      <div>
        <h4>SIV is led by David Ernst</h4>
        <p>
          David believes people should be able to vote as easily and securely as possible. This drives him to help
          governments give citizens the opportunity to safely vote online.
        </p>
        <p>
          Originally from Dallas, Texas, David left high school early to pursue a degree in Mathematics and Philosophy
          at Bard College at Simon’s Rock.
        </p>
        <p>
          Over the years he’s built software for education, personal health, finance, commercial construction, and more,
          used by hundreds of thousands of people worldwide.
        </p>
        <p>He’s passionate about political reform, and even ran for office in California in the 2018 election.</p>
      </div>
    </div>

    <style jsx>{`
      .columns {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8rem;
      }
      .columns > * {
        width: 49%;
      }
      .left {
        margin-top: 22px;
      }

      @media (max-width: 600px) {
        .columns {
          flex-direction: column;
        }

        .columns > * {
          width: 100%;
        }
      }
    `}</style>
  </>
)
