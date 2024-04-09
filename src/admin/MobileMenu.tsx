import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { startCase } from 'lodash-es'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { OnClickButton } from '../_shared/Button'
import { SidebarContent, steps } from './Sidebar'

export const MobileMenu = () => {
  const { section } = useRouter().query
  const [menu_open, set_menu] = useState(false)

  const name = startCase(section as string)

  const iOS = process?.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)

  return (
    /* Hidden for all but small screens */
    <div className="sm:hidden">
      {/* Activation button */}
      {section && (
        <OnClickButton style={{ marginLeft: 0, padding: '5px 11px' }} onClick={() => set_menu(true)}>
          {section && steps.includes(name) ? `Step ${steps.indexOf(name) + 1}: ${name}` : 'Menu'}
        </OnClickButton>
      )}

      {/* Sliding in Sidebar */}
      <SwipeableDrawer
        anchor="left"
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={menu_open}
        onClose={() => set_menu(false)}
        onOpen={() => set_menu(true)}
      >
        <SidebarContent closeMenu={() => set_menu(false)} />
      </SwipeableDrawer>
    </div>
  )
}
