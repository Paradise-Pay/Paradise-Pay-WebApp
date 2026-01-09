'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified?: boolean;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    nickname: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken'); 
        const storedUser = localStorage.getItem('user');   
        
        if (token && storedUser) {
          // Restore user from local storage immediately to prevent flicker
          setUser(JSON.parse(storedUser));
        } else if (token) {
           // const profile = await authService.getUserProfile();
           // setUser(profile);
        }
      } catch (error) {
        console.error('Auth restoration failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      const userObj: User = {
        id: data.user.user_id, 
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || 'User', // Default to 'User' if missing
      };

      localStorage.setItem('user', JSON.stringify(userObj)); // Persist user data
      setUser(userObj);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    nickname: string;
  }) => {
    try {
      await authService.signup(userData);
      router.push('/auth/login');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/auth/login');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await authService.resetPassword(token, newPassword);
      router.push('/auth/login');
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await authService.verifyEmail(token);
      router.push('/auth/login?verified=true');
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setUser(prev => {
        if (!prev) return null;
        const updated = { ...prev, ...userData };
        // Update local storage so the change persists on refresh
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
      return Promise.resolve();
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};