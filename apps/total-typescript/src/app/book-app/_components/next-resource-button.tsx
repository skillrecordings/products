'use client'
import React from 'react'
import {cn} from '@skillrecordings/ui/utils/cn'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

export const NextResourceButton = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{
    url?: string
    label?: string | null
    className?: string
  }>
>(({label, url, className}, ref) => {
  const pathname = usePathname()
  const isSolution = Boolean(pathname?.endsWith('/solution'))

  return url && label ? (
    <Link ref={ref as any} href={url} className={cn(className)}>
      {label}
    </Link>
  ) : null
})
