/**
 * Auth API Service
 * -----------------
 * Handles all authentication API calls to the Flask backend.
 */

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// ── Token Management ────────────────────────────────────────────────

const TOKEN_KEY = "fraudguard_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ── API Types ───────────────────────────────────────────────────────

interface AuthResponse {
  token: string;
  user: { name: string; email: string };
}

interface UserResponse {
  user: { name: string; email: string };
}

// ── API Functions ───────────────────────────────────────────────────

/**
 * Register a new user account.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again later.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = body.error;
    if (Array.isArray(error)) throw new Error(error.join(" "));
    if (typeof error === "string") throw new Error(error);
    throw new Error(`Registration failed (${response.status})`);
  }

  const data: AuthResponse = await response.json();
  saveToken(data.token);
  return data;
}

/**
 * Login with email and password.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again later.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = body.error;
    if (Array.isArray(error)) throw new Error(error.join(" "));
    if (typeof error === "string") throw new Error(error);
    throw new Error(`Login failed (${response.status})`);
  }

  const data: AuthResponse = await response.json();
  saveToken(data.token);
  return data;
}

/**
 * Get current user info from JWT token.
 */
export async function getCurrentUser(): Promise<UserResponse | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      removeToken();
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}
