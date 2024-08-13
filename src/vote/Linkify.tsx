import ReactLinkify from 'react-linkify'

export const Linkify = ({ children }: { children: React.ReactNode }) => (
  <ReactLinkify
    componentDecorator={(decoratedHref, decoratedText, key) =>
      onBlockList(decoratedHref) ? (
        decoratedText
      ) : (
        <a href={decoratedHref} key={key} rel="noreferrer" target="_blank">
          {decoratedText}
        </a>
      )
    }
    {...{ children }}
  />
)

/** URLs that _shouldn't_ be Linkified */
function onBlockList(url: string) {
  return url.endsWith('.md')
}
