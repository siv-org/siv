export const BannerAnnouncement = () => {
  return (
    <div className="w-full px-4 py-3 text-base italic font-medium text-center text-gray-900 rounded-lg shadow-xl bg-slate-200 my-11 md:text-lg">
      DEF CON 2024 security report is now available —{' '}
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
