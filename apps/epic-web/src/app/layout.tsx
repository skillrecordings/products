import React from 'react'
import 'styles/globals.css'
import {TRPCReactProvider} from 'trpc/trpc.client'
import {headers} from 'next/headers'
import {Providers} from './_components/providers'
import {DM_Sans} from 'next/font/google'
import Navigation from './_components/navigation'

// If loading a variable font, you don't need to specify the font weight
const DMSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
})
const RootLayout: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <Providers>
      <TRPCReactProvider headers={headers()}>
        <html lang="en">
          <body
            className={`bg-background text-foreground antialiased ${DMSans.className}`}
          >
            <Navigation
              className="relative max-w-none"
              navigationContainerClassName="relative max-w-none"
            />
            {children}
          </body>
        </html>
      </TRPCReactProvider>
    </Providers>
  )
}

export default RootLayout
