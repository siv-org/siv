export const EncryptionNote = () => (
  <p className="encryption-note">
    <code>
      <i>https://en.wikipedia.org/wiki/ElGamal_encryption, adapted for Elliptic Curves</i>
      {'\n'}Encrypted = Message + (Pub_key * randomizer)
      {'\n'}Unlock = G * randomizer
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
