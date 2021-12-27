import { darkBlue } from './colors'

export const OnePersonOneVote = () => (
  <section>
    <h2>
      One Person,
      <br />
      One Vote
    </h2>
    <ul>
      <li>
        <img className="auth1" src="/home3/auth-1.png" />
        Voters can be authenticated by email, SMS, postal mail, drawn signatures, ID photos— in any preferred
        combination.
      </li>
      <li>
        <img className="auth2" src="/home3/auth-2.png" />
        Voter Authentication Tokens can be re-issued or revoked as necessary.
      </li>
      <li>
        <img className="auth3" src="/home3/auth-3.png" />
        The entire process creates a full audit trail for independent verification.
      </li>
    </ul>
    <style jsx>{`
      section {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
      }

      h2 {
        font-size: 32px;
        width: 40%;
        color: ${darkBlue};
        font-weight: 800;
      }

      ul {
        width: 50%;
      }

      li {
        font-size: 20px;
        margin: 3rem 0;
        font-weight: 500;
        position: relative;
        list-style: none;
      }

      img {
        position: absolute;
      }

      img.auth1 {
        width: 50px;
        left: -70px;
      }

      img.auth2 {
        width: 80px;
        left: -85px;
        transform: scaleX(-1);
      }

      img.auth3 {
        width: 90px;
        left: -90px;
      }
    `}</style>
  </section>
)
