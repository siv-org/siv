import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const election_id = searchParams.get('election_id')

    if (!election_id) {
      return new Response('Missing election_id parameter', { status: 400 })
    }

    // Fetch election data from our existing API endpoint
    const baseUrl = request.headers.get('host')?.includes('localhost')
      ? 'http://localhost:3000'
      : `https://${request.headers.get('host')}`

    const electionResponse = await fetch(`${baseUrl}/api/election/${election_id}/info`)

    if (!electionResponse.ok) {
      return new Response('Election not found', { status: 404 })
    }

    const electionData = await electionResponse.json()
    const election_title = truncateText(electionData?.election_title || 'Untitled Election', 40)
    const ballot_design = electionData?.ballot_design

    // Get the first question and its options
    const firstQuestion = ballot_design?.[0]
    const questionTitle = truncateText(firstQuestion?.title || 'Vote Now', 50)
    const options = firstQuestion?.options || []

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            display: 'flex',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            height: '100%',
            padding: '60px',
            width: '100%',
          }}
        >
          {/* Left column - Election Info */}
          <div
            style={{
              display: 'flex',
              flex: '1',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingRight: '40px',
              position: 'relative',
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
                borderRadius: '24px',
                bottom: '-30px',
                filter: 'blur(60px)',
                left: '-40px',
                position: 'absolute',
                right: '0px',
                top: '-30px',
              }}
            />
            <div
              style={{
                alignItems: 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  color: '#3b82f6',
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: 0,
                  padding: 0,
                }}
              >
                SECURE INTERNET VOTING
              </div>
              <h1
                style={{
                  color: '#1a1a1a',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  lineHeight: '1.1',
                  margin: '8px 0',
                  padding: 0,
                }}
              >
                {election_title}
              </h1>
              <div
                style={{
                  color: '#374151',
                  fontSize: '32px',
                  fontWeight: '600',
                  margin: 0,
                  padding: 0,
                }}
              >
                {questionTitle}
              </div>
            </div>
          </div>

          {/* Right column - Options */}
          <div
            style={{
              borderLeft: '2px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flex: '1',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: '60px',
              paddingRight: '20px',
            }}
          >
            {options.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {options.slice(0, 4).map((option: { name: string }, i: number) => (
                  <div
                    key={i}
                    style={{
                      alignItems: 'center',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '8px',
                      display: 'flex',
                      fontSize: '24px',
                      padding: '12px 24px',
                    }}
                  >
                    <span
                      style={{
                        color: '#3b82f6',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginRight: '12px',
                        minWidth: '20px',
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {truncateText(option.name, 25)}
                  </div>
                ))}
                {options.length > 4 && (
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '20px',
                      justifyContent: 'center',
                      marginTop: '8px',
                      opacity: '0.7',
                    }}
                  >
                    + {options.length - 4} more options...
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  fontSize: '24px',
                  justifyContent: 'center',
                  maxWidth: '90%',
                  opacity: '0.7',
                  textAlign: 'center',
                }}
              >
                Click to cast your vote securely
              </div>
            )}
          </div>
        </div>
      ),
      {
        height: 630,
        width: 1200,
      },
    )
  } catch (e) {
    console.error('OG Image generation error:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}
