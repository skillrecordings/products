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
    'w-full flex items-center justify-center h-full sm:p-7 p-5 group transition'

  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl md:px-5">
      <div className="flex w-full items-center justify-center overflow-hidden bg-white pt-5 shadow-xl shadow-gray-500/5 sm:pl-5 sm:pt-0 md:rounded-lg">
        <div className="mx-auto flex w-full flex-col items-center justify-between gap-5 sm:flex-row">
          <div>
            <p className="flex items-center font-normal">
              <HeartIcon
                aria-hidden="true"
                className="mr-2 inline-block h-5 w-5 flex-shrink-0 animate-heartpulse text-rose-400/90"
              />
              <span className="leading-tight">
                Share this article with your friends
              </span>
            </p>
          </div>
          <div className="flex w-full items-center justify-center divide-x divide-background border-t border-background pt-0 sm:w-auto md:border-transparent">
            <Twitter
              className={shareButtonClassName}
              svgClassName="w-4 h-4 group-hover:scale-110 transition duration-300 ease-in-out"
              link={url}
              message={`${title} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`}
            />
            <Facebook
              className={shareButtonClassName}
              svgClassName="w-4 h-4 group-hover:scale-110 transition duration-300 ease-in-out"
              link={url}
            />
            <LinkedIn
              className={shareButtonClassName}
              svgClassName="w-4 h-4 group-hover:scale-110 transition duration-300 ease-in-out"
              link={url}
            />
            <Reddit
              className={shareButtonClassName}
              svgClassName="w-4 h-4 group-hover:scale-110 transition duration-300 ease-in-out"
              link={url}
            />
            <CopyToClipboard
              className={shareButtonClassName}
              onSuccess={() => {
                toast.success('Copied to clipboard')
              }}
              svgClassName="w-4 h-4 group-hover:scale-110 transition duration-300 ease-in-out"
              link={url}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Share
