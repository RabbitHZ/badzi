import type { Metadata } from "next"
import { StylesPageClient } from "./styles-client"

export const metadata: Metadata = {
  title: "Styles",
  description: "Browse badge styles you can drop into any README.",
}

export default function StylesPage() {
  return <StylesPageClient />
}
