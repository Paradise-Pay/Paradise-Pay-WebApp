"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || (roles && !roles.includes(user.role))) {
        router.push("/auth/login");
      }
    }
  }, [user, loading, roles, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  if (roles && !roles.includes(user.role)) return null;

  return <>{children}</>;
};
