import * as React from 'react'
import {Suspense} from 'react'
import {AxiomWebVitals} from 'next-axiom'
import config from '@/config'
import {Providers} from '@/app/_components/providers'
import '@/styles/globals.css'
import {larsseit, magnatHead, magnatText} from '@/utils/load-fonts'
import {TRPCReactProvider} from '@/trpc/trpc.client'
import {headers} from 'next/headers'
import Navigation from '@/components/app/navigation'

export const metadata = {
  title: config.title,
  description: config.description,
  icons: [{rel: 'icon', url: '/favicon.ico'}],
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <Providers>
      <html lang="en" suppressHydrationWarning={true}>
        <AxiomWebVitals />
        <body
          id="layout"
          className={`relative font-sans ${larsseit.variable} ${magnatHead.variable} ${magnatText.variable}`}
        >
          <TRPCReactProvider headers={headers()}>
            {/* <Party /> */}
            <Navigation />
            <main className="flex-co flex h-full min-h-screen flex-grow">
              {children}
            </main>
          </TRPCReactProvider>
        </body>
      </html>
    </Providers>
  )
}
