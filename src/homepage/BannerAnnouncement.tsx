export const BannerAnnouncement = () => {
  return (
    <div className="px-4 py-3 my-11 w-full text-base italic font-medium text-center text-gray-900 rounded-lg shadow-xl bg-slate-200 md:text-lg">
      DEF CON security report is now available —{' '}
      <a
        className="!text-blue-700"
        href="https://hack.siv.org/reports/2024defcon"
        rel="noopener noreferrer"
        target="_blank"
      >
        See the findings
      </a>
      .
    </div>
  )
}
