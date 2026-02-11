import { api } from "./api";
import { AuthUser, TokenResponse, MessageResponse } from "@/types/auth";

export async function signup(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<AuthUser> {
  return api<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const res = await api<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("access_token", res.access_token);
  localStorage.setItem("refresh_token", res.refresh_token);
  return res;
}

export async function getMe(): Promise<AuthUser> {
  return api<AuthUser>("/auth/me");
}

export async function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export async function forgotPassword(email: string): Promise<MessageResponse> {
  return api<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  new_password: string,
): Promise<MessageResponse> {
  return api<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password }),
  });
}

export async function verifyEmail(token: string): Promise<MessageResponse> {
  return api<MessageResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export function isAuthenticated(): boolean {
  return (
    typeof window !== "undefined" && !!localStorage.getItem("access_token")
  );
}

export async function resendVerification(
  email: string,
): Promise<MessageResponse> {
  return api<MessageResponse>("/auth/resend-verification-public", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function updateProfile(data: {
  first_name: string;
  last_name: string;
}): Promise<any> {
  return api("/auth/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: {
  current_password: string;
  new_password: string;
}): Promise<any> {
  return api("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
