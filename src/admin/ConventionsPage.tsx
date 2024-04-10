import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import { HeaderBar } from './HeaderBar'

export const ConventionsPage = () => {
  return (
    <>
      <Head title="Your Conventions" />

      <HeaderBar />
      <main className="p-4 px-8">
        <h1>Manage Your Conventions</h1>
        <p>
          Use this tool to create re-usable login credentials for voters to use across multiple votes in a single day.
        </p>

        <figure className="mb-12 ml-6 mt-9">
          QR code <i className="px-6 opacity-60">{'→'}</i>{' '}
          <i>siv.org/c/{new Date().getFullYear()}/[convention_id]/[voter_id]</i>
          <b className="block mt-3 mb-0 font-semibold">Lets you redirect to different elections throughout the day</b>
          <ul>
            <li>Reusable voter credentials</li>
            <li>Collect votes in seconds</li>
            <li>End-to-end Verification</li>
          </ul>
        </figure>

        <div>
          <label>Create how many voter credentials?</label>
          <input className="w-20 ml-3 text-lg" min="0" placeholder="200" type="number" />
        </div>

        <button>Download your [200] unique QR codes</button>

        <div className="">
          <h3>Redirect your convention QR codes to which ballot?</h3>
          <select>
            <option>Menu of your current elections</option>
          </select>
        </div>
      </main>

      <GlobalCSS />
    </>
  )
}
