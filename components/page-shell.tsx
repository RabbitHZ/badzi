import type { ReactNode } from "react"
import { SiteHeader } from "./site-header"
import "./badzi-landing.css"
import "./page-shell.css"

// Shared chrome for every nav page: dark canvas + top navigation + a
// centered content column. Keeps the pages visually aligned with the
// landing hero without duplicating the header.
export function PageShell({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <div className="badzi">
      <div className="page">
        <SiteHeader />
        <main className="page-main">
          <header className="page-head">
            <h1 className="page-title">{title}</h1>
            {intro && <p className="page-intro">{intro}</p>}
          </header>
          {children}
        </main>
      </div>
    </div>
  )
}
