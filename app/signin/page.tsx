import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to manage your badge styles, items, and payments.",
}

// Auth is OAuth-based (backend redirects); this page is UI-only for now.
const PROVIDERS = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
]

export default function SignInPage() {
  return (
    <PageShell
      title="Sign in"
      intro="Sign in to save badge styles, buy items, and see your view stats."
    >
      <div className="card" style={{ maxWidth: 380, gap: 10 }}>
        {PROVIDERS.map((p) => (
          <button key={p.id} type="button" className="btn" disabled>
            {p.label}
          </button>
        ))}
        <p className="state" style={{ padding: "8px 0 0", fontSize: 12.5 }}>
          Social login is coming soon.
        </p>
      </div>
    </PageShell>
  )
}
