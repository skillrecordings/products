import * as React from 'react'
import {motion} from 'framer-motion'
import cx from 'classnames'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useRouter} from 'next/router'
import common from '../text/common'
import {type ConvertkitSubscriber} from '@skillrecordings/convertkit-react-ui/dist/types'
import {twMerge} from 'tailwind-merge'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Balancer from 'react-wrap-balancer'
import Spinner from './spinner'

type PrimaryNewsletterCtaProps = {
  onSuccess?: (subscriber: ConvertkitSubscriber | undefined) => void
  title?: string
  byline?: string
  actionLabel?: string
  id?: string
  className?: string
  trackProps?: {
    event?: string
    params?: Record<string, string>
  }
}

export const PrimaryNewsletterCta: React.FC<
  React.PropsWithChildren<PrimaryNewsletterCtaProps>
> = ({
  children,
  className,
  id = 'primary-newsletter-cta',
  title = common['primary-newsletter-tittle'],
  byline = common['primary-newsletter-byline'],
  actionLabel = common['primary-newsletter-button-cta-label'],
  trackProps = {event: 'subscribed', params: {}},
  onSuccess,
}) => {
  const router = useRouter()
  onSuccess = onSuccess
    ? onSuccess
    : (subscriber: ConvertkitSubscriber | undefined) => {
        if (subscriber) {
          track(trackProps.event as string, trackProps.params)
          const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
          router.push(redirectUrl)
        }
      }
  return (
    <section
      id={id}
      aria-label="Newsletter sign-up"
      className={twMerge('flex flex-col items-center', className)}
    >
      {children ? (
        children
      ) : (
        <div className="pb-8">
          <h2 className="text-center text-4xl font-bold">{title}</h2>
          <h3 className="pt-4 text-center text-lg">{byline}</h3>
        </div>
      )}
      <SubscribeToConvertkitForm
        onSuccess={onSuccess}
        actionLabel={actionLabel}
        submitButtonElem={<SubmitButton />}
      />
      <p
        data-nospam=""
        className="w-full pt-10 text-center text-base font-medium text-white"
      >
        <Balancer>I respect your privacy. Unsubscribe at any time.</Balancer>
      </p>
    </section>
  )
}

const SubmitButton: React.FC<any> = ({isLoading}) => {
  const [hovered, setHovered] = React.useState(false)
  const isAnimating = true
  return (
    <button
      onMouseOver={() => {
        setHovered(true)
      }}
      onMouseOut={() => {
        setHovered(false)
      }}
      className="relative z-10 mt-4 flex h-full items-center justify-center overflow-hidden rounded-full border-4 border-black bg-black py-5 font-heading text-2xl font-bold text-white transition"
    >
      <span
        className={cx(
          'relative z-10 rounded-full px-4 py-1.5 shadow-xl shadow-black/20',
          {
            'bg-black': isAnimating,
          },
        )}
      >
        {isLoading ? <Spinner className="h-8 w-8" /> : 'Subscribe, friend!'}
      </span>
      {isAnimating && (
        <motion.div
          className="absolute z-0 flex h-full w-full items-center justify-center"
          aria-hidden="true"
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: isLoading ? 4 : 10,
          }}
          animate={{
            x: ['-25%', '19%'],
          }}
        >
          {new Array(4).fill(null).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="768"
              height="108"
              fill="none"
              viewBox="0 0 768 108"
              className="absolute origin-left scale-150"
            >
              <mask
                id="a"
                width="768"
                height="108"
                x="0"
                y="0"
                maskUnits="userSpaceOnUse"
                style={{maskType: 'alpha'}}
              >
                <path fill="#D9D9D9" d="M0 0h768v108H0z" />
              </mask>
              <g mask="url(#a)">
                <path
                  fill="#EB5228"
                  stroke="#000"
                  strokeWidth="2"
                  d="M52 1h32L34 107H2L52 1Z"
                />
                <path
                  fill="#F5D000"
                  stroke="#000"
                  strokeWidth="2"
                  d="M84 1h32L66 107H34L84 1Zm128 0h32l-50 106h-32L212 1Zm128 0h32l-50 106h-32L340 1Zm128 0h32l-50 106h-32L468 1Zm128 0h32l-50 106h-32L596 1Zm128 0h32l-50 106h-32L724 1Z"
                />
                <path
                  fill="#009A51"
                  stroke="#000"
                  strokeWidth="2"
                  d="M244 1h32l-50 106h-32L244 1ZM116 1h32L98 107H66L116 1Zm256 0h32l-50 106h-32L372 1Zm128 0h32l-50 106h-32L500 1Zm128 0h32l-50 106h-32L628 1Zm128 0h32l-50 106h-32L756 1Z"
                />
                <path
                  fill="#6D92F4"
                  stroke="#000"
                  strokeWidth="2"
                  d="M148 1h32l-50 106H98L148 1Zm128 0h32l-50 106h-32L276 1Z"
                />
                <path
                  fill="#EB5228"
                  stroke="#000"
                  strokeWidth="2"
                  d="M180 1h32l-50 106h-32L180 1Z"
                />
                <path
                  fill="#009A51"
                  stroke="#000"
                  strokeWidth="2"
                  d="M-12 1h32l-50 106h-32L-12 1Z"
                />
                <path
                  fill="#6D92F4"
                  stroke="#000"
                  strokeWidth="2"
                  d="M20 1h32L2 107h-32L20 1Zm384 0h32l-50 106h-32L404 1Zm128 0h32l-50 106h-32L532 1Zm128 0h32l-50 106h-32L660 1Zm128 0h32l-50 106h-32L788 1Z"
                />
                <path
                  fill="#EB5228"
                  stroke="#000"
                  strokeWidth="2"
                  d="M308 1h32l-50 106h-32L308 1Zm128 0h32l-50 106h-32L436 1Zm128 0h32l-50 106h-32L564 1Zm128 0h32l-50 106h-32L692 1Z"
                />
              </g>
            </svg>
          ))}
        </motion.div>
      )}
    </button>
  )
}
