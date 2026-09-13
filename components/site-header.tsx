import Link from "next/link"

// Shared top navigation used by the landing page and every nav route.
// Labels and their target routes live here so links stay consistent.
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Styles", href: "/styles" },
  { label: "Shop", href: "/shop" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
]

export function SiteHeader() {
  return (
    <header className="topbar">
      <Link href="/" className="mark">
        <i>B</i>Badzi
      </Link>
      <nav>
        {NAV_LINKS.map((n) => (
          <Link href={n.href} key={n.href}>
            {n.label}
          </Link>
        ))}
        <Link href="/signin" className="signin">
          Sign in
        </Link>
      </nav>
    </header>
  )
}
