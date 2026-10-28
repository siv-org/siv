export function SignatureVerification() {
  return (
    <div>
      <iframe className="block h-[480px] w-full border-0" src="/demo/signature" title="SIV signature screen" />
      <p className="px-6 pb-5 text-[0.7rem] text-h26-muted">
        Try drawing a signature. Submission is disabled in this preview. In SIV, this check is requested after ballot
        submission.
      </p>
    </div>
  )
}
