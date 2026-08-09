import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { authApi, clearToken, getToken, setToken } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load: if a token exists, validate it against the backend.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // token is invalid/expired - still log out locally
    } finally {
      clearToken();
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((nextUser) => setUser(nextUser), []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout, updateUser }),
    [user, loading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
