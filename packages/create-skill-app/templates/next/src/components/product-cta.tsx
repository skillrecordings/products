import {Button} from '@skillrecordings/ui'
import {Product} from '@/lib/products'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCTA: React.FC<{
  product?: Product
  className?: string
  restricted?: boolean
}> = ({product, className = '', restricted = false}) => {
  const {image, title} = product || {}
  const ref = React.useRef(null)

  const Comp: React.FC<React.PropsWithChildren> = ({children}) => {
    if (product?.state === 'active') {
      return (
        <Link
          href={restricted ? `/products/${product?.slug}` : `/buy`}
          className={className}
        >
          {children}
        </Link>
      )
    } else {
      return <div className={className}>{children}</div>
    }
  }
  return (
    <Comp>
      <div
        ref={ref}
        className="relative flex flex-row items-center justify-center gap-5 overflow-hidden rounded-md bg-gradient-to-tr from-sky-500 to-blue-500 p-5 before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:content-[''] dark:from-gray-900 dark:to-gray-800"
      >
        {image?.url && (
          <Image
            src={image.url}
            alt={title || ''}
            width={100}
            height={100}
            priority
            className="rounded-full"
          />
        )}
        <div className="flex flex-col items-start">
          <div className="mb-1 rounded-full font-mono text-xs font-semibold uppercase tracking-wide text-white dark:text-blue-200">
            <span className="dark:drop-shadow-md">{title}</span>
          </div>
          <p className="text-2xl font-semibold leading-tight text-white">
            {product?.state === 'active'
              ? restricted
                ? 'Your License is Region Restricted'
                : 'Out Now!'
              : 'Coming Soon'}
          </p>
          {product?.state === 'active' ? (
            <Button
              asChild
              className="relative mt-5 cursor-pointer bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 text-sm font-semibold shadow-sm transition hover:brightness-110"
              size="sm"
            >
              <span className="drop-shadow-md">
                {restricted ? 'Upgrade to full license' : 'Get Access Today'}
              </span>
            </Button>
          ) : null}
        </div>
      </div>
    </Comp>
  )
}

export {ProductCTA}
