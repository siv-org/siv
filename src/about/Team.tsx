import Image from 'next/image'

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
    <div className="team">
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
      }

      .team {
        display: flex;
      }

      .photo {
        padding-top: 1vw;
        background: #ffd8a1;
        margin-bottom: 1rem;
      }

      .person {
        text-align: center;
        margin-right: 6vw;
      }

      .name {
        font-weight: 700;
      }
    `}</style>
  </>
)
