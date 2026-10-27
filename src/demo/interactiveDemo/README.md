# Backend-backed demo

`/demo` uses the normal SIV voter and results pages in every environment.

Each voting method has one shared election, with a deterministic
`demo-shared-v4-{method}` ID and `is_demo: true` marker, known to both client and server.
Version and voting method are encoded in the ID rather than duplicated in document fields.
Create the shared elections explicitly against the intended database before using the demo:

```sh
bun --env-file=.env.local pages/api/demo/create-elections.ts
```

The setup script creates each missing election, its key, and 24 encrypted example
ballots atomically. Re-running it preserves existing elections and keys. It refuses
to overwrite conflicting records. Use credentials for the intended database;
deployments sharing that database also share these elections.

`POST /api/demo/mint-auth-token` is intentionally unauthenticated. It registers a voter in an existing demo election and
returns `{ auth }`. The client derives the election ID from the selected voting
method. An unconfigured or closed demo returns 503; visitor requests never create elections.

Start opens the invitation immediately while the real code/QR are prepared.
Refreshing the browser resumes the same tab's issued Voter Code. Changing voting methods registers the
visitor in that method's shared election. The normal voter page encrypts,
authenticates, submits, and retains the private receipt using its usual APIs.

## Results

`POST /api/demo/{id}/unlock-results` refreshes the published snapshot without closing
voting. It is intentionally unauthenticated and accepts only the fixed shared demo IDs marked `is_demo: true`.
Like other single-trustee elections, the
demo key is stored at `elections/{id}/trustees/{ADMIN_EMAIL}` as `private_keyshare`.
Setup and unlocking require `ADMIN_EMAIL` to identify that server trustee.

Concurrent refreshes use last-write-wins. An older snapshot can overwrite a newer
one until the next unlock; accepted votes remain stored. The client makes one request per unlock.
Published snapshots record a ciphertext fingerprint. New votes
and receipt replacements are included in the next refresh; an unchanged snapshot
can be reused without decrypting again.
View results refreshes the snapshot before opening the normal SIV results iframe.
Decryption and ballot recombination reuse the production functions.

This demo uses a single automated key and the normal single-trustee fast shuffle. It does not
run an independent-trustee ceremony. Elections remain open; no automatic expiry
or cleanup is configured. Ordinary elections cannot be unlocked by this endpoint.
Results use SIV's existing single-document format and need partitioning before
the snapshot reaches Firestore's 1 MiB document limit.

Demo records use creator `siv-backend-demo`, are excluded from recent-election
reporting, and are outside ordinary administrators' election lists. Registration
atomically creates the voter record and increments the voter count. There is no
application-level registration rate limiter.

Run `bun test pages/api/demo/` for encryption round trips, shared registration,
concurrent refreshes, later votes, and ordinary-election isolation. Tests use
mocked Firestore and never write to a database.
