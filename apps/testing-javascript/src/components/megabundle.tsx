import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Button} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'
import {zonedTimeToUtc} from 'date-fns-tz'
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
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])
  const router = useRouter()

  if (!isShowing) {
    return null
  }

  return (
    <div className="bg-[#F5F2EF]">
      <Link
        href="https://epicweb.dev/megabundle-2024"
        target="_blank"
        rel="noopener"
        id="megabundle"
        className={cn(
          'relative flex w-full sm:flex-row flex-col items-center justify-center overflow-hidden bg-gradient-to-tr saturate-125 hover:bg-orange-200 transition ease-in-out duration-300 from-yellow-400/20 to-amber-500/20 sm:py-3 py-5 shadow-inner',
          className,
        )}
        onClick={() => {
          track('clicked megabundle banner', {
            location: router.asPath,
          })
        }}
      >
        <div className="mx-auto flex w-full text-yellow-950 max-w-3xl container sm:flex-row justify-between flex-col items-center">
          <div className="flex items-center gap-3 sm:mb-0 mb-5">
            <span className="w-10 pt-1 h-10 rounded-full bg-yellow-600/20 flex items-center justify-center">
              🎁
            </span>
            <div className="flex flex-col">
              <h3 className="text-xl mb-1 font-bold leading-none flex-col">
                Epic Megabundle 2024
              </h3>
              <p className="leading-none text-yellow-700 text-balance text-base">
                Limited Offer ∙ 31 self-paced workshops + bonuses
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
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
                  <div className="flex items-center justify-center space-x-2 font-mono text-sm font-bold uppercase">
                    {Number(days) > 0 && (
                      <span className="tabular-nums">
                        {days}
                        <span className="opacity-60">d</span>
                      </span>
                    )}
                    {Number(hours) > 0 && (
                      <span className="tabular-nums">
                        {hours}
                        <span className="opacity-60">h</span>
                      </span>
                    )}
                    <span className="tabular-nums">
                      {zeroPad(minutes)}
                      <span className="opacity-60">m</span>
                    </span>
                    <span className="tabular-nums">
                      {zeroPad(seconds)}
                      <span className="opacity-60">s</span>
                    </span>
                  </div>
                )
              }}
            />

            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className="bg-black text-white py-2 text-lg font-semibold"
                asChild
              >
                <span
                // href="https://epicweb.dev/megabundle-2024"
                // target="_blank"
                // rel="noopener"
                >
                  Shop Now
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Link>
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
