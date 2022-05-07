export const LoginForm = () => {
  return (
    <div>
      <input placeholder="you@email.com" type="text" />

      <button>Login</button>
      <style jsx>{`
        input,
        button {
          font-size: 20px;
        }
      `}</style>
    </div>
  )
}
