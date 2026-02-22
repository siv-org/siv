export function ChatSection() {
  return (
    <section className="px-7 py-10 pb-[120px] md:py-[60px]" id="ask">
      <div className="mx-auto max-w-[1060px]">
        <div className="mb-7">
          <h2 className="font-serif2026 mb-1.5 text-2xl font-normal tracking-tight">
            Ask, don't dig.
          </h2>
          <p className="text-[0.88rem] font-light leading-[1.5] text-h2026-textSecondary">
            Skip the docs. Start with the question that matters.
          </p>
        </div>

        <div className="max-w-[680px] overflow-hidden rounded-h2026-lg border border-h2026-border bg-h2026-bgCard shadow-h2026-lg transition-shadow focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.08),0_0_0_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3 border-b border-h2026-border px-6 py-4">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-h2026-dark font-mono2026 text-xs font-medium uppercase tracking-wide text-white">
              SIV
            </div>
            <div>
              <h4 className="text-[0.85rem] font-medium">SIV</h4>
              <span className="text-[0.72rem] text-h2026-muted">Ask anything about secure digital voting</span>
            </div>
            <div className="ml-auto h-[7px] w-[7px] rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
          </div>

          <div className="flex min-h-[180px] max-h-[450px] flex-col gap-4 overflow-y-auto p-6 scroll-smooth [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-h2026-borderStrong">
            <div className="msg-assistant max-w-[82%]">
              <div className="font-mono2026 mb-1 px-0.5 text-[0.65rem] uppercase tracking-wide text-h2026-muted">
                SIV
              </div>
              <div className="rounded-2xl rounded-bl rounded-tr-none border border-h2026-border bg-h2026-bgWarm px-[18px] py-3.5 text-[0.88rem] font-light leading-[1.65]">
                What's the <strong>one thing</strong> without which safe digital voting cannot happen?
                <br />
                <br />
                What do you believe is the most necessary ingredient — the foundation — for us to claim digital voting is
                safe?
                <br />
                <br />
                Tell me what you think. I'll show you whether we have it, and how.
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-h2026-border p-3.5">
            <input
              type="text"
              placeholder="Type your answer or question…"
              className="flex-1 rounded-xl border border-h2026-border bg-h2026-bg px-4 py-3 text-[0.86rem] font-light text-h2026-text outline-none transition-[border-color,box-shadow] placeholder:text-h2026-muted focus:border-h2026-borderStrong focus:shadow-[0_0_0_3px_rgba(0,0,0,0.03)]"
              disabled
              aria-label="Chat input (coming soon)"
            />
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-h2026-dark text-white transition-all hover:bg-[#333] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-25"
              disabled
              aria-label="Send"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
