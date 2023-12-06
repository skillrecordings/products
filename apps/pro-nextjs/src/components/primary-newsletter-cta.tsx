import * as React from 'react'
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
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import {useMotionValue, useTransform, motion} from 'framer-motion'
import {cn} from '@skillrecordings/ui/utils/cn'
import {isFirefox} from '@/utils/is-browser'

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
      src={require('../../public/skyscaper-5.jpg')}
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

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const objectX = useMotionValue(0)
  const objectY = useMotionValue(0)

  const handleMouseMove = (e: any) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }

  const parentRef = React.useRef<any>(null)

  // Calculate the offset between cursor and object position
  const offsetX = useTransform(
    cursorX,
    (x) => x - parentRef?.current?.getBoundingClientRect().left,
  )
  const offsetY = useTransform(
    cursorY,
    (y) => y - parentRef?.current?.getBoundingClientRect().top,
  )

  // Update object position relative to the cursor
  objectX.set(offsetX.get())
  objectY.set(offsetY.get())
  const withEffect = !isFirefox

  return (
    <section
      onMouseMove={handleMouseMove}
      ref={parentRef}
      id={id}
      aria-label="Newsletter sign-up"
      className={twMerge(
        'relative flex flex-col items-center overflow-hidden rounded bg-gradient-to-tr from-blue-500 to-purple-500 px-5 py-20',
        className,
      )}
    >
      {/* {image()} */}
      {children ? (
        children
      ) : (
        <div className="relative z-10 max-w-2xl text-white">
          <h2 className="text-center text-3xl font-medium drop-shadow-sm sm:text-4xl">
            <Balancer>{title}</Balancer>
          </h2>
          <h3 className="pt-4 text-center text-lg text-blue-200">
            <Balancer>{byline}</Balancer>
          </h3>
        </div>
      )}
      <SubscribeToConvertkitForm
        onSuccess={onSuccess ? onSuccess : handleOnSuccess}
        actionLabel={actionLabel}
        submitButtonElem={
          <Button
            size="lg"
            className="shadow-2xl shadow-black/20 hover:brightness-110"
            type="submit"
          >
            {common['primary-newsletter-button-cta-label']}
          </Button>
        }
      />
      <div className="h-10 w-10" />
      <p
        data-nospam=""
        className="pt-2 text-center text-sm text-white opacity-60"
      >
        We respect your privacy. Unsubscribe at any time.
      </p>
      <div
        className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(29,40,58,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(29,40,58,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        aria-hidden
      />
      <motion.div
        style={withEffect ? {x: offsetX, y: offsetY} : {}}
        className={cn(
          'pointer-events-none absolute left-0 top-0 z-10 -ml-20 -mt-20 h-40 w-40 rounded-full bg-white mix-blend-soft-light blur-[150px]',
          {
            hidden: !withEffect,
          },
        )}
        aria-hidden
      />
    </section>
  )
}
