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
    <div className="bg-slate-800/40 max-w-screen-md mx-auto pl-5 rounded-lg mb-16 overflow-hidden flex items-center justify-center shadow-xl sm:pt-0 pt-10">
      <div className="flex sm:flex-row flex-col gap-5 w-full items-center justify-between mx-auto max-w-screen-md">
        <div>
          <p className="text-xl flex items-center lg:pl-0 pl-5">
            <HeartIcon
              aria-hidden="true"
              className="w-5 h-5 inline-block mr-2 text-rose-500"
            />
            <span className="leading-none">
              Share this article with your friends
            </span>
          </p>
        </div>
        <div className="sm:pt-0 pt-2 flex sm:w-auto w-full items-center sm:divide-x divide-slate-900 border-r border-slate-900 justify-center">
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
