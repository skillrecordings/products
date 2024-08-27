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
import Balancer from 'react-wrap-balancer'
import * as React from 'react'

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

export const VersionTwoCta: React.FC<
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
      className={twMerge('flex flex-col items-center', className)}
    >
      {children ? (
        children
      ) : (
        <div className="space-y-5 pb-16 text-center">
          <h1 className="pb-4 text-4xl font-extrabold leading-9 text-text sm:text-[2.75rem] sm:leading-10 lg:text-[3.5rem] lg:leading-none">
            <Balancer>{title}</Balancer>
          </h1>
          <h2 className="mx-auto max-w-4xl text-xl text-react sm:text-2xl">
            <Balancer>{byline}</Balancer>
          </h2>
        </div>
      )}
      <SubscribeToConvertkitForm
        formId="7017246"
        onSuccess={onSuccess ? onSuccess : handleOnSuccess}
        actionLabel={actionLabel}
      />
      <div className="h-10 w-10" />
      <p data-nospam="" className="pt-8 text-center text-sm opacity-80">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </section>
  )
}
