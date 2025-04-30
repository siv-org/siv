import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import { useEffect, useState } from 'react'
import TimeAgo from 'timeago-react'

const TestPage = () => {
  const [localStorageSupported, setLocalStorageSupported] = useState<boolean>()
  const [smallQuota, setSmallQuota] = useState<boolean | null>()
  const [fp, setFp] = useState<{ incognito: boolean }>()
  const [storageAge, setStorageAge] = useState<string>('')

  async function runTests() {
    setLocalStorageSupported(testLocalStorage())
    setSmallQuota((await testStorageQuota()) || null) // Not available on Safari
    setFp(await fingerprintjs())
    setStorageAge(testLocalStorageAge())
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <main>
      <title>siv browser tests</title>
      <h1>Test Browser page</h1>
      <p>localStorage supported: {JSON.stringify(localStorageSupported)}</p>
      <p>Small Quota: {JSON.stringify(smallQuota)}</p>
      <p>FP Incognito: {JSON.stringify(fp?.incognito)}</p>
      <p>
        LocalStorage Age: <TimeAgo datetime={new Date(storageAge)} /> -- {storageAge}
      </p>
      <p>Full Fingerprintjs: {JSON.stringify(fp, undefined, 4)}</p>
      <style jsx>{`
        main {
          padding: 3rem;
        }

        p {
          white-space: pre;
        }
      `}</style>
    </main>
  )
}

export default TestPage

function testLocalStorage() {
  try {
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    return true
  } catch (e) {
    console.error('caught error testing localStorage', e)
    return false
  }
}

async function testStorageQuota() {
  if (!navigator) return console.error('No navigator')
  if (!navigator.storage) return console.error('No navigator.storage')
  const { quota } = await navigator.storage.estimate()
  if (!quota) return console.error('No Quota')
  return quota < 120000000
}

async function fingerprintjs() {
  const fp = await FingerprintJS.load({
    endpoint: 'https://qa.secureinternetvoting.org',
    token: 'PhioYVVmZ8G6MliulLBQ',
  })
  const results = await fp.get({ extendedResult: true })
  return results
}

function testLocalStorageAge() {
  try {
    let age = localStorage.getItem('age')
    if (!age) {
      age = String(new Date())
      localStorage.setItem('age', age)
    }
    return age
  } catch (e) {
    console.error(e)
    return 'null'
  }
}
