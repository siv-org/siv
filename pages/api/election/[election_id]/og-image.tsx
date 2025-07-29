import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export default async function handler(request: Request) {
  try {
    // Extracting election_id from URL & Validate it
    const { searchParams } = new URL(request.url)
    const election_id = searchParams.get('election_id')

    if (!election_id) {
      return new Response('Missing election_id parameter', { status: 400 })
    }

    // Fetch election data from API endpoint
    const host = request.headers.get('host')
    const baseUrl = host?.startsWith('localhost') ? `http://${host}` : `https://${host}`

    const electionResponse = await fetch(`${baseUrl}/api/election/${election_id}/info`)

    if (!electionResponse.ok) {
      return new Response('Election not found', { status: 404 })
    }

    // Get first question, up to 4 options, and only add the count of extra questions or options
    const electionData = await electionResponse.json()
    const ballot_design = electionData?.ballot_design || []

    const firstQuestion = ballot_design[0]
    const questionTitle = truncateText(firstQuestion?.title || 'Vote Now', 50)
    const options = firstQuestion?.options || []

    const additionalQuestions = ballot_design.length - 1
    const additionalOptions = options.length - 4

    return new ImageResponse(
      (
        // Set the general styling for the whole image
        <div
          style={{
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            display: 'flex',
            height: '100%',
            padding: '60px',
            width: '100%',
          }}
        >
          {/* Set the styling for the left column */}
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
            {/* Background for the left column */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(6, 0, 103, 0.12), rgba(6, 0, 103, 0.08))',
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
              <h1
                style={{
                  color: '#1a1a1a',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  lineHeight: '1.1',
                  margin: '8px 0',
                  padding: 0,
                }}
              >
                Vote On:
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
            {/* Display up to 4 options, plus indicators for extra options & questions */}
            {options.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

                {additionalOptions > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '20px',
                      justifyContent: 'center',
                      marginTop: '4px',
                      opacity: '0.7',
                    }}
                  >
                    + {additionalOptions} more option{additionalOptions > 1 ? 's' : ''}
                  </div>
                )}

                {additionalQuestions > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '20px',
                      justifyContent: 'center',
                      marginTop: '2px',
                      opacity: '0.6',
                    }}
                  >
                    + {additionalQuestions} more question{additionalQuestions > 1 ? 's' : ''}
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
        // Signal-friendly settings
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'Content-Type': 'image/png',
          'X-Robots-Tag': 'index, follow, imageindex',
        },
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
