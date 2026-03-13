import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { loginUser, logoutUser } from '../api/auth';
import { fetchApi } from '../api/fetchApi';

import type { ReactNode } from 'react';

interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: any;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isLoading: true,
  isLoggedIn: false,
  user: null,
  login: async () => null,
  logout: async () => {},
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isLoggedIn: false,
    user: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const dbUser = await fetchApi('login', 'POST');
          if (dbUser?.auth?.user) {
            setState({
              isLoading: false,
              isLoggedIn: true,
              user: dbUser.auth.user,
            });
            return;
          }
        } catch {
          // token expired or invalid
        }
      }
      setState({ isLoading: false, isLoggedIn: false, user: null });
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (!result.success) return result.message;
    setState({ isLoading: false, isLoggedIn: true, user: result.user });
    return null;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setState({ isLoading: false, isLoggedIn: false, user: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
