"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace("/signin")
  }, [user, loading, router])

  async function handleLogout() {
    await logout()
    router.push("/")
  }

  if (loading) {
    return (
      <PageShell title="Profile">
        <p className="state">Loading…</p>
      </PageShell>
    )
  }

  if (!user) return null

  return (
    <PageShell title="Profile" intro="Your account details and session info.">
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 480 }}>
        <div className="card" style={{ gap: 14 }}>
          <Row label="Name" value={user.name} />
          <Row label="Username" value={user.username} />
          <Row label="Email" value={user.email} />
          <Row label="Provider" value={user.provider} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/payments" className="btn">
            결제 내역
          </Link>
          <button type="button" className="btn" onClick={handleLogout} style={{ maxWidth: 160 }}>
            Sign out
          </button>
        </div>
      </div>
    </PageShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
      <span style={{ minWidth: 90, fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
        {label}
      </span>
      <span style={{ fontSize: 15 }}>{value}</span>
    </div>
  )
}
