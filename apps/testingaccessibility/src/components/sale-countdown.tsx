import React from 'react'
import Countdown, {zeroPad, CountdownRenderProps} from 'react-countdown'

const SaleCountdown: React.FC<any> = ({coupon, ...rest}) => {
  // storing coupon in state so that it doesn't rerender
  // and cause layout shift when quantity changes
  const [storedCoupon, setStoredCoupon] = React.useState(coupon)
  React.useEffect(() => {
    coupon && setStoredCoupon(coupon)
  }, [coupon])

  if (!storedCoupon?.expires) return null

  return (
    <Countdown
      date={storedCoupon.expires}
      renderer={(props) => <CountdownRenderer {...props} {...rest} />}
    />
  )
}

export default SaleCountdown

const CountdownRenderer: React.FC<CountdownRenderProps> = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
  ...rest
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
      <div className="px-10 w-full" {...rest}>
        <div className="p-5 text-center rounded-lg mt-5 w-full">
          <p className="font-medium pb-3">Hurry! Price goes up in:</p>
          <div
            aria-hidden="true"
            className="tabular-nums tracking-tight grid grid-cols-4 items-center justify-center max-w-[300px] mx-auto"
          >
            <div className="flex flex-col">
              <span className="text-3xl font-heading font-bold leading-none">
                {days}
              </span>
              <span className="pt-1 text-xs font-medium tracking-wide uppercase text-gray-500">
                days
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-heading font-bold leading-none">
                {hours}
              </span>
              <span className="pt-1 text-xs font-medium tracking-wide uppercase text-gray-500">
                hours
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-heading font-bold leading-none">
                {minutes}
              </span>
              <span className="pt-1 text-xs font-medium tracking-wide uppercase text-gray-500">
                minutes
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-heading font-bold leading-none">
                {seconds}
              </span>
              <span className="pt-1 text-xs font-medium tracking-wide uppercase text-gray-500">
                seconds
              </span>
            </div>
          </div>
          <div className="sr-only">{screenReaderValues}</div>
        </div>
      </div>
    </>
  )
}
