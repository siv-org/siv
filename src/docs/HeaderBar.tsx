import { useRouter } from 'next/router'
export const HeaderBar = (): JSX.Element => {
  const { query } = useRouter()

  return (
    <main>
      <section>
        <p>
          SIV <span>Docs {query?.todo !== undefined && 'Todo'}</span>
        </p>
      </section>
      <style jsx>{`
        main {
          background: rgb(1, 5, 11);
          background: linear-gradient(90deg, #010b26 0%, #072054 100%);

          color: #fff;

          width: 100%;
        }

        section {
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        p {
          font-size: 24px;
          font-weight: 700;
          padding: 1rem;
          margin: 0;
        }

        span {
          font-weight: 300;
          position: relative;
          left: 3px;
          font-style: italic;
        }
      `}</style>
    </main>
  )
}
