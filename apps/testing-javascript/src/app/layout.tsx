import '@/styles/globals.css'
import {Inter} from 'next/font/google'

export const metadata = {
  title: 'Testing JavaScript',
  description: 'This is Testing JavaScript',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
})

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`relative ${inter.variable} font-sans text-text antialiased`}
      ></body>
    </html>
  )
}
