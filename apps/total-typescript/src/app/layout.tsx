import * as React from 'react'
import config from '@/config'
import {Providers} from '@/app/_components/providers'
import '@/styles/globals.css'
import {larsseit, magnatHead, magnatText} from '@/utils/load-fonts'
import {TRPCReactProvider} from '@/trpc/trpc.client'
import {headers} from 'next/headers'
// import {AxiomWebVitals} from 'next-axiom'
import Navigation from '@/components/app/navigation'

export const metadata = {
  title: config.title,
  description: config.description,
  icons: [{rel: 'icon', url: '/favicon.ico'}],
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const headersList = await headers()

  return (
    <Providers>
      <html lang="en" className="dark antialiased">
        {/* <AxiomWebVitals /> */}
        <body
          id="layout"
          className={`relative font-sans ${larsseit.variable} ${magnatHead.variable} ${magnatText.variable}`}
        >
          {/* <Party /> */}
          <TRPCReactProvider headers={headersList}>
            <Navigation />
            <main className="flex h-full min-h-screen flex-grow flex-col">
              {children}
            </main>
          </TRPCReactProvider>
        </body>
      </html>
    </Providers>
  )
}
