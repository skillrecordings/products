import Countdown, {type CountdownRenderProps, zeroPad} from 'react-countdown'
import {cn} from '@skillrecordings/ui/utils/cn'
import Link from 'next/link'
import {useActivePromotion} from '@/hooks/use-active-promotion'
import React from 'react'
import {Button} from '@skillrecordings/ui'
import {XIcon} from 'lucide-react'
import Image from 'next/image'
import {isBefore, subDays} from 'date-fns'

const ActivePromotion: React.FC<{className?: string; isMinified: boolean}> = ({
  className,
  isMinified = false,
}) => {
  const {activePromotion, buyUrl, getCookie, setCookie} = useActivePromotion()

  const DAYS_TO_WAIT_BETWEEN_SHOWING_DISMISSED_PROMOTION = 2

  const [shouldDisplayPromotion, setShouldDisplayPromotion] =
    React.useState<boolean>(false)
  const thresholdDays = subDays(
    new Date(),
    DAYS_TO_WAIT_BETWEEN_SHOWING_DISMISSED_PROMOTION,
  )
  const lastDissmissed = getCookie()?.dismissed_on

  React.useEffect(() => {
    if (!lastDissmissed) {
      setShouldDisplayPromotion(
        activePromotion ? (getCookie()?.state === 1 ? true : false) : false,
      )
    } else {
      setShouldDisplayPromotion(
        activePromotion
          ? isBefore(new Date(lastDissmissed), thresholdDays)
            ? true
            : getCookie()?.state === 1
          : false,
      )
    }
  }, [activePromotion, getCookie])

  const NavCTA = () => {
    return activePromotion ? (
      <Link
        className={cn(
          'fixed left-[182px] top-0 z-50 flex h-16 max-w-[300px] items-center justify-center py-2.5 text-xs duration-500 ease-in-out',
          {
            'hidden xl:flex': !isMinified,
            hidden: isMinified,
          },
          className,
        )}
        href={buyUrl}
      >
        <span className="absolute left-[-52px] top-0 origin-top-right scale-75 bg-primary px-1 font-sans text-xs font-semibold uppercase text-black">
          Sale
        </span>
        <div className="flex flex-col text-[13px] transition hover:text-primary">
          <span className="text-balance font-semibold text-white">
            Get{' '}
            {activePromotion.product?.title
              ? `${activePromotion.product.title}`
              : process.env.NEXT_PUBLIC_SITE_TITLE}{' '}
            for {Number(activePromotion.percentageDiscount) * 100}% off
          </span>{' '}
          {activePromotion?.expires && (
            <span className="hidden text-primary sm:inline-block">
              <Countdown
                date={new Date(activePromotion.expires).toISOString()}
                renderer={countdownRenderer}
              />
            </span>
          )}
        </div>
      </Link>
    ) : null
  }

  const PopupCTA = () => {
    return shouldDisplayPromotion && activePromotion ? (
      <div
        className={cn(
          'fixed bottom-5 right-5 z-50 flex w-full max-w-[200px] flex-col items-start rounded border bg-card p-5 pt-0 text-sm shadow-xl duration-500 ease-in-out',

          {
            'flex xl:hidden': !isMinified,
            flex: isMinified,
          },
          className,
        )}
      >
        <Button
          onClick={() => {
            setCookie({
              state: 0,
              dismissed_on: new Date().toISOString(),
            })
            setShouldDisplayPromotion(false)
          }}
          className="absolute right-0.5 top-0.5"
          size="icon"
          aria-label="Dismiss"
          variant="ghost"
        >
          <XIcon className="h-4 w-4" />
        </Button>
        <span className="inline-flex rounded-b-sm bg-primary px-1 font-sans text-xs font-semibold uppercase text-black">
          Save {Number(activePromotion.percentageDiscount) * 100}%
        </span>
        <div className="flex flex-col pt-3 text-[13px]">
          {activePromotion?.product?.image?.url && (
            <Image
              src={activePromotion.product.image.url}
              width={100}
              height={100}
              alt={activePromotion?.product?.title}
            />
          )}
          <span className="text-balance text-lg font-semibold text-white">
            {activePromotion?.product?.title
              ? `${activePromotion.product.title}`
              : process.env.NEXT_PUBLIC_SITE_TITLE}{' '}
          </span>{' '}
          <span>
            Special offer ends in{' '}
            {activePromotion?.expires && (
              <Countdown
                date={new Date(activePromotion.expires).toISOString()}
                renderer={({
                  seconds,
                  minutes,
                  hours,
                  days,
                }: CountdownRenderProps) => {
                  return (
                    <div className="tabular-numbs flex flex-wrap items-center font-mono">
                      <span>{days}d</span>
                      <span className="px-1 opacity-50">:</span>
                      <span>{hours}h</span>
                      <span className="px-1 opacity-50">:</span>
                      <span>{zeroPad(minutes)}m</span>
                      <span className="px-1 opacity-50">:</span>
                      <span>{zeroPad(seconds, 2)}s</span>
                    </div>
                  )
                }}
              />
            )}
          </span>
          <Button asChild size="sm" className="mt-4">
            <Link
              href={buyUrl}
              className="bg-gradient-to-tr from-[#4BCCE5] to-[#8AF7F1] font-semibold"
            >
              Level Up Now
            </Link>
          </Button>
        </div>
      </div>
    ) : null
  }

  return (
    <>
      <NavCTA />
      <PopupCTA />
    </>
  )
}

export default ActivePromotion

const countdownRenderer = ({
  seconds,
  minutes,
  hours,
  days,
}: CountdownRenderProps) => {
  return (
    <span className="tabular-nums">
      Offer ends in: {days > 0 && `${days}d`} {hours}h {zeroPad(minutes)}m{' '}
      {zeroPad(seconds, 2)}s
    </span>
  )
}
