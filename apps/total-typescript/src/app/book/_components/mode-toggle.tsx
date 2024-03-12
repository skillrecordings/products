'use client'

import type {ReadonlyRequestCookies} from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import React from 'react'
import {useCookies} from 'react-cookie'
import {useRouter} from 'next/navigation'

const ModeToggle = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{
    mode: 'video' | 'book'
  }>
>(({children, mode, ...props}, ref) => {
  const [cookies, setCookie] = useCookies(['bookPrefs'])
  const router = useRouter()

  return (
    <>
      <button
        ref={ref}
        {...props}
        onClick={() => {
          setCookie(
            'bookPrefs',
            {
              ...cookies.bookPrefs,
              mode: mode === 'book' ? 'video' : 'book',
            },
            {
              path: '/',
            },
          )
          return router.refresh()
        }}
      >
        {children}
      </button>
    </>
  )
})

export default ModeToggle
