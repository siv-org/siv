const detailsClassName = 'p-4 rounded-lg cursor-pointer bg-yellow-100 border-2 border-blue-700 hover:bg-yellow-200'

export const BackupAuthOptions = () => {
  return (
    <div className="mx-auto max-w-96">
      <p className="mt-8 text-lg font-medium opacity-50">Step 2 of 2</p>
      <h1 className="mt-1 text-3xl font-bold">Provisional Auth Options</h1>

      <p className="mt-8 text-xl">Lastly, we need to verify you are the person whose details you just submitted.</p>

      <div className="mt-8 text-lg text-left">Any of these are acceptable:</div>

      <div className="flex flex-col gap-8 mt-2">
        <details className={detailsClassName}>
          <summary>
            <h3 className="text-xl font-medium">SMS + Caller ID Check</h3>
            <div>works for ~1/3 of people</div>
          </summary>
        </details>

        <details className={detailsClassName}>
          <summary>
            <h3 className="text-xl font-medium">Passport Scan</h3>
          </summary>
        </details>

        <details className={detailsClassName}>
          <summary>
            <h3 className="text-xl font-medium">In-Person</h3>
          </summary>
          <div className="mt-3 text-xl font-semibold">
            <a
              className="hover:text-blue-700"
              href="https://www.11chooses.com/#in-person"
              rel="noreferrer noopener"
              target="_blank"
            >
              Visit 11chooses.com for Locations & Times
            </a>
            .
          </div>
        </details>
      </div>
    </div>
  )
}
