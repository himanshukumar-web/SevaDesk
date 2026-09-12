"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: "USER" | "CYBER_CAFE" | "SUPER_ADMIN";
  phone: string;
  state: string | null;
  district: string | null;
  city: string | null;
  pincode: string | null;
  isVerified: boolean;
  cyberCafe?: {
    id: string;
    shopName: string;
    verificationStatus: string;
    isAvailable: boolean;
    rating: number;
  } | null;
  subscriptions?: Array<{ plan: string; status: string }>;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: UserSession | null;
}) {
  const [user, setUser] = useState<UserSession | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialUser) {
      fetchUser();
    }
  }, [initialUser]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/auth/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser: fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
