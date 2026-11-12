import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import '../styles/globals.css'
import { AppearanceProvider } from '@/components/appearances/AppearanceProvider'
import SiteShell from '@/components/site/SiteShell'

export const metadata: Metadata = {
  title: 'Daniel Franzese | Actor, Comedian & Activist',
  description: 'Explore Daniel Franzese’s work, videos, press materials, and booking information.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/optimized/InterVariable.subset.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/optimized/Anton-Regular.subset.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.jsEnabled='true'" }} />
      </head>
      <body>
        <AppearanceProvider>
          <SiteShell>{children}</SiteShell>
        </AppearanceProvider>
        <Analytics />
      </body>
    </html>
  )
}
