import * as React from 'react'
import Balancer from 'react-wrap-balancer'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/skill-lesson/convertkit'
import {useRouter} from 'next/router'
import common from '../text/common'
import {type Subscriber} from '@skillrecordings/skill-lesson/schemas/subscriber'
import {twMerge} from 'tailwind-merge'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Button} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'

type PrimaryNewsletterCtaProps = {
  onSuccess?: () => void
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
  const handleOnSuccess = (subscriber: Subscriber | undefined) => {
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
      className={cn('relative flex flex-col items-center', className)}
    >
      {children ? (
        children
      ) : (
        <div className="w-full px-5 pb-16 pt-20 text-center sm:px-10">
          <h2 className="text-2xl leading-tight sm:text-4xl">
            <Balancer>
              <span
                className="hidden px-2 text-primary sm:inline-flex"
                aria-hidden="true"
              >
                ↓
              </span>
              {title}
              <span
                className="inline-flex px-2 text-primary sm:hidden"
                aria-hidden="true"
              >
                ↓
              </span>
            </Balancer>
          </h2>
          <h3 className="pt-4 text-center text-lg">{byline}</h3>
        </div>
      )}
      <SubscribeToConvertkitForm
        onSuccess={onSuccess ? onSuccess : handleOnSuccess}
        actionLabel={actionLabel}
      />
      <p
        data-nospam=""
        className="absolute -bottom-16 w-full text-center font-mono text-xs text-gray-500"
      >
        <Balancer>I respect your privacy. Unsubscribe at any time.</Balancer>
      </p>
    </section>
  )
}
