import React from 'react'
import Countdown, {zeroPad, CountdownRenderProps} from 'react-countdown'

const SaleCountdown: React.FC<React.PropsWithChildren<any>> = ({
  coupon,
  ...rest
}) => {
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

const CountdownRenderer: React.FC<
  React.PropsWithChildren<CountdownRenderProps>
> = ({days, hours, minutes, seconds, completed, ...rest}) => {
  const [srValues] = React.useState({
    days,
    hours,
    minutes,
    seconds,
  })
  const screenReaderValues = `${srValues.days} days, ${srValues.hours} hours, ${srValues.minutes} minutes, and ${srValues.seconds} seconds`

  return completed ? null : (
    <>
      <div className="w-full px-10 pb-7" {...rest}>
        <div className="w-full rounded-lg text-center">
          <p className="pb-5 font-medium">Hurry! Price goes up in:</p>
          <div
            aria-hidden="true"
            className="mx-auto grid max-w-[300px] grid-cols-4 items-center justify-center gap-2 tabular-nums tracking-tight"
          >
            <div className="flex flex-col">
              <span className="text-3xl font-medium leading-none">{days}</span>
              <span className="pt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                days
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-medium leading-none">{hours}</span>
              <span className="pt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                hours
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-medium leading-none">
                {minutes}
              </span>
              <span className="pt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                minutes
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-medium leading-none">
                {seconds}
              </span>
              <span className="pt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
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
