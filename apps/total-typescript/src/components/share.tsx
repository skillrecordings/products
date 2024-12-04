import {HeartIcon} from '@heroicons/react/solid'
import {
  Twitter,
  LinkedIn,
  Reddit,
  Bluesky,
  CopyToClipboard,
} from '@skillrecordings/react'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'

const Share: React.FC<{
  title: string
  withTitle?: boolean
  contentType?: string
  query?: Record<string, string>
  className?: string
  shareButtonClassName?: string
}> = ({
  title,
  withTitle = true,
  shareButtonClassName = 'p-4 hover:scale-105 transition hover:text-gray-100 text-gray-400',
  contentType = 'article',
  query,
  className,
}) => {
  const router = useRouter()
  const queryParams = query ? new URLSearchParams(query).toString() : ''
  const url =
    process.env.NEXT_PUBLIC_URL +
    router.asPath +
    `${queryParams ? `?${queryParams}` : ''}`

  const shareButtonSvgClassName = 'w-5 h-5'

  return (
    <div
      className={cn(
        'mx-auto mt-16 flex w-full max-w-3xl flex-col items-center justify-center gap-2 pb-10 text-center',
        className,
      )}
    >
      {withTitle && (
        <p className="flex items-center text-gray-400">
          {title ? title : `Share this ${contentType} with your friends`}
        </p>
      )}
      <div className="flex">
        <Bluesky
          svgClassName={shareButtonSvgClassName}
          className={shareButtonClassName}
          link={`${title} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}\n\n ${url}`}
        />
        <Twitter
          svgClassName={shareButtonSvgClassName}
          className={shareButtonClassName}
          link={url}
          message={`${title} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`}
        />
        <LinkedIn
          className={shareButtonClassName}
          svgClassName={shareButtonSvgClassName}
          link={url}
        />
        <Reddit
          className={shareButtonClassName}
          link={url}
          svgClassName={shareButtonSvgClassName}
        />
        <CopyToClipboard
          svgClassName={shareButtonSvgClassName}
          className={shareButtonClassName}
          onSuccess={() => {
            toast.success('Copied to clipboard')
          }}
          link={url}
        />
      </div>
    </div>
  )
}

export default Share
