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
        <OnClickButton onClick={() => set_menu(true)} style={{ marginLeft: 0, padding: '5px 11px' }}>
          {section && steps.includes(name) ? `Step ${steps.indexOf(name) + 1}: ${name}` : 'Menu'}
        </OnClickButton>
      )}

      {/* Sliding in Sidebar */}
      <SwipeableDrawer
        anchor="left"
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        onClose={() => set_menu(false)}
        onOpen={() => set_menu(true)}
        open={menu_open}
      >
        <SidebarContent closeMenu={() => set_menu(false)} />
      </SwipeableDrawer>
    </div>
  )
}
