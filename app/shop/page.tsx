import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { apiGet } from "@/lib/api"
import type { ShopItem } from "@/lib/types"

export const metadata: Metadata = {
  title: "Shop",
  description: "Premium badge styles and items for your profile.",
}

export const dynamic = "force-dynamic"

function formatKrw(n: number): string {
  return "₩" + n.toLocaleString("ko-KR")
}

async function getItems(): Promise<ShopItem[] | null> {
  try {
    return await apiGet<ShopItem[]>("/api/shop/items")
  } catch {
    return null
  }
}

export default async function ShopPage() {
  const items = await getItems()

  return (
    <PageShell
      title="Shop"
      intro="Unlock premium badge styles and items. Buy once, use them anywhere."
    >
      {items === null ? (
        <p className="state">Couldn&apos;t load the shop right now. Please try again later.</p>
      ) : items.length === 0 ? (
        <p className="state">No items available yet.</p>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <Link className="card" href={`/shop/${item.id}`} key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="price">{formatKrw(item.priceKrw)}</div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  )
}
