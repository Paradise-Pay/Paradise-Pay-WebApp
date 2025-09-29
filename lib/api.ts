import { ApiResponse } from "@/types/api";
import { User } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  body?: any;
}

const apiFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
  const { body, ...rest } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const data: ApiResponse<T> = await res.json().catch(() => {
    return { success: false, message: "Invalid JSON response" };
  });

  if (!res.ok) {
    throw new Error(data.message || data.error || "API request failed");
  }

  return data;
};


export const login = (email: string, password: string) =>
  apiFetch<{ user: User }>("/auth/login/", { method: "POST", body: { email, password } });

export const logout = () => apiFetch<null>("/auth/logout/", { method: "POST" });

export const getCurrentUser = () => apiFetch<User>("/auth/me/", { method: "GET" });
