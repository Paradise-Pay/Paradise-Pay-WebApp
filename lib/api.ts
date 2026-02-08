import type { Event, OrganizerEventResponse, EventCategoryResponse, EventDetailResponse, SearchParams } from "@/types/domain/event";
import type { TicketTypePayload, TicketTypeResponse, PurchasePayload, UserTicketResponse } from "@/types/domain/ticket";
import type { Bundle, CreateBundlePayload, UpdateBundlePayload } from "@/types/domain/bundle";
import type { SupportTicket, CreateTicketPayload, SupportSearchParams, TicketResponse } from "@/types/domain/support";
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
    phone: user.phone || user.phoneNumber || '',
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
 * Google Sign-In
 * Exchanges a Google ID Token for an app session (Access/Refresh tokens)
 * Endpoint: POST /auth/google
 */
export const googleLogin = async (idToken: string) => {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) throw new Error("Google login failed");
  const response = await res.json();

  // Handle backend response structure
  const data = response.data || response;
  const user = data.user;

  if (!user) throw new Error("No user data in response");

  // Transform user object to match your frontend AuthUser type
  const transformedUser = {
    id: user.user_id || user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    firstName: user.name?.split(' ')[0] || '',
    lastName: user.name?.split(' ').slice(1).join(' ') || '',
    avatar: user.profile_picture_url || user.avatar
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
 * User profile: Get current user's profile data
 */
export const getUserProfile = async () => {
  return apiFetch<UserProfile>("/user/profile", {
    method: "GET",
  });
};

/**
 * Update user details (Name, Phone, Nickname, Role)
 * Endpoint: POST /auth/updateuser/{userId}
 */
export const updateUserDetails = async (
  userId: string, 
  data: { 
    name?: string; 
    phone?: string; 
    nickname?: string; 
    role?: string; // Added role here
  }
) => {
  return apiFetch<{ success: boolean; message: string; user: any }>(
    `/auth/updateuser/${userId}`, 
    {
      method: "POST",
      body: data,
    }
  );
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
 * Search events with filters
 * Endpoint: GET /events/search
 */
export const searchEvents = async (params: SearchParams = {}) => {
  // Convert params object to URL query string
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });

  return apiFetch<any>(`/events/search?${query.toString()}`, {
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
 * Get the current user's list of favorite events
 * Endpoint: GET /events/favorites/list
 */
export const getUserFavorites = async () => {
  // Returns an array of Events
  return apiFetch<any[]>('/events/favorites/list', {
    method: 'GET',
  });
};

/**
 * Add a specific event to the user's favorites
 * Endpoint: POST /events/{event_id}/favorites
 */
export const addEventToFavorites = async (eventId: string) => {
  return apiFetch<{ message: string }>(`/events/${eventId}/favorites`, {
    method: 'POST',
  });
};

/**
 * Remove a specific event from the user's favorites
 * Endpoint: DELETE /events/{event_id}/favorites
 */
export const removeEventFromFavorites = async (eventId: string) => {
  return apiFetch<{ message: string }>(`/events/${eventId}/favorites`, {
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

/**
 * Subscribe to coming soon updates
 * Endpoint: POST /coming-soon/subscribe
 */
export const subscribeToComingSoon = async (email: string) => {
  return apiFetch<{ success: boolean; message: string; data?: any }>("/coming-soon/subscribe", {
    method: "POST",
    body: { email },
  });
};

/**
 * ADMIN: Get a list of all users
 * Endpoint: GET /admin/users
 */
export const getAllUsers = async () => {
  return apiFetch<{ users: any[], total: number }>('/admin/users', { 
    method: 'GET',
  });
};

/**
 * ADMIN: Get a list of all events
 * Endpoint: GET /admin/events
 */
export const getAllEvents = async () => {
  // Assuming the admin router is mounted at /admin
  return apiFetch<any[]>('/admin/events', {
    method: 'GET',
  });
};

/**
 * ADMIN: Get admin dashboard stats
 * Endpoint: GET /admin/dashboard
 */
export const getAdminDashboardStats = async () => {
  return apiFetch<any>('/admin/dashboard', {
    method: 'GET',
  });
};

/**
 * ADMIN: Update a user's plan
 * Endpoint: PUT /admin/users/{user_id}/plan
 */
export const updateUserPlan = async (userId: string, plan: string) => {
  return apiFetch<{ success: boolean; message: string }>(`/admin/users/${userId}/plan`, {
    method: 'PUT',
    body: { plan }, 
  });
};

// --- BUNDLES ---

/**
 * Get all bundles for the logged-in organizer (or all if Admin)
 * Endpoint: GET /bundles
 */
export const getBundles = async () => {
  return apiFetch<Bundle[]>('/bundles', {
    method: 'GET',
  });
};

/**
 * Get a specific bundle by ID
 * Endpoint: GET /bundles/{bundle_id}
 */
export const getBundleById = async (bundleId: string) => {
  return apiFetch<Bundle>(`/bundles/${bundleId}`, {
    method: 'GET',
  });
};

/**
 * Create a new bundle
 * Endpoint: POST /bundles
 */
export const createBundle = async (data: CreateBundlePayload) => {
  return apiFetch<Bundle>('/bundles', {
    method: 'POST',
    body: data,
  });
};

/**
 * Update a bundle
 * Endpoint: PUT /bundles/{bundle_id}
 */
export const updateBundle = async (bundleId: string, data: UpdateBundlePayload) => {
  return apiFetch<Bundle>(`/bundles/${bundleId}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Delete a bundle
 * Endpoint: DELETE /bundles/{bundle_id}
 */
export const deleteBundle = async (bundleId: string) => {
  return apiFetch<{ success: boolean; message: string }>(`/bundles/${bundleId}`, {
    method: 'DELETE',
  });
};

/**
 * Add an event to a bundle
 * Endpoint: POST /bundles/{bundle_id}/events
 */
export const addEventToBundle = async (bundleId: string, eventId: string) => {
  return apiFetch<Bundle>(`/bundles/${bundleId}/events`, {
    method: 'POST',
    body: { event_id: eventId },
  });
};

/**
 * Remove an event from a bundle
 * Endpoint: DELETE /bundles/{bundle_id}/events/{event_id}
 */
export const removeEventFromBundle = async (bundleId: string, eventId: string) => {
  return apiFetch<Bundle>(`/bundles/${bundleId}/events/${eventId}`, {
    method: 'DELETE',
  });
};

/**
 * Create a new support ticket
 * Endpoint: POST /support/tickets
 */
export const createSupportTicket = async (data: CreateTicketPayload) => {
  return apiFetch<SupportTicket>('/support/tickets', {
    method: 'POST',
    body: data,
  });
};

/**
 * Get a list of support tickets (with pagination & filters)
 * Endpoint: GET /support/tickets
 */
export const getSupportTickets = async (params: SupportSearchParams = {}) => {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });

  return apiFetch<{ tickets: SupportTicket[]; total: number; page: number }>(
    `/support/tickets?${query.toString()}`, 
    { method: 'GET' }
  );
};

/**
 * Get a single ticket details with responses
 * Endpoint: GET /support/tickets/{ticket_id}
 */
export const getSupportTicketById = async (ticketId: string) => {
  return apiFetch<SupportTicket>(`/support/tickets/${ticketId}`, {
    method: 'GET',
  });
};

/**
 * ADMIN: Update a ticket (status, priority, assignment)
 * Endpoint: PUT /support/tickets/{ticket_id}
 */
export const updateSupportTicket = async (ticketId: string, updates: Partial<SupportTicket>) => {
  return apiFetch<SupportTicket>(`/support/tickets/${ticketId}`, {
    method: 'PUT',
    body: updates,
  });
};

/**
 * Add a response/reply to a ticket
 * Endpoint: POST /support/tickets/{ticket_id}/responses
 */
export const addTicketResponse = async (ticketId: string, message: string, isInternal: boolean = false) => {
  return apiFetch<TicketResponse>(`/support/tickets/${ticketId}/responses`, {
    method: 'POST',
    body: { message, is_internal: isInternal },
  });
};