import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'apiHub · Live AI API Directory',
  description: 'The only AI API directory that health-checks every API daily. Free tiers highlighted, code snippets included.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'apiHub · Live AI API Directory',
    description: 'Find the right AI API, fast. Live-tested every day. Free tiers first.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-orbs" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        {children}
      </body>
    </html>
  )
}
