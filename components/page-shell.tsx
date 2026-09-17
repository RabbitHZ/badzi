"use client"

import type { ReactNode } from "react"
import { SiteHeader } from "./site-header"
import { useLocale } from "@/contexts/locale-context"
import "./badzi-landing.css"
import "./page-shell.css"

// Shared chrome for every nav page: dark canvas + top navigation + a
// centered content column. Keeps the pages visually aligned with the
// landing hero without duplicating the header.
export function PageShell({
  title,
  intro,
  children,
  // Set when title/intro come from the backend in another language (the shop
  // serves Korean copy) so assistive tech announces them correctly.
  headLang,
}: {
  title: string
  intro?: string
  children: ReactNode
  headLang?: string
}) {
  const { locale } = useLocale()
  const pageText: Record<string, [string, string]> = {
    Styles: ["스타일", "나에게 맞는 뱃지 스타일을 살펴보세요."],
    Shop: ["상점", "프리미엄 뱃지 스타일과 아이템을 둘러보세요."],
    Pricing: ["요금제", "무료 프리셋과 프리미엄 스타일을 확인하세요."],
    Docs: ["문서", "Badzi 뱃지를 README에 추가하는 방법을 확인하세요."],
  }
  const translated = locale === "ko" ? pageText[title] : undefined
  return (
    <div className="badzi">
      <div className="page">
        <SiteHeader />
        <main className="page-main">
          <header className="page-head">
            <h1 className="page-title" lang={translated ? "ko" : headLang}>
              {translated?.[0] || title}
            </h1>
            {intro && (
              <p className="page-intro" lang={translated ? "ko" : headLang}>
                {translated?.[1] || intro}
              </p>
            )}
          </header>
          {children}
        </main>
      </div>
    </div>
  )
}
