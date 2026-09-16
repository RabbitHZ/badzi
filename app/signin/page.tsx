"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { useAuth } from "@/contexts/auth-context"
import { getOAuthUrl } from "@/lib/auth"

const PROVIDERS: { id: "google" | "github"; label: string }[] = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
]

export default function SignInPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Already signed in — redirect to profile.
  useEffect(() => {
    if (!loading && user) router.replace("/profile")
  }, [user, loading, router])

  function handleSignIn(provider: "google" | "github") {
    window.location.href = getOAuthUrl(provider)
  }

  return (
    <PageShell
      title="Sign in"
      intro="Sign in to save badge styles, buy items, and see your view stats."
    >
      <div className="card" style={{ maxWidth: 380, gap: 10 }}>
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="btn btn-primary"
            onClick={() => handleSignIn(p.id)}
            disabled={loading}
          >
            {p.label}
          </button>
        ))}
        <p className="state" style={{ padding: "8px 0 0", fontSize: 12.5 }}>
          OAuth login — redirects to the backend provider flow.
        </p>
      </div>
    </PageShell>
  )
}
