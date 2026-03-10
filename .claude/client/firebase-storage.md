# Firebase Storage

```typescript
import { uploadToFirebaseStorage, deleteFromFirebaseStorage } from "@/api/firebase/FirebaseStore";

// Upload files — returns array of { name, url }
const results = await uploadToFirebaseStorage(files, 'path/to/folder', (fileName, progress) => { });

// Delete files — accepts Firebase URLs or storage paths
await deleteFromFirebaseStorage(urlOrPath);
```
