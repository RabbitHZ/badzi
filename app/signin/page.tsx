import type { Metadata } from "next"
import { SignInCard } from "./signin-client"

// A "use client" page cannot export metadata, so the interactive part lives in
// signin-client.tsx and this server component owns the title.
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to save badge styles, buy items, and see your view stats.",
}

export default function SignInPage() {
  return <SignInCard />
}
