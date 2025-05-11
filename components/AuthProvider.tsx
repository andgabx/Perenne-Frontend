'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null; // Replace with your user type
}

interface AuthContextType {
  auth: AuthState;
  login: (accessToken: string, refreshToken: string, user?: any) => void;
  logout: () => void;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    user: null,
  });

  useEffect(() => {
    // Initialize auth state from localStorage
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    
    if (accessToken) {
      setAuth({
        accessToken,
        refreshToken,
        user,
      });
    }
  }, []);

  const login = (accessToken: string, refreshToken: string, user?: any) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    
    setAuth({
      accessToken,
      refreshToken,
      user: user || auth.user,
    });
  };

  const setUser = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuth(prev => ({ ...prev, user }));
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    setAuth({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);