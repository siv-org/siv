export const ProvisionalSubmitted = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
      <div className="p-8 w-full rounded-2xl border border-purple-100 shadow-lg">
        <h1 className="text-3xl font-semibold tracking-tight text-center text-slate-900 sm:text-4xl">
          <span className="inline-flex gap-2 justify-center items-center">
            <span> ✅ &nbsp;Your provisional ballot is submitted.</span>
          </span>
        </h1>

        <div className="px-6 py-5 mt-8 text-center rounded-xl ring-1 ring-purple-100 bg-purple-50/30">
          <p className="text-lg leading-relaxed text-slate-900">
            <span className="font-semibold text-sky-900">We{"'"}ll email you</span>
            <br />
            <span className="inline-block mt-1 font-semibold text-sky-900">before voting closes on Thurs Dec 11th</span>
            <br />
            <span className="inline-block mt-1">for additional identity verification checks.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
