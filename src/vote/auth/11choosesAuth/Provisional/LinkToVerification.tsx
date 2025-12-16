import { LinkOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

export const LinkToVerification = () => {
  const { election_id } = useRouter().query as { election_id: string }

  return (
    <a
      className="block mt-5 text-lg font-semibold text-blue-700 hover:underline"
      href={`/election/${election_id}/vote?auth=link&show=verification`}
    >
      <LinkOutlined /> Link to see your Vote Verification info
    </a>
  )
}
