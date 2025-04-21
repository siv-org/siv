# Firestore Backup Script

The [db-data/\_dl-all.ts](/db-data/_dl-all.ts) script creates a backup of Firestore collections with these key features:

1. **File Structure**:

   - Each top-level collection is written to its own `.js` file
   - Files use `export default` format for easy importing
   - Subcollections are nested within their parent document's data
   - An `index.ts` provides typed access to all collections

2. **Performance**:

   - Documents are processed in parallel chunks (CHUNK_SIZE = 50)
   - Collections are processed sequentially to avoid overwhelming Firestore
   - Data is written incrementally as it's downloaded
   - Memory efficient - doesn't hold entire collections in memory

3. **Progress Tracking**:

   - Maintains a manifest.json showing status of each collection
   - Shows progress within collections (every N documents)
   - Records timing for each collection download

4. **Output Format**:

   ```typescript
   // users.js
   export default {
     "docId1": {
       // ... document data ...
       __subcollections__: {
         "subcollectionName": {
           // ... subcollection documents ...
         }
       }
     },
     "docId2": { ... },
   }
   ```

5. **Usage**:

   ```typescript
   // Import specific collections
   import { posts, users } from './backup/2024-03-14T12:30/index'

   // Types are automatically inferred
   type UserDoc = (typeof users)['docId']
   ```
