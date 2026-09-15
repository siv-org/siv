import * as Sentry from '@sentry/browser'
import { useEffect } from 'react'

/** Hook to enable Sentry on the client */
export function useSentry() {
  useEffect(() => {
    if (/^localhost$|^127\.0\.0\.1$|^192\.168\./.test(window.location.hostname)) return

    Sentry.init({
      dsn: 'https://ec794d9df6c0425586d9f069775a8ad7@o510908.ingest.sentry.io/5607249',
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 1.0,
    })
  }, [])
}