import type { Event, OrganizerEventResponse, EventCategoryResponse, EventDetailResponse } from "@/types/domain/event";
import type { TicketTypePayload, TicketTypeResponse, PurchasePayload, UserTicketResponse } from "@/types/domain/ticket";
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
  const response = await res.json();

  // Handle backend response structure: { success, data: { user, accessToken, refreshToken } }
  const data = response.data || response;
  const user = data.user;

  if (!user) throw new Error("No user data in response");

  // Transform user object to match AuthUser type
  const transformedUser = {
    id: user.user_id || user.id,
    email: user.email,
    role: user.role,
    firstName: user.name?.split(' ')[0] || user.firstName || '',
    lastName: user.name?.split(' ').slice(1).join(' ') || user.lastName || '',
    avatar: user.avatar
  };

  // Store authentication data
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(transformedUser));
  }

  return {
    success: true,
    user: transformedUser,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken
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
 * Get featured events for homepage
 */
export const getFeaturedEvents = async () => {
  return apiFetch<Event[]>("/events/featured", {
    method: "GET",
  });
};

/**
 * Create a new event
 * Endpoint: POST /events
 */
export const createEvent = async (eventData: any) => {
  return apiFetch('/events', {
    method: 'POST',
    body: eventData,
  });
};

/**
 * Search events (optionally by query, category, etc)
 */
export const searchEvents = async (params: Record<string, any> = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch<Event[]>(`/events/search${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};

/**
 * Get all event categories
 * Endpoint: GET /events/categories
 */
export const getEventCategories = async () => {
  return apiFetch<EventCategoryResponse[]>("/events/categories", {
    method: "GET",
  });
};

/**
 * Get single event details by ID
 * Endpoint: GET /events/{id}
 */
export const getEventById = async (eventId: string) => {
  return apiFetch<EventDetailResponse>(`/events/${eventId}`, {
    method: "GET",
  });
};

/**
 * Update an existing event
 */
export const updateEvent = async (eventId: string, eventData: any) => {
  return apiFetch<any>(`/events/${eventId}`, {
    method: "PUT",
    body: eventData,
  });
};

/**
 * Fetch events created by the logged-in organizer
 * Endpoint: GET /events/organizer
 */
export const getOrganizerEvents = async () => {
  return apiFetch<OrganizerEventResponse[]>('/events/organizer', {
    method: 'GET',
  });
};

/**
 * Delete an event
 * Endpoint: DELETE /events/{id}
 */
export const deleteEvent = async (eventId: string) => {
  return apiFetch(`/events/${eventId}`, {
    method: 'DELETE',
  });
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

/**
 * TICKETS: Get ticket types for a specific event
 */

// Create a new ticket type for an event
export const createTicketType = async (eventId: string, data: TicketTypePayload) => {
  return apiFetch(`/events/${eventId}/ticket-types`, {
    method: "POST",
    body: data,
  });
};

/**
 * Fetch ticket types for a specific event
 * Endpoint: GET /events/{event_id}/ticket-types
 */
export const getTicketTypes = async (eventId: string) => {
  return apiFetch<TicketTypeResponse[]>(`/events/${eventId}/ticket-types`, {
    method: "GET",
  });
};

/**
 * Purchase tickets
 * Endpoint: POST /bookings 
 */
export const purchaseTickets = async (data: PurchasePayload) => {
  return apiFetch(`/tickets/purchase`, { 
    method: "POST",
    body: data,
  });
};

/**
 * Fetch the current user's tickets
 * Endpoint: GET /api/v1/tickets/user
 */
export const getUserTickets = async () => {
  return apiFetch<UserTicketResponse[]>('/tickets/user', {
    method: 'GET',
  });
};