// Thin API client for the Badzi backend.
// Base URL comes from NEXT_PUBLIC_API_BASE so dev (localhost:8080) and
// production (api.badzi.app) can differ without code changes.

import type { ApiResponse } from "./types"

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || "https://api.badzi.app"

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

interface RequestOptions extends RequestInit {
  token?: string
  // Skip automatic token refresh (used internally to avoid loops).
  _skipRefresh?: boolean
}

async function unwrap<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) {
    throw new ApiError(res.status, `Request failed: ${res.status} ${path}`)
  }
  const body = (await res.json()) as ApiResponse<T> | T
  if (body && typeof body === "object" && "data" in (body as ApiResponse<T>)) {
    return (body as ApiResponse<T>).data
  }
  return body as T
}

// Fetch a JSON endpoint and unwrap the ApiResponse<T> envelope.
// On 401, attempts one token refresh then retries automatically.
export async function apiGet<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { token, _skipRefresh, headers, ...rest } = opts
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  })

  if (res.status === 401 && !_skipRefresh && typeof window !== "undefined") {
    const { refreshTokens } = await import("./auth")
    const newToken = await refreshTokens()
    if (newToken) {
      return apiGet<T>(path, { ...opts, token: newToken, _skipRefresh: true })
    }
  }

  return unwrap<T>(res, path)
}

// POST/PUT/DELETE with JSON body. Supports the same 401 auto-refresh.
export async function apiMutate<T>(
  method: "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  opts: RequestOptions = {}
): Promise<T> {
  const { token, _skipRefresh, headers, ...rest } = opts
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  })

  if (res.status === 401 && !_skipRefresh && typeof window !== "undefined") {
    const { refreshTokens } = await import("./auth")
    const newToken = await refreshTokens()
    if (newToken) {
      return apiMutate<T>(method, path, body, { ...opts, token: newToken, _skipRefresh: true })
    }
  }

  return unwrap<T>(res, path)
}

// Build a full badge image URL (the badge server keeps the /api prefix).
export function badgeUrl(
  params: { url: string; label: string; color: string; styleType: string },
  preview = false
): string {
  const query = new URLSearchParams(params).toString()
  return `${API_BASE}/api/badges${preview ? "/preview" : ""}?${query}`
}
