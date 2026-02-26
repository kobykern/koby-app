import { storeTokens, logout as apiLogout, fetchWithAuth } from "../utils/api";
import { User } from "../types/user";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;

interface AuthResponse {
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  await storeTokens(data.accessToken, data.refreshToken);
  const { accessToken, refreshToken, ...user } = data;
  return { user };
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");

  await storeTokens(data.accessToken, data.refreshToken);
  const { accessToken, refreshToken, ...user } = data;
  return { user };
}

export async function fetchMe(): Promise<User> {
  const res = await fetchWithAuth("/api/users/me");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function logout(): Promise<void> {
  await apiLogout();
}