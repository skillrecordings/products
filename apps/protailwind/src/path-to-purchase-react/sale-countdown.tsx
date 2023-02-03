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
      <div {...rest}>
        <p data-title="">Hurry! Price goes up in:</p>
        <div aria-hidden="true" data-grid="">
          <div className="flex flex-col">
            <span data-number="">{days}</span>
            <span data-label="">days</span>
          </div>
          <div className="flex flex-col">
            <span data-number="">{hours}</span>
            <span data-label="">hours</span>
          </div>
          <div className="flex flex-col">
            <span data-number="">{minutes}</span>
            <span data-label="">minutes</span>
          </div>
          <div className="flex flex-col">
            <span data-number="">{seconds}</span>
            <span data-label="">seconds</span>
          </div>
        </div>
        <div className="sr-only">{screenReaderValues}</div>
      </div>
    </>
  )
}
