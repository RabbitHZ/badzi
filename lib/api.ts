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
  // Attach the bearer token when auth is wired up later.
  token?: string
}

// Fetch a JSON endpoint and unwrap the ApiResponse<T> envelope.
export async function apiGet<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = opts
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new ApiError(res.status, `Request failed: ${res.status} ${path}`)
  }

  const body = (await res.json()) as ApiResponse<T> | T
  // Some endpoints return the envelope, some may return raw data.
  if (body && typeof body === "object" && "data" in (body as ApiResponse<T>)) {
    return (body as ApiResponse<T>).data
  }
  return body as T
}

// Build a full badge image URL (the badge server keeps the /api prefix).
export function badgeUrl(
  params: { url: string; label: string; color: string; styleType: string },
  preview = false
): string {
  const query = new URLSearchParams(params).toString()
  return `${API_BASE}/api/badges${preview ? "/preview" : ""}?${query}`
}
