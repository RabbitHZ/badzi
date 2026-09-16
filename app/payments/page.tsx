"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { useAuth } from "@/contexts/auth-context"
import { apiGet } from "@/lib/api"
import type { Payment } from "@/lib/types"

function formatKrw(n: number): string {
  return "₩" + n.toLocaleString("ko-KR")
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const STATUS_LABEL: Record<string, string> = {
  PAID: "결제 완료",
  PENDING: "처리 중",
  CANCELLED: "취소됨",
  FAILED: "실패",
}

function StatusChip({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PAID: "#4ade80",
    PENDING: "#facc15",
    CANCELLED: "#8b949e",
    FAILED: "#f87171",
  }
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 20,
        background: `${colors[status] ?? colors.PENDING}22`,
        color: colors[status] ?? colors.PENDING,
        border: `1px solid ${colors[status] ?? colors.PENDING}55`,
      }}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

export default function PaymentsPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()

  const [payments, setPayments] = useState<Payment[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace("/signin")
  }, [user, authLoading, router])

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<Payment[]>("/api/payments", { token })
      setPayments(data)
    } catch {
      setError("결제 내역을 불러오지 못했습니다.")
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user && token) load()
  }, [user, token, load])

  if (authLoading || (!user && !authLoading)) {
    return (
      <PageShell title="결제 내역">
        <p className="state">Loading…</p>
      </PageShell>
    )
  }

  return (
    <PageShell title="결제 내역" intro="구매한 아이템의 결제 내역을 확인합니다.">
      {loading && <p className="state">Loading…</p>}
      {error && <p className="state">{error}</p>}

      {!loading && !error && payments !== null && payments.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
          <p className="state" style={{ padding: "20px 0 4px" }}>
            아직 결제 내역이 없습니다.
          </p>
          <Link href="/shop" className="btn" style={{ maxWidth: 140 }}>
            Shop 둘러보기
          </Link>
        </div>
      )}

      {!loading && payments && payments.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
          {payments.map((p) => (
            <PaymentRow key={p.id} payment={p} />
          ))}
        </div>
      )}
    </PageShell>
  )
}

function PaymentRow({ payment }: { payment: Payment }) {
  return (
    <div
      className="card"
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "monospace" }}>
          {payment.orderNo}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>{formatKrw(payment.amountKrw)}</span>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>
          {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
        </span>
      </div>
      <StatusChip status={payment.status} />
    </div>
  )
}
