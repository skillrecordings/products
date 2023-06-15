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

const CreatorLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div
      className={`${dmSans.variable} ${jetBransMono.variable} bg-gray-50 font-sans text-gray-800 antialiased dark:bg-gray-950 dark:text-gray-200`}
    >
      <main className="mx-auto w-full max-w-2xl px-5 py-16">{children}</main>
    </div>
  )
}

export default CreatorLayout
