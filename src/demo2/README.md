# Founder walkthrough: `/demo-2`

A separate voter-first demo; `/demo` and the production election routes are unchanged.

## Experience

Overview → authentication choices → name-only demo admission → one-time code → embedded SIV ballot → submitted receipt and encrypted bulletin board → immediate shuffle/unlock → results, verification, participation chart, and audit-planning illustration.

The ballot supports choose-one and approval voting. All example voters use the selected ballot design. Optional tools include a second-device receipt checker, a clearly separate private-override practice scenario, and deletion of the private receipt. Receipt tools remain accessible after results open.

## Real operations and boundaries

- `/demo-2/voter` embeds the production `Ballot`, vote-state reducer, `UnlockedVote`, `EncryptedVote`, and `DetailedEncryptionReceipt` components. The public parent receives ciphertexts, not the voter's plaintext or randomizers.
- `election.ts` generates a local key and 24 fictional encrypted ballots. It accepts the visitor's issued code once, validates ballot columns and curve points, re-encrypts/shuffles using SIV's shuffle implementation, and decrypts the accepted ciphertexts. Results use production tally code and `RoundResults`.
- `/demo-2/check` decrypts a private receipt with its encryption randomizers and verifies those against the ciphertext locks. Receipt data travels in the URL fragment, which the checker immediately removes. This checks the supplied receipt, not independent acceptance by an election server.
- Everything runs in browser memory. There is no production election creation, database mutation, mail delivery, voter authentication, server bulletin board, threshold key ceremony, or shuffle proof. The single demo key is held by the parent. Reloading resets the election. Private-receipt deletion clears the voter interface's state and parent lookup; saved copies and checker tabs require separate deletion.
- The coercion scenario is educational and does not mutate the actual demo ballot. A production private override requires a separate authorized channel.
- The audit calculator illustrates detection sampling under a stated error model. It is not a certified risk-limiting audit or a statistical confidence claim about the result.

Connecting this wrapper to a managed backend demo election, with the production submission/verification endpoints and independent trustees, remains separate integration work. The current demo does not imply those guarantees.

## Validation

`bun test src/demo2/election.test.ts` checks both ballot types through acceptance and shuffle/decryption, preservation of selections and verification numbers, rejection of duplicate/unknown credentials and malformed ballots, private receipt checks, and audit math.

`npx tsc --noEmit` and `npx eslint src/demo2 pages/demo-2.tsx pages/demo-2` check types and repository rules.
