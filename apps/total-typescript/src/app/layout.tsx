import Fonts from 'utils/fonts'
import '../styles/globals.css'
import ClientLayoutWrapper from './client-layout-wrapper'
import {getServerSession} from 'next-auth'
import {nextAuthOptions} from 'lib/nextAuthOptions'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const serverSession = await getServerSession(nextAuthOptions)
  return (
    <html lang="en">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for TotalTypeScript.com"
          href="/rss.xml"
        />
        <Fonts />
      </head>
      <body className="bg-gray-900 text-white antialiased">
        <ClientLayoutWrapper session={serverSession}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  )
}
