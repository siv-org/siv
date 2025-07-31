import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export default async function handler(request: Request) {
  try {
    // Extracting election_id from URL & Validate it
    const election_id = request.url.split('election/')[1].split('/og-image')[0]
    if (!election_id) return new Response('Missing election_id parameter', { status: 400 })

    // Fetch election data from API endpoint
    const host = request.headers.get('host')
    const baseUrl = `http${host?.startsWith('localhost') ? '' : 's'}://${host}`

    const electionResponse = await fetch(`${baseUrl}/api/election/${election_id}/info`)
    if (!electionResponse.ok) return new Response('Election not found', { status: 404 })

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
          {/* Left Column: Set general styling  */}
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
            {/* Left: Background color */}
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
            {/* Left: Styling the content inside the column */}
            <div
              style={{
                alignItems: 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                position: 'relative',
              }}
            >
              {/* Left: Styling the static title */}
              <h1
                style={{
                  color: '#666666',
                  fontSize: '34px',
                  fontWeight: '500',
                  letterSpacing: '0.5px',
                  lineHeight: '1.1',
                  margin: '8px 0',
                  padding: 0,
                  textTransform: 'uppercase',
                }}
              >
                Vote On
              </h1>

              {/* Left: Styling the question */}
              <div
                style={{
                  color: '#060067',
                  fontSize: '48px',
                  fontWeight: '500',
                  letterSpacing: '0.5px',
                  margin: 0,
                  padding: 0,
                }}
              >
                {questionTitle}
              </div>

              {/* Left: Displaying # of additional questions */}
              {additionalQuestions > 0 && (
                <div
                  style={{
                    backgroundColor: 'rgba(6, 0, 103, 0.05)',
                    borderRadius: '12px',
                    color: '#888888',
                    display: 'flex',
                    fontSize: '28px',
                    fontStyle: 'italic',
                    fontWeight: '400',
                    justifyContent: 'center',
                    letterSpacing: '0.3px',
                    marginTop: '8px',
                    padding: '8px 16px',
                  }}
                >
                  + {additionalQuestions} more question{additionalQuestions > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Right column - General Styling */}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {options.slice(0, 4).map((option: { name: string }, i: number) => (
                  <div
                    // Container for individual option row
                    key={i}
                    style={{
                      alignItems: 'center',
                      background: 'linear-gradient(135deg, rgba(6, 0, 103, 0.08), rgba(6, 0, 103, 0.03))',
                      border: '1px solid rgba(6, 0, 103, 0.15)',
                      borderRadius: '16px',
                      boxShadow: '0 4px 12px rgba(6, 0, 103, 0.1)',
                      display: 'flex',
                      fontSize: '36px',
                      fontWeight: '500',
                      letterSpacing: '0.3px',
                      padding: '18px 28px',
                    }}
                  >
                    <div
                      // Round checkbox
                      style={{
                        border: '2px solid #060067',
                        borderRadius: '50%',
                        height: '20px',
                        marginRight: '16px',
                        width: '20px',
                      }}
                    />
                    {truncateText(option.name, 22)}
                  </div>
                ))}

                {/* Additional Options */}
                {additionalOptions > 0 && (
                  <div
                    style={{
                      backgroundColor: 'rgba(6, 0, 103, 0.05)',
                      borderRadius: '12px',
                      color: '#666666',
                      display: 'flex',
                      fontSize: '24px',
                      fontStyle: 'italic',
                      fontWeight: '400',
                      justifyContent: 'center',
                      letterSpacing: '0.3px',
                      marginTop: '8px',
                      padding: '10px 20px',
                    }}
                  >
                    + {additionalOptions} more option{additionalOptions > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ) : (
              // Fallback message if there are no options to display
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
                Vote Privately, In Seconds
              </div>
            )}
          </div>
        </div>
      ),
      { height: 630, width: 1200 },
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
