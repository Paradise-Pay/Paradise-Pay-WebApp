"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, User } from "@/types/auth";
import { ApiResponse } from "@/types/api"; // import ApiResponse from types folder
import * as api from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCurrentUser()
      .then((res: ApiResponse<User>) => {
        if (res.success && res.data) setUser(res.data);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res: ApiResponse<{ user: User }> = await api.login(email, password);
      if (res.success && res.data?.user) setUser(res.data.user);
      else throw new Error(res.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
