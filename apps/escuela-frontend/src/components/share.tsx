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
    'w-full flex items-center justify-center px-7 py-8 hover:bg-slate-800/60 transition'

  return (
    <div className="flex items-center justify-center max-w-screen-md pt-10 pl-5 mx-auto mb-16 overflow-hidden shadow-xl bg-slate-800/40 md:rounded-lg sm:pt-0">
      <div className="flex flex-col items-center justify-between w-full max-w-screen-md gap-5 mx-auto sm:flex-row">
        <div>
          <p className="flex items-center text-xl">
            <HeartIcon
              aria-hidden="true"
              className="flex-shrink-0 inline-block w-5 h-5 mr-2 text-rose-500"
            />
            <span className="leading-none">
              Share this article with your friends
            </span>
          </p>
        </div>
        <div className="flex items-center justify-center w-full pt-2 border-r sm:pt-0 sm:w-auto sm:divide-x divide-slate-900 border-slate-900">
          <Twitter
            className={shareButtonClassName}
            svgClassName="sm:w-5 sm:h-5 w-4 h-4"
            link={url}
            message={`${title} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`}
          />
          <Facebook className={shareButtonClassName} link={url} />
          <LinkedIn className={shareButtonClassName} link={url} />
          <Reddit className={shareButtonClassName} link={url} />
          <CopyToClipboard
            className={shareButtonClassName}
            onSuccess={() => {
              toast.success('Copied to clipboard')
            }}
            link={url}
          />
        </div>
      </div>
    </div>
  )
}

export default Share
