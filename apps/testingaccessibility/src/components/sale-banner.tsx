import React from 'react'
import Countdown, {CountdownRenderProps, zeroPad} from 'react-countdown'
import {FormattedPrice} from 'utils/format-prices-for-product'
import {useReducedMotion} from 'framer-motion'
import {scroller} from 'react-scroll'
import {useQuery} from 'react-query'
import {useRouter} from 'next/router'
import Link from 'next/link'

const SaleBanner = () => {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()
  const {data: formattedPrice} = useQuery<FormattedPrice>(['banner'], () =>
    fetch('/api/prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((formattedPrice: FormattedPrice) => formattedPrice),
  )
  const defaultCoupon = formattedPrice?.defaultCoupon

  if (!defaultCoupon) return null

  const {expires, percentageDiscount} = defaultCoupon
  const percentOff = Math.floor(Number(percentageDiscount) * 100)

  const GoToPricingButton: React.FC = ({children}) => {
    const isLandingPage = router.pathname === '/' || router.pathname === '/buy'
    return isLandingPage ? (
      <button
        className="ml-2 flex-shrink-0 inline-flex px-2 py-0.5 pb-1 underline rounded-md border hover:bg-moss-50"
        onClick={() => {
          scroller.scrollTo('buy', {
            duration: 1500,
            smooth: shouldReduceMotion ? false : 'easeInOutQuint',
          })
          const buySection = document.getElementById('buy')
          buySection?.focus()
        }}
      >
        {children}
      </button>
    ) : (
      <Link href="/#buy">
        <a className="ml-2 flex-shrink-0 inline-flex px-2 py-0.5 pb-1 underline rounded-md border hover:bg-moss-50">
          {children}
        </a>
      </Link>
    )
  }

  return (
    <div>
      <div className="sm:h-10">
        <div className="sm:h-10 sm:py-0 gap-1 flex py-1 items-center justify-center font-medium font-nav sm:fixed top-0 z-40 bg-white w-full border-b border-gray-100 shadow px-3">
          <span className="sm:w-auto w-full">
            <span className="sm:inline-block block leading-tight">
              Special launch discount!{' '}
              <span
                className="px-1"
                role="img"
                aria-label="smiling face with hearts"
              >
                🥰
              </span>
            </span>{' '}
            <Countdown
              date={expires}
              renderer={(props) => <CountdownRenderer {...props} />}
            />
          </span>
          <GoToPricingButton>Get {percentOff}% off</GoToPricingButton>
        </div>
      </div>
    </div>
  )
}

export default SaleBanner

const CountdownRenderer: React.FC<CountdownRenderProps> = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}) => {
  const [srValues] = React.useState({
    days,
    hours,
    minutes,
    seconds,
  })

  const screenReaderValues = `${srValues.days} days, ${srValues.hours} hours, ${srValues.minutes} minutes, and ${srValues.seconds} seconds`

  return completed ? null : (
    <>
      Price goes up in
      <time
        aria-hidden="true"
        className="px-1 pt-1 font-mono text-sm font-bold tabular-nums"
      >
        {days}d{'\u205F'}
        {hours}h{'\u205F'}
        {zeroPad(minutes)}m{'\u205F'}
        {zeroPad(seconds)}s{'\u205F'}
      </time>
      <time className="sr-only">{screenReaderValues}</time>
    </>
  )
}
