import {io} from 'socket.io-client';

import {LoginController} from '@/view/login/LoginController.ts';

// "undefined" means the URL will be computed from the `window.location` object
export const socket = io(import.meta.env.VITE_REACT_APP_IO_URL_SOCKET_IO, {
	autoConnect: false,
	transports: ['websocket'],
	secure: true,
});

export function connectSocket(): void {
	const userId = LoginController.user?.user_id;
	if (!userId) return;
	socket.auth = { userId };
	socket.connect();
}

export function disconnectSocket(): void {
	socket.disconnect();
}
