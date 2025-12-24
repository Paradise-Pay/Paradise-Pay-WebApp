import { ApiResponse } from "@/types/api";
import { DashboardStats, UserProfile, ProfileUpdateRequest, Activity } from "@/types/dashboard";

// API configuration/api
const API_BASE_URL = "https://paradise-pay-backend-production-e0db.up.railway.app/api/v1";
const API_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/**
 * Generic API fetch wrapper with authentication and error handling
 */
const apiFetch = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
  const { body, ...rest } = options;
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };
  if (!isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers,
    body: isForm ? (body as FormData) : body ? JSON.stringify(body as Record<string, unknown>) : undefined,
    ...rest,
  });

  const data: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    message: "Invalid JSON response",
  }));

  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};

/**
 * User authentication: Login with email and password
 * Stores tokens and user data in localStorage
 */
export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();

  // Transform user object to match AuthUser type
  const transformedUser = data.user ? {
    id: data.user.user_id || data.user.id,
    email: data.user.email,
    role: data.user.role,
    firstName: data.user.name?.split(' ')[0] || data.user.firstName || '',
    lastName: data.user.name?.split(' ').slice(1).join(' ') || data.user.lastName || '',
    avatar: data.user.avatar
  } : null;

  // Store authentication data
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(transformedUser));
  }

  return {
    ...data,
    user: transformedUser
  };
};

/**
 * User registration: Create new account with user data
 */
export const signup = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  nickname: string;
}) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Signup failed");
  }
  
  const data = await res.json();
  return data;
};

/**
 * User logout: Clear stored authentication data and call backend
 */
export const logout = async () => {
  try {
    // Call backend logout endpoint
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout API call failed:", error);
    // Continue with local cleanup even if API call fails
  }
  
  // Clear local storage
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
  
  return { success: true, message: "Logged out" };
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (refreshToken: string) => {
  const res = await fetch(`${API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");
  const data = await res.json();

  // Store new tokens
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  return data;
};

/**
 * Request password reset (alternative to forgotPassword)
 */
export const resetPasswordRequest = async (email: string) => {
  const res = await fetch(`${API_URL}/auth/reset-password-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to request password reset");
  }
  
  const data = await res.json();
  return data;
};

/**
 * Dashboard stats: Get user's dashboard statistics
 */
export const getDashboardStats = async () => {
  return apiFetch<DashboardStats>("/dashboard/stats", {
    method: "GET",
  });
};

/**
 * User profile: Get current user's profile data
 */
export const getUserProfile = async () => {
  return apiFetch<UserProfile>("/user/profile", {
    method: "GET",
  });
};

/**
 * User profile: Update user profile data
 */
export const updateUserProfile = async (profileData: ProfileUpdateRequest) => {
  return apiFetch<UserProfile>("/user/profile", {
    method: "PUT",
    body: profileData,
  });
};

/**
 * User avatar: Upload user avatar image
 */
export const uploadUserAvatar = async (avatarFile: File) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);
  
  return apiFetch<{ avatarUrl: string }>("/user/avatar", {
    method: "POST",
    body: formData,
    headers: {
      // Don't set Content-Type, let browser set it with boundary
    },
  });
};

/**
 * User activity: Get recent user activity
 */
export const getUserActivity = async (limit: number = 10) => {
  return apiFetch<Activity[]>(`/user/activity?limit=${limit}`, {
    method: "GET",
  });
};
export function setToken(accessToken: any) {
  throw new Error("Function not implemented.");
}
