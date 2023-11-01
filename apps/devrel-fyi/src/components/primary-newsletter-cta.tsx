import * as React from 'react'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/ui/forms/convertkit-subscribe-form'
import {useRouter} from 'next/router'
import common from '../text/common'
import {type Subscriber} from '@skillrecordings/skill-lesson/schemas/subscriber'
import {twMerge} from 'tailwind-merge'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Button} from '@skillrecordings/ui'

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
      className={twMerge('', className)}
    >
      {children ? (
        children
      ) : (
        <div className="w-full px-10 py-16 text-center">
          <h2 className="text-4xl leading-tight">{title}</h2>
          <h3 className="pt-4 text-center text-lg">{byline}</h3>
        </div>
      )}
      <SubscribeToConvertkitForm
        onSuccess={onSuccess ? onSuccess : handleOnSuccess}
        actionLabel={actionLabel}
      />
      {/* <p data-nospam="" className="pt-8 text-center text-sm text-gray-500">
        I respect your privacy. Unsubscribe at any time.
      </p> */}
    </section>
  )
}
