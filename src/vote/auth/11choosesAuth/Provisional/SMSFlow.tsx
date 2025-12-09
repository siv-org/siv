const devUrl = 'http://127.0.0.1:3002'
const prodUrl = 'https://sms.siv.org'
const domain = process.env.NODE_ENV === 'production' ? prodUrl : devUrl
const url = domain + '/embed'

export const SMSFlow = () => {
  return (
    <div className="w-full h-[550px]">
      <iframe className="w-full h-full" src={url}></iframe>
    </div>
  )
}
