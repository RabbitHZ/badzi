import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { API_BASE } from "@/lib/api"

export const metadata: Metadata = {
  title: "Docs",
  description: "How to add a Badzi badge to your README, plus the API reference.",
}

const ENDPOINTS = [
  { method: "GET", path: "/api/badges", desc: "Generate a badge" },
  { method: "GET", path: "/api/badges/preview", desc: "Preview a badge" },
  { method: "GET", path: "/api/shop/items", desc: "List shop items" },
  { method: "GET", path: "/api/badge-styles", desc: "My badge styles (auth)" },
  { method: "GET", path: "/api/viewcounts/{username}", desc: "Read view counts" },
]

export default function DocsPage() {
  const example = `![Views](${API_BASE}/api/badges?url=username&label=Views&color=007EC6&styleType=default)`

  return (
    <PageShell
      title="Docs"
      intro="Add a live badge to your README in one line, then explore the full API."
    >
      <section style={{ maxWidth: 720 }}>
        <h2 style={{ fontSize: 20, margin: "0 0 8px" }}>Quickstart</h2>
        <p className="state" style={{ padding: "0 0 12px" }}>
          Create a badge on the home page, copy the markdown, and paste it into your README:
        </p>
        <pre
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: "14px 16px",
            fontSize: 12.5,
            overflowX: "auto",
          }}
        >
          {example}
        </pre>

        <h2 style={{ fontSize: 20, margin: "32px 0 12px" }}>API reference</h2>
        <div className="card" style={{ gap: 8 }}>
          {ENDPOINTS.map((e) => (
            <div key={e.path} style={{ display: "flex", gap: 10, fontSize: 13.5 }}>
              <code style={{ color: "var(--muted)", minWidth: 44 }}>{e.method}</code>
              <code style={{ minWidth: 220 }}>{e.path}</code>
              <span style={{ color: "var(--muted)" }}>{e.desc}</span>
            </div>
          ))}
        </div>
        <p className="state">
          Full interactive spec:{" "}
          <Link
            href={`${API_BASE}/swagger-ui/index.html`}
            className="btn"
            style={{ marginLeft: 6 }}
          >
            Open Swagger UI
          </Link>
        </p>
      </section>
    </PageShell>
  )
}
