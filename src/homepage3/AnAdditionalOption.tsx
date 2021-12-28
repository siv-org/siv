import { Link } from 'react-scroll'

import { darkBlue } from './colors'

export const AnAdditionalOption = () => (
  <section>
    <h2>An Additional Voting Option</h2>
    <p>SIV works alongside paper methods, so voters can use their preference.</p>
    <ul>
      <li>
        <img src="/home3/methods-1.png" />
        In Person
      </li>
      <li>
        <img src="/home3/methods-2.png" />
        By Mail
      </li>
      <li>
        <img src="/home3/methods-3.png" />
        Online
      </li>
    </ul>
    <p>
      <Link id="help-bring-btn" offset={-25} smooth={true} to="let-your-govt-know">
        Help bring Secure Internet Voting to your area
      </Link>
    </p>
    <style jsx>{`
      section {
        text-align: center;
      }

      h2 {
        color: ${darkBlue};
        font-size: 32px;
        font-weight: 800;
      }

      p {
        font-size: 19px;
      }

      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      li {
        list-style: none;
        position: relative;
        margin-top: 120px;
        font-size: 16px;
      }

      img {
        width: 80px;
        position: absolute;
        top: -4rem;
      }

      li:nth-child(1) img {
        left: -5px;
      }

      li:nth-child(2) img {
        left: -13px;
      }

      li:nth-child(3) img {
        left: -13px;
        top: -4.5rem;
      }
    `}</style>
    <style global jsx>{`
      #help-bring-btn {
        cursor: pointer;

        border: 2px solid ${darkBlue};
        background-color: ${darkBlue};
        color: white;
        padding: 4px 40px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 14px;

        display: inline-block;
        margin: 3rem 0;
      }

      #help-bring-btn:hover {
        background-color: white;
        text-decoration: none;
        color: ${darkBlue};
      }
    `}</style>
  </section>
)
