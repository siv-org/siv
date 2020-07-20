export const JumboVoteImage = (): JSX.Element => (
  <div style={{ minHeight: '35vh', position: 'relative' }}>
    <div
      style={{
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
      }}
    >
      <img
        src="panda-dogfish/vote-2020-buttons.png"
        style={{
          filter: 'brightness(85%)',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '0% 47.287575345129305%',
          width: '100%',
        }}
      />
    </div>
  </div>
)
