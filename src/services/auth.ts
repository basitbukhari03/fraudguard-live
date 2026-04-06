/**
 * Auth API Service
 * -----------------
 * Handles all authentication API calls to the Flask backend.
 * Now includes email verification (OTP) flow.
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

// ── Allowed Email Domains ───────────────────────────────────────────

const ALLOWED_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "protonmail.com",
  "proton.me",
  "aol.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "gmx.com",
  "gmx.net",
]);

export function validateEmailDomain(email: string): string | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  const domain = email.split("@")[1].toLowerCase();
  if (!ALLOWED_DOMAINS.has(domain)) {
    return `Email domain '@${domain}' is not supported. Use Gmail, Outlook, Yahoo, iCloud, or ProtonMail.`;
  }
  return null;
}

// ── API Types ───────────────────────────────────────────────────────

interface AuthResponse {
  token: string;
  user: { name: string; email: string };
}

interface RegisterResponse {
  message: string;
  email: string;
}

interface UserResponse {
  user: { name: string; email: string };
}

// ── Helper: extract error ───────────────────────────────────────────

async function extractError(response: Response, fallback: string): Promise<string> {
  const body = await response.json().catch(() => ({}));
  const error = body.error;
  if (Array.isArray(error)) return error.join(" ");
  if (typeof error === "string") return error;
  return `${fallback} (${response.status})`;
}

// ── Register (sends OTP, no token) ──────────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
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
    throw new Error(await extractError(response, "Registration failed"));
  }

  return await response.json();
}

// ── Verify Email (OTP → get token) ──────────────────────────────────

export async function verifyEmail(
  email: string,
  code: string
): Promise<AuthResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again later.");
  }

  if (!response.ok) {
    throw new Error(await extractError(response, "Verification failed"));
  }

  const data: AuthResponse = await response.json();
  saveToken(data.token);
  return data;
}

// ── Resend Code ─────────────────────────────────────────────────────

export async function resendCode(email: string): Promise<string> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again later.");
  }

  if (!response.ok) {
    throw new Error(await extractError(response, "Resend failed"));
  }

  const data = await response.json();
  return data.message;
}

// ── Login ───────────────────────────────────────────────────────────

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
    if (body.unverified) {
      const err = new Error(body.error || "Email not verified.") as any;
      err.unverified = true;
      err.email = body.email;
      throw err;
    }
    const error = body.error;
    if (Array.isArray(error)) throw new Error(error.join(" "));
    if (typeof error === "string") throw new Error(error);
    throw new Error(`Login failed (${response.status})`);
  }

  const data: AuthResponse = await response.json();
  saveToken(data.token);
  return data;
}

// ── Get Current User ────────────────────────────────────────────────

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
