# Socket.io Client

```typescript
// client/src/signals/ioSignal.ts
import { io } from 'socket.io-client';
export const socket = io(import.meta.env.VITE_REACT_APP_IO_URL_SOCKET_IO, {
    transports: ['websocket'], secure: true
});
// Handshake: sends { sessionId, businessId } in auth
```
