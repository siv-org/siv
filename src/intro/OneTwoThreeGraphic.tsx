export const OneTwoThreeGraphic = () => {
  return (
    <>
      <ol className="flex mt-10 space-between">
        {['One Person, One Vote', 'Vote in Seconds', 'Cryptographic Privacy'].map((text, index) => (
          <li className="relative text-center" key={text}>
            <div className="w-5 h-5 mx-auto mb-1 text-sm text-white bg-blue-900 rounded-full">{index + 1}</div>
            {text}
          </li>
        ))}
      </ol>
      <div className="mt-5 mb-9">
        <div>✅</div>
        <div className="font-extrabold text-blue-900">Voter Verifiable Results</div>
      </div>
    </>
  )
}
