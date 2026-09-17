"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
export type Locale = "en" | "ko"
const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void } | null>(null)
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")
  useEffect(() => { const saved = localStorage.getItem("badzi_locale"); if (saved === "ko" || saved === "en") setLocale(saved) }, [])
  useEffect(() => { localStorage.setItem("badzi_locale", locale); document.documentElement.lang = locale }, [locale])
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
}
export function useLocale() { const value = useContext(LocaleContext); if (!value) throw new Error("useLocale must be used inside LocaleProvider"); return value }
