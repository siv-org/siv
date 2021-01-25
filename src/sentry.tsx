import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { useEffect } from 'react'

/** Hook to enable Sentry on the client */
export function useSentry() {
  useEffect(() => {
    Sentry.init({
      dsn: 'https://ec794d9df6c0425586d9f069775a8ad7@o510908.ingest.sentry.io/5607249',
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    })
  }, [])
}
