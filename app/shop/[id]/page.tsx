import Link from "next/link"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { apiGet } from "@/lib/api"
import type { ShopItem } from "@/lib/types"

export const dynamic = "force-dynamic"

function formatKrw(n: number): string {
  return "₩" + n.toLocaleString("ko-KR")
}

async function getItem(id: string): Promise<ShopItem | null> {
  try {
    return await apiGet<ShopItem>(`/api/shop/items/${id}`)
  } catch {
    return null
  }
}

export default async function ShopItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getItem(id)
  if (!item) notFound()

  return (
    <PageShell title={item.name} intro={item.description}>
      <div className="card" style={{ maxWidth: 420 }}>
        <div className="price">{formatKrw(item.priceKrw)}</div>
        {/* Purchase is UI-only for now — real payment flow is a later phase. */}
        <button type="button" className="btn btn-primary" disabled>
          Buy (coming soon)
        </button>
        <Link href="/shop" className="btn">
          ← Back to Shop
        </Link>
      </div>
    </PageShell>
  )
}
