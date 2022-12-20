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

const Share: React.FC<{title: string; contentType?: string}> = ({
  title,
  contentType = 'article',
}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const shareButtonClassName =
    'p-4 hover:scale-105 transition hover:text-gray-100 text-gray-400'
  const shareButtonSvgClassName = 'w-5 h-5'

  return (
    <div className="mx-auto mt-16 flex w-full max-w-3xl flex-col items-center justify-center pb-10 text-center">
      <p className="flex items-center text-gray-400">
        Share this {contentType} with your friends
      </p>
      <div className="flex pt-2">
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
