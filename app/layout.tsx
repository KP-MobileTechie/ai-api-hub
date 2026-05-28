import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI API Hub',
  description: 'Live-tested directory of AI and LLM APIs. Free tiers highlighted. Code snippets included.',
  openGraph: {
    title: 'AI API Hub',
    description: 'Find the right AI API, fast. Live-tested every day.',
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
