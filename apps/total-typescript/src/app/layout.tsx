import * as React from 'react'
import config from '@/config'
import {Providers} from '@/app/_components/providers'
import '@/styles/globals.css'
import {larsseit} from '@/utils/load-fonts'
import {TRPCReactProvider} from '@/trpc/trpc.client'
import {headers} from 'next/headers'
// import {AxiomWebVitals} from 'next-axiom'
// import Navigation from '@/components/app/navigation'

export const metadata = {
  title: config.title,
  description: config.description,
  icons: [{rel: 'icon', url: '/favicon.ico'}],
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <Providers>
      <html lang="en" className="light antialiased">
        {/* <AxiomWebVitals /> */}
        <body id="layout" className={`relative font-sans ${larsseit.variable}`}>
          {/* <Party /> */}
          <TRPCReactProvider headers={headers()}>
            {/* <Navigation /> */}
            <main className="flex h-full min-h-screen flex-grow flex-col">
              {children}
            </main>
          </TRPCReactProvider>
        </body>
      </html>
    </Providers>
  )
}
