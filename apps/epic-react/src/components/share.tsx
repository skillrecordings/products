import * as React from 'react'
import {HeartIcon} from '@heroicons/react/solid'
import {
  Twitter,
  LinkedIn,
  Reddit,
  Facebook,
  CopyToClipboard,
} from '@skillrecordings/react'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {cn} from '@skillrecordings/ui/utils/cn'

const Share: React.FC<{
  title: string
  contentType?: string
  children?: React.ReactNode
  shareButtonClassName?: string
  className?: string
}> = ({
  title,
  contentType = 'article',
  children,
  shareButtonClassName = 'w-full flex items-center justify-center h-full px-7 py-7 dark:hover:bg-white/5 hover:bg-gray-900/5 transition',
  className,
}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath

  return (
    <section
      className={cn(
        'mx-auto flex w-full max-w-screen-md items-center justify-center overflow-hidden border border-gray-200 bg-transparent pt-5 dark:border-white/10 sm:pl-5 sm:pt-0 md:rounded-lg',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-screen-md flex-col items-center justify-between gap-5 sm:flex-row">
        {children ? (
          children
        ) : (
          <div>
            <p className="flex items-center text-lg font-medium">
              <HeartIcon
                aria-hidden="true"
                className="mr-2 inline-block h-5 w-5 flex-shrink-0 text-rose-400/90"
              />
              <span className="leading-tight">
                Share this {contentType} with your friends
              </span>
            </p>
          </div>
        )}
        <div className="flex w-full items-center justify-center divide-x divide-gray-200 border-t border-gray-200 pt-0 dark:divide-white/10 dark:border-white/10 sm:w-auto sm:border-t-0 md:border-transparent">
          <Twitter
            className={shareButtonClassName}
            svgClassName="w-4 h-4"
            link={url}
            message={`${title} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`}
          />
          <Facebook
            className={shareButtonClassName}
            svgClassName="w-4 h-4"
            link={url}
          />
          <LinkedIn
            className={shareButtonClassName}
            svgClassName="w-4 h-4"
            link={url}
          />
          <Reddit
            className={shareButtonClassName}
            svgClassName="w-4 h-4"
            link={url}
          />
          <CopyToClipboard
            className={shareButtonClassName}
            onSuccess={() => {
              toast.success('Copied to clipboard')
            }}
            svgClassName="w-4 h-4"
            link={url}
          />
        </div>
      </div>
    </section>
  )
}

export default Share
