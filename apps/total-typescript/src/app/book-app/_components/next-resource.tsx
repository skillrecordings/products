'use client'

import React, {use} from 'react'
import Link from 'next/link'
import {cn} from '@skillrecordings/ui/utils/cn'

type Props = {
  nextResourceLoader: Promise<{url: string | null; label: string | null}>
}

export const NextResourceLink: React.FC<
  React.PropsWithChildren<{
    nextResourceLoader: Promise<any>
    className?: string
  }>
> = ({nextResourceLoader, className, children}) => {
  const {url} = use(nextResourceLoader)

  return url ? (
    <Link href={url} className={cn(className)}>
      {children}
    </Link>
  ) : null
}

export const NextResourceTitle: React.FC<Omit<Props, 'className'>> = ({
  nextResourceLoader,
}) => {
  const {label} = use(nextResourceLoader)

  return label ? <>{label}</> : null
}
