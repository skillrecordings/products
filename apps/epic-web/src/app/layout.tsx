import React from 'react'
import 'styles/globals.css'
import {TRPCReactProvider} from 'trpc/trpc.client'
import {headers} from 'next/headers'
import {Providers} from './_components/providers'

const RootLayout: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <Providers>
      <html lang="en">
        <body
          className={`font-sans text-gray-800 antialiased dark:text-gray-200`}
        >
          <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
        </body>
      </html>
    </Providers>
  )
}

export default RootLayout
