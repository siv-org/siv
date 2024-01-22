import { useLayoutEffect } from 'react'

/** Whenever our election_title changes or the window is resized, our headerbar may break onto multiple lines. 
If so, we need to adjust the #main-content top margin to accommodate. */
export const useDynamicHeaderbarHeight = (election_title?: string) => {
  const headerId = 'admin-headerbar'

  useLayoutEffect(() => {
    function syncMainContentOffsetToHeaderbar() {
      const $admin_headerbar = document.getElementById(headerId)
      if (!$admin_headerbar) return

      const $main_content = document.getElementById('main-content')
      if (!$main_content) return
      $main_content.style.top = $admin_headerbar.clientHeight + 'px'
    }

    syncMainContentOffsetToHeaderbar()

    // Add event listener for window resize
    window.addEventListener('resize', syncMainContentOffsetToHeaderbar)

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', syncMainContentOffsetToHeaderbar)
  }, [election_title])

  return headerId
}
