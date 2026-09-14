import { BugBountyPage } from '../src/bug-bounty/BugBountyPage'

export { getStaticProps } from '../src/bug-bounty/lastUpdated'

export default function BugBounty(props: { lastUpdated: string }) {
  return <BugBountyPage {...props} />
}
