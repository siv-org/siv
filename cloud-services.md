# Tips For Getting API Keys for Cloud Services

Here are more detailed instructions for how to get API keys for the cloud services needed for your `.env.local` file:

**Firebase**:

1.  Visit [Firebase](https://firebase.google.com/) and sign in with your Google account
2.  Click on "Get Started" and create a new project
3.  Navigate to the project settings (cog icon) and go to "Project setting" -> "Service accounts"
4.  Generate a new private key for the Firebase Admin SDK and download the JSON file
5.  Extract the following values from the JSON file and add them to your `.env.local`:
    - `FIREBASE_CLIENT_EMAIL`: Found in the "client_email" field
    - `FIREBASE_PRIVATE_KEY`: Found in the "private_key" field
      - Note: Ensure this key is enclosed in double quotes
    - `FIREBASE_PROJECT_ID`: Found in the "project_id" field

**Supabase**:

1.  Visit [Supabase](https://supabase.com/) and sign up for an account
2.  Create a new project and note down the project URL and the public API key
3.  Go to the project settings and add the following values to your `.env.local`:
    - `SUPABASE_ADMIN_KEY`: Found in "API" -> "Project API keys" under "anon public"
    - `SUPABASE_DB_URL`: Found in "API" -> "Project URL"
      - Note: Be sure to add "https://" to the start of the address
    - `SUPABASE_JWT_SECRET`: Found in "API" -> "JWT Settings" under "JWT Secret"

**Mailgun**:

1.  Visit [Mailgun](https://mailgun.com/) and sign up for a free account
2.  Use the default sandbox domain provided by Mailgun for testing purposes.
3.  Click on your account menu (top-right)
    - Go to "Mailgun API keys" and hit "Add new key"
    - Give the key a description such as "SIV"
    - Copy the new API key and add it to `.env.local` under `MAILGUN_API_KEY`
4.  Go back to the Dashboard and click on the sandbox account under "Sending domains"
    - Note: the domain will look like `sandbox<XXXX>.mailgun.org`
    - Copy this domain and add it to `.env.local` under `MAILGUN_DOMAIN`
5.  Add "Authorized Recipients" email addresses on the right that you will test with
6.  Now test that everything is set up correctly using the appropriate command provided in the API panel
