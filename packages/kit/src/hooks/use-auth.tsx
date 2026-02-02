import React, { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      // In a real app, you would check for stored tokens here
      setUser(null); // Start with no user
      setLoading(false);
    }, 500);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(mockUser);
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = async () => {
    setLoading(true);
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(null);
        setLoading(false);
        resolve();
      }, 500);
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: user ? true : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}