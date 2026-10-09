import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  fetchCurrentUser,
  getAuthError,
  loginAccount,
  registerAccount,
  updateProfile as updateProfileRequest
} from '../api/authApi';

const AUTH_TOKEN_KEY = 'ryda.auth.token';
const AUTH_USER_KEY = 'ryda.auth.user';
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
  } catch (_error) {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);
  const [isRestoring, setIsRestoring] = useState(Boolean(token));

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const saveSession = useCallback((sessionToken, sessionUser) => {
    localStorage.setItem(AUTH_TOKEN_KEY, sessionToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
    setToken(sessionToken);
    setUser(sessionUser);
  }, []);

  useEffect(() => {
    if (!token) {
      setIsRestoring(false);
      return;
    }

    let isMounted = true;

    async function restoreSession() {
      try {
        const currentUser = await fetchCurrentUser(token);
        if (isMounted) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
          setUser(currentUser);
        }
      } catch (_error) {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsRestoring(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession, token]);

  const login = useCallback(
    async (credentials) => {
      try {
        const session = await loginAccount(credentials);
        saveSession(session.token, session.user);
        return session.user;
      } catch (error) {
        throw new Error(getAuthError(error));
      }
    },
    [saveSession]
  );

  const register = useCallback(
    async (registration) => {
      try {
        const session = await registerAccount(registration);
        saveSession(session.token, session.user);
        return session.user;
      } catch (error) {
        throw new Error(getAuthError(error));
      }
    },
    [saveSession]
  );

  const updateProfile = useCallback(
    async (updates) => {
      if (!token) {
        throw new Error('Please log in before updating your profile.');
      }

      try {
        const updatedUser = await updateProfileRequest(token, updates);
        saveSession(token, updatedUser);
        return updatedUser;
      } catch (error) {
        throw new Error(getAuthError(error));
      }
    },
    [saveSession, token]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isRestoring,
        login,
        register,
        updateProfile,
        logout: clearSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
