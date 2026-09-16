"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { apiGet, apiMutate } from "@/lib/api"
import type { CreatePaymentResponse, ShopItem, UserItem } from "@/lib/types"

function formatKrw(n: number): string {
  return "₩" + n.toLocaleString("ko-KR")
}

export function ShopDetailActions({ item }: { item: ShopItem }) {
  const { user, token } = useAuth()
  const router = useRouter()

  const [owned, setOwned] = useState<boolean | null>(null)
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !token) return
    apiGet<UserItem[]>("/api/users/me/items", { token })
      .then((userItems) => {
        setOwned(userItems.some((ui) => ui.shopItem.id === item.id))
      })
      .catch(() => setOwned(false))
  }, [user, token, item.id])

  async function handleBuy() {
    if (!token) {
      router.push("/signin")
      return
    }
    setBuying(true)
    setBuyError(null)
    try {
      const result = await apiMutate<CreatePaymentResponse>(
        "POST",
        "/api/payments",
        { shopItemId: item.id },
        { token }
      )
      // Redirect to the external payment provider URL.
      window.location.href = result.paymentUrl
    } catch {
      setBuyError("결제 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.")
      setBuying(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <div className="price">{formatKrw(item.priceKrw)}</div>

      {owned === true ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="owned-badge owned-badge--lg">Owned</span>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>
            이미 보유 중인 아이템입니다.
          </span>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleBuy}
            disabled={buying}
          >
            {buying ? "결제 요청 중…" : user ? `구매 · ${formatKrw(item.priceKrw)}` : "로그인 후 구매"}
          </button>
          {buyError && (
            <p style={{ margin: 0, fontSize: 13, color: "#f87171" }}>{buyError}</p>
          )}
          {!user && (
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
              구매하려면{" "}
              <Link href="/signin" style={{ color: "var(--text)" }}>
                로그인
              </Link>
              이 필요합니다.
            </p>
          )}
        </>
      )}

      <Link href="/shop" className="btn">
        ← Back to Shop
      </Link>
    </div>
  )
}
