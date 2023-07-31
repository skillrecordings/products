import * as React from 'react'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/skill-lesson/ui/convertkit-subscribe-form'
import {useRouter} from 'next/router'
import common from '../text/common'
import {type Subscriber} from '@skillrecordings/skill-lesson/schemas/subscriber'
import {twMerge} from 'tailwind-merge'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Button} from '@skillrecordings/skill-lesson/ui/button'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'

type PrimaryNewsletterCtaProps = {
  onSuccess?: () => void
  title?: string
  byline?: string
  actionLabel?: string
  id?: string
  className?: string
  image?: () => React.ReactNode
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
  title = common['primary-newsletter-title'],
  byline = common['primary-newsletter-byline'],
  actionLabel = common['primary-newsletter-button-cta-label'],
  trackProps = {event: 'subscribed', params: {}},
  onSuccess,
  image = () => (
    <Image
      src={require('../../public/skyscaper-2.jpg')}
      alt=""
      aria-hidden
      priority
      placeholder="blur"
      width={380}
      height={380}
      quality={100}
      className="mx-auto"
    />
  ),
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
      className={twMerge('flex flex-col items-center px-5', className)}
    >
      {image()}
      {children ? (
        children
      ) : (
        <div className="max-w-2xl pb-8">
          <h2 className="text-center text-3xl font-medium sm:text-4xl">
            <Balancer>{title}</Balancer>
          </h2>
          <h3 className="pt-4 text-center text-lg opacity-75">{byline}</h3>
        </div>
      )}
      <SubscribeToConvertkitForm
        onSuccess={onSuccess ? onSuccess : handleOnSuccess}
        actionLabel={actionLabel}
        submitButtonElem={
          <Button size="lg" className="hover:brightness-110">
            {common['primary-newsletter-button-cta-label']}
          </Button>
        }
      />
      <div className="h-10 w-10" />
      <p data-nospam="" className="pt-8 text-center text-sm opacity-80">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </section>
  )
}
