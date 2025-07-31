export { VotePage as default } from '../../../src/vote/VotePage'

export const getServerSideProps = (context: { query: { election_id: string } }) => ({ props: { query: context.query } })
