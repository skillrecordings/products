import React from 'react'

const CreatorLayout: React.FC<React.PropsWithChildren> = ({children}) => {
  return <main className="mx-auto w-full max-w-2xl px-5 py-16">{children}</main>
}

export default CreatorLayout
