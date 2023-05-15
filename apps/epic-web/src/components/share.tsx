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
import Balancer from 'react-wrap-balancer'

const Share: React.FC<{title: string; contentType?: string}> = ({
  title,
  contentType = 'article',
}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const shareButtonClassName =
    'w-full flex items-center justify-center h-full px-7 py-7 dark:hover:bg-gray-700/50 hover:bg-gray-100 transition'

  return (
    <section className="mx-auto flex w-full max-w-screen-md items-center justify-center overflow-hidden border border-gray-200 bg-transparent pt-5 dark:border-transparent dark:bg-gray-800 sm:pl-5 sm:pt-0 dark:sm:border-0 md:rounded-lg">
      <div className="mx-auto flex w-full max-w-screen-md flex-col items-center justify-between gap-5 sm:flex-row">
        <div>
          <p className="flex items-center text-lg font-medium">
            <HeartIcon
              aria-hidden="true"
              className="mr-4 inline-block h-5 w-5 flex-shrink-0 text-rose-400/90"
            />
            <span className="leading-tight">
              <Balancer>Share this {contentType} with your friends</Balancer>
            </span>
          </p>
        </div>
        <div className="flex w-full items-center justify-center divide-x divide-gray-200 border-t border-gray-200 pt-0 dark:divide-gray-700 dark:border-gray-700 sm:w-auto sm:border-t-0 dark:sm:border-t-0">
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
