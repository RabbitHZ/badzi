import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"
import { badgeUrl } from "@/lib/api"

export const metadata: Metadata = {
  title: "Styles",
  description: "Browse badge styles you can drop into any README.",
}

// Preset showcase styles rendered straight from the badge server.
const PRESETS = [
  { label: "Views", color: "007EC6", styleType: "default" },
  { label: "Downloads", color: "4C1", styleType: "default" },
  { label: "Stars", color: "DFB317", styleType: "default" },
  { label: "Build", color: "E05D44", styleType: "default" },
  { label: "Maple", color: "FF9500", styleType: "maple" },
  { label: "Rabbit", color: "ED87B8", styleType: "rabbit" },
]

export default function StylesPage() {
  return (
    <PageShell
      title="Styles"
      intro="Pick a look for your badge. Presets are free — unlock premium styles like Maple and Rabbit in the Shop."
    >
      <div className="card-grid">
        {PRESETS.map((s) => (
          <div className="card" key={s.label + s.styleType}>
            <div className="card-badge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={badgeUrl(
                  { url: "username", label: s.label, color: s.color, styleType: s.styleType },
                  true
                )}
                alt={`${s.label} badge`}
                height={28}
              />
            </div>
            <h3>{s.label}</h3>
            <p>styleType: {s.styleType}</p>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
