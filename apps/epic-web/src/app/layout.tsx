import React from 'react'
import 'styles/globals.css'

const RootLayout: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <html lang="en">
      <body
        className={`font-sans text-gray-800 antialiased dark:text-gray-200`}
      >
        {children}
      </body>
    </html>
  )
}

export default RootLayout
