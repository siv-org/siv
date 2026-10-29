export function SignatureVerification({ onClose }: { onClose: () => void }) {
  return (
    <iframe
      className="block h-[480px] w-full border-0"
      onLoad={({ currentTarget }) => {
        const doc = currentTarget.contentDocument
        const canvas = doc?.querySelector('canvas')
        const submit = Array.from(doc?.querySelectorAll('a') || []).find((link) => link.textContent === 'Submit')
        const context = canvas?.getContext('2d')
        if (!doc || !canvas || !context || !submit) return
        // The shared pad has a transparent background; any painted pixel means ink is present.
        const hasInk = () =>
          context
            .getImageData(0, 0, canvas.width, canvas.height)
            .data.some((value, index) => index % 4 === 3 && value > 0)
        const updateSubmit = () => {
          const disabled = !hasInk()
          submit.classList.toggle('disabled', disabled)
          submit.setAttribute('aria-disabled', String(disabled))
        }
        // Read after the pad finishes drawing or clearing, without changing the production component.
        const afterPadUpdate = () => requestAnimationFrame(updateSubmit)
        doc.addEventListener('pointerup', afterPadUpdate)
        doc.addEventListener('click', afterPadUpdate)
        updateSubmit()
        // Demo only: intercept Submit before the real signature handler runs.
        submit.href = '#'
        submit.addEventListener(
          'click',
          (event) => {
            event.preventDefault()
            event.stopPropagation()
            if (hasInk()) {
              updateSubmit()
              onClose()
            }
          },
          true,
        )
      }}
      src="/demo/signature"
      title="SIV signature screen"
    />
  )
}
