// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; // Use your configured axios instance
import { verifyToken } from '@/utils/auth'; // You'll create this helper


interface AuthContextType {
  user: { id: string; username: string; email: string } | null;
  isAuthenticated: boolean;
  login: (token: string, userData: { id: string; username: string; email: string }) => void;
  logout: () => void;
  loading: boolean; // To indicate if auth state is being loaded
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading state
  const router = useRouter();

  useEffect(() => {
    // Attempt to load user from localStorage on component mount
    const loadUser = async () => {
      const token = localStorage.getItem('heirloom_jwt_token');
      if (token) {
        // You'll need a way to decode / verify the token on the client-side,
        // or re-fetch user data if the token is valid.
        // For simplicity, we'll assume a basic JWT decode or just presence for now.
        // A more robust solution involves a backend endpoint to verify/decode token.

        try {
          // Ideally, hit a backend endpoint like /api/auth/me to get user details
          // const response = await api.get('/auth/me'); // This endpoint doesn't exist yet, but planned.
          // For now, let's assume if token exists, user is authenticated
          const decoded = verifyToken(token); // Use a simple client-side verify (see next util)
          if (decoded && decoded.id) {
            // For now, we only have user ID from token. For username/email,
            // you might store it alongside token or fetch from /auth/me.
            // For this example, let's assume we store minimal user info with token on login/register
            const storedUser = localStorage.getItem('heirloom_user_info');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } else {
                // Fallback if user info not stored, just use ID
                setUser({ id: decoded.id, username: 'User', email: 'email@example.com' }); // Placeholder
                setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error('Error verifying token or fetching user data:', error);
          logout(); // Clear invalid token
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (token: string, userData: { id: string; username: string; email: string }) => {
    localStorage.setItem('heirloom_jwt_token', token);
    localStorage.setItem('heirloom_user_info', JSON.stringify(userData)); // Store user info
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('heirloom_jwt_token');
    localStorage.removeItem('heirloom_user_info');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login'); // Redirect to login page on logout
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};