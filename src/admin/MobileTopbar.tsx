import Drawer from '@material-ui/core/Drawer'
import { startCase } from 'lodash-es'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { OnClickButton } from '../landing-page/Button'
import { SidebarContent, steps } from './Sidebar'

export const MobileTopbar = () => {
  const { section } = useRouter().query
  const [menu_open, set_menu] = useState(false)

  const name = startCase(section as string)

  return (
    <div className="mobile-menu">
      <OnClickButton style={{ marginLeft: 0, padding: '5px 11px' }} onClick={() => set_menu(true)}>
        {section ? `Step ${steps.indexOf(name as typeof steps[number]) + 1}: ${name}` : 'Menu'}
      </OnClickButton>
      <Drawer anchor={'left'} open={menu_open} onClose={() => set_menu(false)}>
        <SidebarContent />
      </Drawer>
      <style jsx>{`
        /* Hide for all but small screens */
        @media (min-width: 500px) {
          .mobile-menu {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
