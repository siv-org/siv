import { GlobalCSS } from 'src/GlobalCSS'

import { Head } from '../Head'

export const HomePage2025 = () => {
  return (
    <>
      <Head title="Homepage 2025 Redesign" />

      <div className="homepage-2025">
        <header>
          <h1>Homepage 2025 Redesign</h1>
        </header>

        <main>
          <section className="hero">
            <h2>Hero Section</h2>
            <p>Main headline and call-to-action go here</p>
          </section>

          <section className="content">
            <h2>Content Section</h2>
            <p>Add your content sections here</p>
          </section>
        </main>

        <footer>
          <p>Footer content</p>
        </footer>
      </div>

      <GlobalCSS />

      <style jsx>{`
        .homepage-2025 {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        header {
          padding: 2rem;
          background: #f5f5f5;
        }

        h1 {
          font-size: 2rem;
          margin: 0;
          color: #333;
        }

        main {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        section {
          margin-bottom: 3rem;
          padding: 2rem;
          border: 1px dashed #ccc;
          border-radius: 8px;
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #444;
        }

        p {
          font-size: 1rem;
          color: #666;
          line-height: 1.6;
        }

        footer {
          padding: 2rem;
          background: #333;
          color: white;
          text-align: center;
        }

        footer p {
          color: white;
          margin: 0;
        }
      `}</style>
    </>
  )
}
