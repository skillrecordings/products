import {track} from '@/utils/analytics'
import {Button} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'
import {zonedTimeToUtc} from 'date-fns-tz'
import {useTheme} from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import Countdown, {zeroPad} from 'react-countdown'

export const MEGABUNDLE_2024_EXPIRATION_DATE_IN_PACIFIC_TIMEZONE = new Date(
  '2024-12-20T07:00:00.000Z',
)

export const MegabundleBanner = ({
  isShowing = true,
  className,
}: {
  isShowing?: boolean
  className?: string
}) => {
  const {theme} = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)
  const imageRef = React.useRef<HTMLImageElement>(null)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])
  const router = useRouter()

  if (!isShowing) {
    return null
  }

  return (
    <div className="bg-gray-200 dark:bg-[#090B16]">
      <div
        id="megabundle"
        className={cn(
          'relative mt-16 flex w-full flex-col items-center justify-center overflow-hidden bg-white pb-16 pt-10 shadow-inner  dark:text-white ',
          'border-b border-[#DCE2EB] bg-[linear-gradient(to_right,#DCE2EB_1px,transparent_1px),linear-gradient(to_bottom,#DCE2EB_1px,transparent_1px)] bg-[size:3rem_3rem] dark:border-[#0F1221] dark:bg-[linear-gradient(to_right,#0F1221_1px,transparent_1px),linear-gradient(to_bottom,#0F1221_1px,transparent_1px)]',
          className,
        )}
      >
        <Image
          ref={imageRef}
          loader={() => {
            return isMounted && theme === 'light'
              ? 'https://res.cloudinary.com/epic-web/image/upload/v1733221905/megabundle-2024/bundle-hero-light_2x.png'
              : 'https://res.cloudinary.com/epic-web/image/upload/v1733221905/megabundle-2024/bundle-hero-dark_2x.png'
          }}
          width={2316 / 2.5}
          height={804 / 2.5}
          src={
            'https://res.cloudinary.com/epic-web/image/upload/v1733221905/megabundle-2024/bundle-hero-dark_2x.png'
          }
          alt=""
          aria-hidden="true"
        />
        <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center">
          <h3 className="mb-2 inline-flex flex-col text-center">
            <span className="font-mono text-2xl font-bold uppercase leading-none text-blue-600 dark:text-blue-300 dark:opacity-85">
              Epic
            </span>
            <span className="text-5xl font-extrabold uppercase">
              Megabundle
            </span>
          </h3>
          <p className="mb-5 opacity-85">31 self-paced workshops + bonuses</p>
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="">
              <span className="text-sm font-light uppercase tracking-wide opacity-75">
                Limited Offer
              </span>
              <Countdown
                date={
                  new Date(MEGABUNDLE_2024_EXPIRATION_DATE_IN_PACIFIC_TIMEZONE)
                }
                renderer={(time) => {
                  const {days, hours, minutes, seconds} = isMounted
                    ? time
                    : {
                        days: '00',
                        hours: '00',
                        minutes: '00',
                        seconds: '00',
                      }
                  return (
                    <div className="flex items-center justify-center space-x-2 font-mono text-lg font-bold uppercase">
                      {Number(days) > 0 && (
                        <span className="tabular-nums">
                          {days}
                          <span className="opacity-75">d</span>
                        </span>
                      )}
                      {Number(hours) > 0 && (
                        <span className="tabular-nums">
                          {hours}
                          <span className="opacity-75">h</span>
                        </span>
                      )}
                      <span className="tabular-nums">
                        {zeroPad(minutes)}
                        <span className="opacity-75">m</span>
                      </span>
                      <span className="tabular-nums">
                        {zeroPad(seconds)}
                        <span className="opacity-75">s</span>
                      </span>
                    </div>
                  )
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="lg" className="text-base font-semibold" asChild>
              <Link
                href="https://epicweb.dev/megabundle-2024"
                target="_blank"
                rel="noopener"
                onClick={() => {
                  track('clicked megabundle banner', {
                    location: router.asPath,
                  })
                }}
              >
                Shop Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function hasMegabundleExpired() {
  const pacificTimeZone = 'America/Los_Angeles'

  // Convert the expiration date to UTC
  const expirationDateInUTC = zonedTimeToUtc(
    MEGABUNDLE_2024_EXPIRATION_DATE_IN_PACIFIC_TIMEZONE,
    pacificTimeZone,
  )

  // Get the current date in UTC
  const currentDateInUTC = new Date()

  // Compare the dates
  const hasExpired = currentDateInUTC > expirationDateInUTC

  return hasExpired
}
