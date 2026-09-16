// Token storage and refresh utilities.
// Tokens live in localStorage so they survive page reloads.
// The refresh call hits POST /api/auth/refresh with the stored refreshToken.

import { API_BASE, ApiError } from "./api"
import type { TokenResponse } from "./types"

const ACCESS_KEY = "badzi_access"
const REFRESH_KEY = "badzi_refresh"
const EXPIRES_KEY = "badzi_expires" // unix ms

export function saveTokens(tokens: TokenResponse) {
  localStorage.setItem(ACCESS_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
  // expiresIn is in seconds
  localStorage.setItem(EXPIRES_KEY, String(Date.now() + tokens.expiresIn * 1000))
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(REFRESH_KEY)
}

export function isTokenExpired(): boolean {
  if (typeof window === "undefined") return true
  const exp = localStorage.getItem(EXPIRES_KEY)
  if (!exp) return true
  // 30-second buffer
  return Date.now() > Number(exp) - 30_000
}

// Attempt to exchange the stored refreshToken for a new pair.
// Returns the new access token on success, null on failure.
export async function refreshTokens(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) {
      clearTokens()
      return null
    }
    const body = await res.json()
    const tokens: TokenResponse = body.data ?? body
    saveTokens(tokens)
    return tokens.accessToken
  } catch {
    clearTokens()
    return null
  }
}

// Get a valid access token, refreshing if needed.
export async function getValidToken(): Promise<string | null> {
  if (!getAccessToken()) return null
  if (isTokenExpired()) return refreshTokens()
  return getAccessToken()
}

// Call POST /api/auth/logout on the backend, then clear local tokens.
export async function logout(token: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    // ignore — clear local state regardless
  } finally {
    clearTokens()
  }
}

// OAuth redirect: backend handles the OAuth dance and redirects back
// to /signin/callback?token=...&refreshToken=...&expiresIn=...
export function getOAuthUrl(provider: "google" | "github"): string {
  return `${API_BASE}/api/auth/${provider}`
}
