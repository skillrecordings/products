import {ThemeProvider} from '@/components/app/theme-provider'
import '@/styles/globals.css'
import {Inter} from 'next/font/google'

export const metadata = {
  title: 'Epic React',
  description: 'This is Epic React',
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
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <script
          async
          src="https://cursor-party.skillrecordings.partykit.dev/cursors.js"
        ></script>
      </body>
    </html>
  )
}
