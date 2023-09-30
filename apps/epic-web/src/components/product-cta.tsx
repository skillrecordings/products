import {Button} from '@skillrecordings/ui'
import {Product} from 'lib/products'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {motion} from 'framer-motion'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useCursorPosition} from 'hooks/use-cursor-position'
import {isFirefox} from 'react-device-detect'
import {isSellingLive} from '@skillrecordings/skill-lesson/utils/is-selling-live'

const ProductCTA: React.FC<{product: Product; className?: string}> = ({
  product,
  className = '',
}) => {
  const {image, title} = product
  const ref = React.useRef(null)
  const {x, y, handleMouseMove} = useCursorPosition({parentRef: ref})
  const withEffect = !isFirefox
  return (
    <Link href={`/products/${product.slug}`} className={className}>
      <div
        ref={ref}
        onMouseMove={withEffect ? handleMouseMove : () => {}}
        className="relative flex flex-row items-center justify-center gap-5 overflow-hidden rounded-md bg-gradient-to-tr from-sky-500 to-blue-500 p-5 before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:content-[''] dark:from-gray-900 dark:to-gray-800"
      >
        <div className="absolute -left-3.5 h-6 w-6 rounded-full bg-background" />
        <div className="absolute -right-3.5 h-6 w-6 rounded-full bg-background" />
        <motion.div
          style={withEffect ? {x, y} : {}}
          className={cn(
            'pointer-events-none absolute left-0 top-0 z-10 -ml-20 -mt-20 h-40 w-40 rounded-full bg-white mix-blend-overlay blur-[150px]',
            {
              hidden: !withEffect,
            },
          )}
          aria-hidden
        />
        {image?.url && (
          <Image
            src={image.url}
            alt={title || ''}
            width={100}
            height={100}
            priority
          />
        )}
        <div className="flex flex-col items-start">
          <div className="mb-1 rounded-full font-mono text-xs font-semibold uppercase tracking-wide text-white dark:text-blue-200">
            <span className="dark:drop-shadow-md">{title}</span>
          </div>
          <p className="text-2xl font-semibold leading-tight text-white">
            {isSellingLive ? 'Out Now!' : 'Coming Soon'}
          </p>
          {isSellingLive ? (
            <Button
              asChild
              className="relative mt-5 cursor-pointer bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 text-sm font-semibold shadow-sm transition hover:brightness-110"
              size="sm"
            >
              <span className="drop-shadow-md">Get Access Today</span>
            </Button>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export {ProductCTA}
