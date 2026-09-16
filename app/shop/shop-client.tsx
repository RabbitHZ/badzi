"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { apiGet } from "@/lib/api"
import type { ShopItem, UserItem } from "@/lib/types"

function formatKrw(n: number): string {
  return "₩" + n.toLocaleString("ko-KR")
}

export function ShopList({ items }: { items: ShopItem[] | null }) {
  const { user, token } = useAuth()
  const [ownedIds, setOwnedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!user || !token) return
    apiGet<UserItem[]>("/api/users/me/items", { token })
      .then((userItems) => {
        setOwnedIds(new Set(userItems.map((ui) => ui.shopItem.id)))
      })
      .catch(() => {}) // non-critical — just hide the badge
  }, [user, token])

  if (items === null) {
    return (
      <p className="state">Couldn&apos;t load the shop right now. Please try again later.</p>
    )
  }
  if (items.length === 0) {
    return <p className="state">No items available yet.</p>
  }

  return (
    <div className="card-grid">
      {items.map((item) => (
        <Link className="card" href={`/shop/${item.id}`} key={item.id} style={{ position: "relative" }}>
          {ownedIds.has(item.id) && (
            <span className="owned-badge">Owned</span>
          )}
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <div className="price">{formatKrw(item.priceKrw)}</div>
        </Link>
      ))}
    </div>
  )
}
