import * as React from 'react'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/skill-lesson/convertkit'
import {useRouter} from 'next/router'
import {track} from 'utils/analytics'
import {Button, Skeleton} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import {useTheme} from 'next-themes'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'

type PrimaryNewsletterCtaProps = {
  onSubmit?: () => void
  className?: string
}

export const PrimaryNewsletterCta: React.FC<
  React.PropsWithChildren<PrimaryNewsletterCtaProps>
> = ({onSubmit, className}) => {
  const router = useRouter()
  const {theme} = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  const {subscriber, loadingSubscriber} = useConvertkit()
  return (
    <section
      id="subscribe"
      className={cn(
        'relative flex w-full flex-col items-center justify-center bg-muted px-5 pb-24',
        className,
      )}
    >
      <div className="-mt-40">
        {mounted ? (
          <Image
            className="relative sm:-translate-x-8"
            width={400}
            height={400}
            src={
              theme === 'light'
                ? require('../../public/assets/illo-light-incoming-transmission.png')
                : require('../../public/assets/illo-incoming-transmission.png')
            }
            alt=""
            loading="eager"
            aria-hidden="true"
          />
        ) : (
          <Skeleton className="aspect-square h-full w-full max-w-[400px] bg-foreground/5" />
        )}
      </div>
      <h2 className="text-center text-3xl font-bold sm:text-4xl">
        Join 40,000+ developers in the Epic Web community
      </h2>
      <h3 className="pb-8 pt-3 text-center text-lg opacity-75 sm:text-xl">
        <Balancer>
          Get the latest tutorials, articles, and announcements delivered to
          your inbox.
        </Balancer>
      </h3>
      {!subscriber ? (
        <div id="primary-newsletter-cta">
          <SubscribeToConvertkitForm
            onSuccess={(subscriber: any) => {
              if (subscriber) {
                const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                router.push(redirectUrl)
              }
            }}
            submitButtonElem={
              <Button onClick={onSubmit} data-sr-button="" size="lg">
                <span className="relative z-10">Become an Epic Web Dev</span>
              </Button>
            }
          />
          <p className="pt-8 text-center text-sm opacity-60">
            I respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      ) : (
        <div className="rounded bg-foreground/5 px-5 py-3 text-center text-xl font-bold">
          {"You're subscribed, thanks!"}
        </div>
      )}
    </section>
  )
}
