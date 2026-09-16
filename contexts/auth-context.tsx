"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import {
  clearTokens,
  getAccessToken,
  getValidToken,
  logout as authLogout,
  saveTokens,
} from "@/lib/auth"
import { apiGet } from "@/lib/api"
import type { TokenResponse, UserProfile } from "@/lib/types"

interface AuthState {
  user: UserProfile | null
  token: string | null
  loading: boolean
  login: (tokens: TokenResponse) => Promise<void>
  logout: () => Promise<void>
  /** Reload the current user profile from the API. */
  reloadUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async (t: string) => {
    try {
      const profile = await apiGet<UserProfile>("/api/users/me", { token: t })
      setUser(profile)
    } catch {
      // token invalid / expired — clear everything
      clearTokens()
      setToken(null)
      setUser(null)
    }
  }, [])

  // On mount, restore session from localStorage.
  useEffect(() => {
    ;(async () => {
      const validToken = await getValidToken()
      if (validToken) {
        setToken(validToken)
        await fetchUser(validToken)
      }
      setLoading(false)
    })()
  }, [fetchUser])

  // Also handle OAuth callback: if the URL has token params, save them.
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const access = params.get("accessToken")
    const refresh = params.get("refreshToken")
    const expiresIn = params.get("expiresIn")
    if (access && refresh && expiresIn) {
      const tokens: TokenResponse = {
        accessToken: access,
        refreshToken: refresh,
        expiresIn: Number(expiresIn),
      }
      saveTokens(tokens)
      setToken(access)
      // Strip the token params from the URL first so this effect doesn't
      // re-fire on every render, then send the user back to the home page.
      window.history.replaceState({}, "", window.location.pathname)
      if (window.location.pathname !== "/") router.replace("/")
      fetchUser(access)
    }
  }, [fetchUser, router])

  const login = useCallback(
    async (tokens: TokenResponse) => {
      saveTokens(tokens)
      setToken(tokens.accessToken)
      await fetchUser(tokens.accessToken)
    },
    [fetchUser]
  )

  const logout = useCallback(async () => {
    const t = getAccessToken()
    if (t) await authLogout(t)
    setToken(null)
    setUser(null)
  }, [])

  const reloadUser = useCallback(async () => {
    const t = token ?? (await getValidToken())
    if (t) await fetchUser(t)
  }, [token, fetchUser])

  const value = useMemo(
    () => ({ user, token, loading, login, logout, reloadUser }),
    [user, token, loading, login, logout, reloadUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
