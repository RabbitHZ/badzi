"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getOAuthUrl } from "@/lib/auth"
import "@/components/badzi-landing.css"
import "./signin.css"
import "./signin-font.css"

const PROVIDERS: { id: "google" | "github"; label: string }[] = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
]

function ProviderIcon({ provider }: { provider: "google" | "github" }) {
  if (provider === "github") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.54 1.04 1.54 1.04.9 1.54 2.35 1.1 2.92.84.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.9.68 1.82v2.7c0 .26.18.57.69.48A10 10 0 0 0 12 2Z" /></svg>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.35 12.2c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.52h3.15c1.84-1.69 2.9-4.18 2.9-7.29Z"/><path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.15-2.52c-.87.59-1.99.94-3.3.94-2.54 0-4.7-1.72-5.47-4.02H3.28v2.6A9.74 9.74 0 0 0 12 21.7Z"/><path fill="#FBBC05" d="M6.53 13.74A5.85 5.85 0 0 1 6.22 12c0-.6.1-1.18.31-1.74v-2.6H3.28A9.7 9.7 0 0 0 2.3 12c0 1.56.37 3.04.98 4.34l3.25-2.6Z"/><path fill="#EA4335" d="M12 6.24c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.33 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.72 5.36l3.25 2.6C7.3 7.96 9.46 6.24 12 6.24Z"/></svg>
}

export function SignInCard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Already signed in — redirect to profile.
  useEffect(() => {
    if (!loading && user) router.replace("/profile")
  }, [user, loading, router])

  function handleSignIn(provider: "google" | "github") {
    window.location.href = getOAuthUrl(provider)
  }

  return <main className="badzi signin-screen">
    <header className="topbar signin-topbar"><Link href="/" className="mark"><i>B</i>Badzi</Link></header>
    <section className="signin-panel" aria-labelledby="signin-title">
      <div className="signin-story"><span className="signin-kicker">Badzi account</span><h1>Your README,<br />in motion.</h1><p>Sign in to keep your styles, purchases, and view history in one place.</p><div className="signin-badge-demo"><span>Views</span><b>1.2k</b></div></div>
      <div className="signin-actions"><div><h2 id="signin-title">Welcome back</h2><p>Continue with a connected account.</p></div><div className="oauth-buttons">{PROVIDERS.map((p) => <button key={p.id} type="button" onClick={() => handleSignIn(p.id)} disabled={loading}><ProviderIcon provider={p.id} />{p.label}</button>)}</div><p className="signin-note">We only use Google and GitHub to sign you in. No password required.</p></div>
    </section>
  </main>
}
