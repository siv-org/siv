/*


## Goals of this script:
(see: https://github.com/siv-org/siv/pull/152#issuecomment-2212417637)

1. Make voters be indexed by auth token, instead of by email.
     - Avoids collisions on email (eg after invalidation). Avoid needing emails at all (eg sms auth, qr codes)
     - Will want to warn about duplicate emails, but shouldn't strictly be a blocker

2. And to merge votes collection into voters
3. And to rename that collection to approved-voters

## How it will work:

Loop through every election
    START DB TRANSACTION
        Download all voters
        Download all votes
        Write existing voters + votes combined to new `approved-voters` collection

        Delete all old 'votes' and 'voters' documents
    END DB TRANSACTION

*/
