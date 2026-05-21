import React from 'react'
import 'styles/globals.css'
import {TRPCReactProvider} from 'trpc/trpc.client'
import {headers} from 'next/headers'
import {Providers} from './_components/providers'

const RootLayout = async ({children}: React.PropsWithChildren) => {
  const headersList = await headers()

  return (
    <Providers>
      <html lang="en">
        <body
          className={`font-sans text-gray-800 antialiased dark:text-gray-200`}
        >
          <TRPCReactProvider headers={headersList}>{children}</TRPCReactProvider>
        </body>
      </html>
    </Providers>
  )
}

export default RootLayout
