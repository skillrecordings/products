import React from 'react'
import 'styles/globals.css'
import {DM_Sans, JetBrains_Mono} from '@next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  weight: ['400', '500', '700'],
})
const jetBransMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrainsmono',
})

const RootLayout: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${jetBransMono.variable} font-sans text-gray-800 antialiased dark:text-gray-200`}
      >
        {children}
      </body>
    </html>
  )
}

export default RootLayout
