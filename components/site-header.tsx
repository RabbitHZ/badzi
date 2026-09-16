"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Styles", href: "/styles" },
  { label: "Shop", href: "/shop" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
]

export function SiteHeader() {
  const { user, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="topbar">
      <Link href="/" className="mark" onClick={() => setMenuOpen(false)}>
        <i>B</i>Badzi
      </Link>

      {/* Desktop nav */}
      <nav className="topbar-nav-desktop">
        {NAV_LINKS.map((n) => (
          <Link href={n.href} key={n.href}>
            {n.label}
          </Link>
        ))}
        {!loading && user ? (
          <Link href="/profile" className="signin signin-profile">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt=""
                className="profile-avatar"
                referrerPolicy="no-referrer"
              />
            ) : null}
            {user.name || user.username}
          </Link>
        ) : (
          <Link href="/signin" className="signin">
            Sign in
          </Link>
        )}
      </nav>

      {/* Hamburger (mobile) */}
      <button
        type="button"
        className="topbar-hamburger"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="topbar-nav-mobile" onClick={() => setMenuOpen(false)}>
          {NAV_LINKS.map((n) => (
            <Link href={n.href} key={n.href}>
              {n.label}
            </Link>
          ))}
          {!loading && user ? (
            <Link href="/profile" className="signin signin-profile">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt=""
                  className="profile-avatar"
                  referrerPolicy="no-referrer"
                />
              ) : null}
              {user.name || user.username}
            </Link>
          ) : (
            <Link href="/signin" className="signin">
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}
