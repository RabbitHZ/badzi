import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"
import { apiGet } from "@/lib/api"
import type { ShopItem } from "@/lib/types"
import { ShopList } from "./shop-client"

export const metadata: Metadata = {
  title: "Shop",
  description: "Premium badge styles and items for your profile.",
}

export const dynamic = "force-dynamic"

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
      <ShopList items={items} />
    </PageShell>
  )
}
