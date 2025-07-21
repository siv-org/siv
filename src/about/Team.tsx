import Image from 'next/legacy/image'

import ariana from './team/ariana.png'
import david from './team/david.png'
import gino from './team/gino.png'
import greg from './team/greg.png'

const people = [
  {
    name: 'David Ernst',
    photo: david,
    title: 'CEO',
  },
  {
    name: 'Greg Little, PhD',
    photo: greg,
    title: 'Director of Research',
  },
  {
    name: 'Ariana Ivan',
    photo: ariana,
    title: 'COO',
  },
  {
    name: 'Gino Parisi',
    photo: gino,
    title: 'Head of Outreach',
  },
]

export const Team = () => (
  <>
    <h2>Team</h2>
    <div className="people">
      {people.map(({ name, photo, title }) => (
        <div className="person" key={name}>
          <div className="photo">
            <Image src={photo} />
          </div>
          <div className="name">{name}</div>
          <div>{title}</div>
        </div>
      ))}
    </div>

    <style jsx>{`
      h2 {
        font-size: 3vw;
        font-weight: 500;
        letter-spacing: 0.7vw;
        margin-bottom: 4vw;
      }

      .people {
        display: flex;
        margin-bottom: 10vw;
      }

      .person {
        text-align: center;
        margin-right: 6vw;

        font-size: min(1.4vw, 15.7px);
      }

      /* 2-column for small screens */
      @media (max-width: 700px) {
        h2 {
          font-size: 4.5vw;
        }

        .people {
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .person {
          max-width: 40%;
          margin-right: 0;
          font-size: 2.5vw;
          margin-bottom: 1.5rem;
        }
      }

      .photo {
        padding-top: 1.5vw;
        background: #ffd8a1;
        margin-bottom: 1rem;
        display: flex;
        align-items: flex-end;
      }

      .name {
        font-weight: 700;
      }
    `}</style>
  </>
)
