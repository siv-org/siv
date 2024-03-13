import { NoSsr } from '@mui/material'

const GA_ID = 'UA-84279342-7'

export const GAnalytics = () => (
  <NoSsr>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
    <script
      dangerouslySetInnerHTML={{
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
      }}
    />
  </NoSsr>
)
