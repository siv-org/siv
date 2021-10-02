export const BottomLabel = ({ fadeIn, name }: { fadeIn?: boolean; name?: string }) => {
  return (
    <>
      {name && <label className={fadeIn ? 'fade-in' : ''}>{name}</label>}
      <style jsx>{`
        label {
          position: absolute;
          top: 110px;
          line-height: 17px;
          width: 93px;
          right: 0;
          text-align: center;
        }
      `}</style>
    </>
  )
}
