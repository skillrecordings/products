import {HeartIcon} from '@heroicons/react/solid'
import {
  LinkedIn,
  Reddit,
  Facebook,
  CopyToClipboard,
  Twitter,
} from '@skillrecordings/react'
import {cn} from '@skillrecordings/ui/utils/cn'
import {type Contributor} from 'lib/contributors'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'

const Share: React.FC<{
  title: string
  contentType?: string
  contributor?: Pick<Contributor, 'name' | 'twitterHandle'> | null
  className?: string
  children?: React.ReactNode
  shareButtonClassName?: string
  withFriends?: boolean
}> = ({
  title,
  contentType = 'article',
  contributor,
  className,
  children,
  shareButtonClassName = 'w-full flex items-center justify-center h-full px-7 py-7 hover:bg-foreground/5 transition',
  withFriends = false,
}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath

  const contributorTwitterHandle = contributor?.twitterHandle

  return (
    <section
      className={cn(
        'mx-auto flex w-full max-w-screen-md items-center justify-center overflow-hidden border border-gray-200 bg-transparent pt-5 dark:border-transparent dark:bg-gray-900 sm:pl-5 sm:pt-0 dark:sm:border-0 md:rounded',
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
                Share this {contentType}{' '}
                {withFriends ? 'with your friends' : ''}
              </span>
            </p>
          </div>
        )}
        <div className="flex w-full items-center justify-center divide-x divide-gray-200 border-t border-gray-200 pt-0 dark:divide-background dark:border-background sm:w-auto sm:border-t-0 dark:sm:border-t-0">
          <Twitter
            className={shareButtonClassName}
            svgClassName="w-4 h-4"
            link={url}
            message={`${title}${contentType ? `, ${contentType}` : ''}${
              contributorTwitterHandle ? ` by @${contributorTwitterHandle}` : ''
            }`}
          />
          {/* <Facebook
            className={shareButtonClassName}
            svgClassName="w-4 h-4"
            link={url}
          /> */}
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
