import { useRouter } from 'next/router'

export const onTodoPage = (): boolean => {
  const { query } = useRouter()
  return query?.todo !== undefined
}

export const Todo = ({ children }: { children: JSX.Element }) => {
  if (!onTodoPage()) return null

  return (
    <div>
      <label>Todo</label>
      {children}
      <style jsx>{`
        div {
          border: 2px solid pink;
          border-radius: 4px;

          padding: 5px;
          right: 5px;
          position: relative;

          color: #999;
        }

        label {
          position: absolute;
          top: -10px;
          left: 5px;

          padding: 0 5px;

          color: pink;
          font-weight: bold;

          background-color: white;
        }
      `}</style>
    </div>
  )
}
