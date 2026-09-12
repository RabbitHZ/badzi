import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://badzi.app'),
  title: {
    default: 'Badzi — GitHub README Badge & Profile View Counter',
    template: '%s · Badzi',
  },
  description:
    'Create live view-counter badges for your GitHub README and profile. Paste a URL, pick a style, and copy the markdown — no signup required.',
  alternates: {
    canonical: '/',
  },
  keywords: [
    'GitHub badge',
    'README badge',
    'profile views counter',
    'badge generator',
    'markdown badge',
    'shields badge',
    'GitHub profile',
    'view counter',
  ],
  applicationName: 'Badzi',
  authors: [{ name: 'Badzi' }],
  creator: 'Badzi',
  icons: {
    icon: '/logo_white.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'Badzi',
    url: 'https://badzi.app',
    title: 'Badzi — GitHub README Badge & Profile View Counter',
    description:
      'Create live view-counter badges for your GitHub README and profile. Paste a URL, pick a style, copy the markdown.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Badzi — GitHub README Badge & Profile View Counter',
    description:
      'Create live view-counter badges for your GitHub README and profile. Paste a URL, pick a style, copy the markdown.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
