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

const Share: React.FC<{title: string}> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const shareButtonClassName =
    'w-full flex items-center justify-center h-full px-7 py-7 hover:bg-gray-700/30 transition'

  return (
    <section className="bg-gray-800 max-w-screen-md mx-auto sm:pl-5 w-full md:rounded-lg overflow-hidden flex items-center justify-center shadow-xl sm:pt-0 pt-5">
      <div className="flex sm:flex-row flex-col gap-5 w-full items-center justify-between mx-auto max-w-screen-md">
        <div>
          <p className="text-lg font-medium flex items-center">
            <HeartIcon
              aria-hidden="true"
              className="w-5 h-5 inline-block mr-2 text-rose-400/90 flex-shrink-0"
            />
            <span className="leading-tight">
              Share this article with your friends
            </span>
          </p>
        </div>
        <div className="pt-0 flex sm:w-auto w-full items-center divide-x divide-gray-900 justify-center border-t md:border-transparent border-gray-900">
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
