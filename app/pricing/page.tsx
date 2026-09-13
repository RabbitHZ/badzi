import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { apiGet } from "@/lib/api"
import type { ShopItem } from "@/lib/types"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free presets and premium badge styles — see what's included.",
}

export const dynamic = "force-dynamic"

function formatKrw(n: number): string {
  return "₩" + n.toLocaleString("ko-KR")
}

async function getItems(): Promise<ShopItem[]> {
  try {
    return await apiGet<ShopItem[]>("/api/shop/items")
  } catch {
    return []
  }
}

export default async function PricingPage() {
  const items = await getItems()

  return (
    <PageShell
      title="Pricing"
      intro="Start free with preset badges. Upgrade to premium styles whenever you want."
    >
      <div className="card-grid">
        <div className="card">
          <h3>Free</h3>
          <div className="price">₩0</div>
          <p>Preset badge styles, live view counters, and unlimited markdown copies.</p>
          <Link href="/styles" className="btn">
            Browse styles
          </Link>
        </div>

        {items.map((item) => (
          <div className="card" key={item.id}>
            <h3>{item.name}</h3>
            <div className="price">{formatKrw(item.priceKrw)}</div>
            <p>{item.description}</p>
            <Link href={`/shop/${item.id}`} className="btn btn-primary">
              View in Shop
            </Link>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
