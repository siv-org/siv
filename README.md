# SIV — the Secure Internet Voting protocol

Internet voting system designed for **government-grade election security**, with mathematically provable privacy & vote verifiability.

<p align="center"><img alt="screenshot-of-siv-voter-interface" src="https://hack-siv-org.vercel.app/images-for-decon-2024/screenshot-of-siv-voter-interface.png" width="300px" /></p>

## Core Security Goals

- **Authenticated voters:** Only legitimately registered voters are allowed to vote, and only once per person.
- **Private voting:** A fair election requires that voters can freely choose without anyone learning how they voted.
- **Verifiable tallies:** For widely accepted results, vote totals must be independently auditable for accuracy.

## Resources

- Homepage: [siv.org](https://siv.org)
- Documentation: [docs.siv.org](https://docs.siv.org)
- Illustrated Guide to the SIV Protocol: [siv.org/protocol](https://siv.org/protocol)
- SIV compared to other government elections options: [docs.siv.org/compare](https://docs.siv.org/compare)

## License & Restrictions

SIV is designed to [create verifiable proof of accurate election results](https://docs.siv.org/verifiability), without needing to inspect any source code — which is not feasible of remote servers anyway.

Nonetheless, the SIV Source Code is made available for transparency, to enable deep security inspections.

Permission is **_not granted_** for commercial or governmental usage, without first acquiring a separate Commercial or Government License. Contact team@siv.org if interested.

See the [SIV Public License](/LICENSE) for further details.

## Local Development Instructions

### Initial set up

1. Duplicate the file `.env.local.TEMPLATE` into `.env.local`

2. Create (free) accounts with the providers listed in the `.env.local` file and add your new API keys as described below:

   **Firebase**:
      1. Visit [Firebase](https://firebase.google.com/) and sign in with your Google account
      2. Click on "Get Started" and create a new project
      3. Navigate to the project settings (cog icon) and go to "Project setting" -> "Service accounts"
      4. Generate a new private key for the Firebase Admin SDK and download the JSON file
      5. Extract the following values from the JSON file and add them to your `.env.local`:
         * `FIREBASE_CLIENT_EMAIL`: Found in the "client_email" field
         * `FIREBASE_PRIVATE_KEY`: Found in the "private_key" field
           * Note: Ensure this key is enclosed in double quotes
         * `FIREBASE_PROJECT_ID`: Found in the "project_id" field

   **Supabase**:
      1. Visit [Supabase](https://supabase.com/) and sign up for an account
      2. Create a new project and note down the project URL and the public API key
      3. Go to the project settings and add the following values to your `.env.local`:
         * `SUPABASE_ADMIN_KEY`: Found in "API" -> "Project API keys" under "anon public"
         * `SUPABASE_DB_URL`: Found in "Database" -> "Connection parameters" under "Host"
           * Note: Be sure to add "https://" to the start of the address
         * `SUPABASE_JWT_SECRET`: Found in "API" -> "JWT Settings" under "JWT Secret"

   **Mailgun**:
      1. Visit [Mailgun](https://mailgun.com/) and sign up for a free account
      2. Use the default sandbox domain provided by Mailgun for testing purposes.
      3. Click on your account menu (top-right)
         * Go to "Mailgun API keys" and hit "Add new key"
         * Give the key a description such as "SIV"
         * Copy the new API key and add it to `.env.local` under `MAILGUN_API_KEY`
      4. Go back to the Dashboard and click on the sandbox account under "Sending domains"
         * Note: the domain will look like `sandbox<XXXX>.mailgun.org`
         * Copy this domain and add it to `.env.local` under `MAILGUN_DOMAIN`
      5. Add "Authorized Recipients" email addresses on the right that you will test with
      6. Now test that everything is set up correctly using the appropriate command provided in the API panel

3. Install local dependencies:

```bash
npm install
```

### Then, to start dev server

```bash
npm run dev
```

And you should see:

> Ready - server started on http://localhost:3000

🎉
