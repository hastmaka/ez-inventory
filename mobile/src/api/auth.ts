import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { fetchApi } from './fetchApi';

interface LoginResult {
  success: true;
  user: any;
}

interface LoginError {
  success: false;
  message: string;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResult | LoginError> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();

    if (!token) {
      return { success: false, message: 'Failed to get token' };
    }

    const dbUser = await fetchApi('login', 'POST');

    if (!dbUser || dbUser.newUser) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, user: dbUser.auth.user };
  } catch (error: any) {
    const errorMessages: Record<string, string> = {
      'auth/invalid-credential': 'Invalid credentials',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
      'auth/user-not-found': 'User not found',
    };
    const message = errorMessages[error.code] || 'Login failed';
    return { success: false, message };
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
