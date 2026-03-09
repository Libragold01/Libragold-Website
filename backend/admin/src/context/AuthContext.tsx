import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin, authApi } from '../lib/api';

interface AuthContextValue {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('libragold_admin_token')
  );
  const [isLoading, setIsLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    if (token) {
      authApi
        .me()
        .then((data) => setAdmin(data.admin))
        .catch(() => {
          localStorage.removeItem('libragold_admin_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  async function login(username: string, password: string) {
    const data = await authApi.login(username, password);
    localStorage.setItem('libragold_admin_token', data.token);
    setToken(data.token);
    setAdmin(data.admin);
  }

  function logout() {
    localStorage.removeItem('libragold_admin_token');
    setToken(null);
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
