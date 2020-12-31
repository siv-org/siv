export const EncryptionNote = () => (
  <p className="encryption-note">
    <code>
      <i>https://en.wikipedia.org/wiki/ElGamal_encryption</i>
      {'\n'}encrypted = message * (recipient ^ randomizer) % modulo
      {'\n'}unlock = (generator ^ randomizer) % modulo
    </code>
    <style jsx>{`
      .encryption-note {
        margin-bottom: 20px;
        border: 1px solid #ccc;
        padding: 5px 10px;
        border-radius: 4px;
      }

      code {
        font-size: 13px;
        white-space: pre;
      }
    `}</style>
  </p>
)
