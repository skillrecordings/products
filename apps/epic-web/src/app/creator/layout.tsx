import React from 'react'

const CreatorLayout = async ({children}: {children: React.ReactNode}) => {
  return <main className="mx-auto w-full max-w-2xl px-5 py-16">{children}</main>
}

export default CreatorLayout
