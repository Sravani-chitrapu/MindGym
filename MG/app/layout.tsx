import type { Metadata } from 'next'
import { Inter, Poppins, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GameProvider } from '@/context/game-context'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins' })
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-orbitron' })

export const metadata: Metadata = {
  title: 'MindGym - Train Your Brain',
  description: 'A premium brain training platform with engaging cognitive games to sharpen your mind.',
}

export const viewport = {
  themeColor: '#0F172A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} ${orbitron.variable} font-sans antialiased`}>
        <GameProvider>
          {children}
        </GameProvider>
        <Analytics />
      </body>
    </html>
  )
}
