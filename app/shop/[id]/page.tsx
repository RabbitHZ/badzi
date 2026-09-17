import { notFound } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { apiGet } from "@/lib/api"
import type { ShopItem } from "@/lib/types"
import { ShopDetailActions } from "./shop-detail-client"

export const dynamic = "force-dynamic"

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
    <PageShell title={item.name} intro={item.description} headLang="ko">
      <ShopDetailActions item={item} />
    </PageShell>
  )
}
