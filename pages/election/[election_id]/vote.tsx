import { GetServerSideProps } from 'next'

export { VotePage as default } from '../../../src/vote/VotePage'

export const getServerSideProps: GetServerSideProps = async (context) => ({ props: { query: context.query } })
