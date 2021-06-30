import router, { useRouter } from 'next/router'

import { promptLogout, useUser } from './auth'

export const MobileTopbar = () => {
  const { election_id, section } = useRouter().query
  const { user } = useUser()

  const urled = (s: string) => s.toLowerCase().replaceAll(' ', '-')

  const election_menu = [
    {
      header: 'Election Management',
      options: [['Trustees'], ['Ballot Design'], ['Voters']],
      same_tab: true,
      urls: (name: string) => `./${urled(name)}`,
    },
    {
      header: 'Public Pages',
      options: [
        ['Cast Vote', `/election/${election_id}/vote`],
        ['Election Status', `/election/${election_id}`],
      ],
    },
  ]

  const always_shown = [
    {
      header: 'Support',
      options: [
        ['Protocol Overview', '/protocol'],
        ['Get Help', 'mailto:help@secureinternetvoting.org'],
      ],
    },
    { header: 'Logged in as:', options: [[user.name, 'LOGOUT']] },
  ]

  const menu: typeof election_menu = election_id ? [...election_menu, ...always_shown] : always_shown

  return (
    <div className="mobile-topbar">
      <select
        value={section}
        onChange={(event) => {
          const el = event.target
          const selected = el.options[el.selectedIndex]
          const url = selected.getAttribute('data-url')
          const sametab = selected.getAttribute('data-sametab')

          // Special handling for logout
          if (url === 'LOGOUT') return promptLogout()

          if (!url) return
          sametab ? router.push(url) : window.open(url, '_blank')
        }}
      >
        {menu.map(({ header, options, same_tab, urls }) => (
          <optgroup key={header} label={header}>
            {options.map(([name, url]) => (
              <option data-sametab={same_tab} data-url={urls ? urls(name) : url} key={name} value={urled(name)}>
                {name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <style jsx>{`
        select,
        optgroup {
          font-size: 20px;
        }

        /* Hide for all but small screens */
        @media (min-width: 500px) {
          .mobile-topbar {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
