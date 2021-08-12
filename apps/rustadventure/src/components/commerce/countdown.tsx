import React from 'react'
import ReactCountdown, {zeroPad} from 'react-countdown'

type CountdownProps = {
  children?: JSX.Element
  date: number
}

type RendererProps = {
  days: number
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}

const Countdown = ({children, date}: CountdownProps) => {
  const numberOf = (number: number, label: string) => {
    return (
      <div>
        <div className="sm:text-3xl text-2xl text-brand font-semibold font-mono leading-tight">
          {zeroPad(number)}
        </div>
        <div className="text-sm opacity-75 text-tomato-800">{label}</div>
      </div>
    )
  }
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: RendererProps) => {
    if (completed) {
      return <>{children}</>
    } else {
      return (
        <div className="bg-tomato-50 text-tomato-900 rounded-lg sm:px-10 sm:p-8 p-5 text-center max-w-sm mx-auto mb-8">
          <div className="flex items-center justify-center mb-5">
            <h3 className="text-base font-medium leading-tight ">
              Limited offer! Price goes up in:
            </h3>
          </div>
          <div className="grid grid-flow-col sm:gap-8 gap-5 items-center justify-center mx-auto">
            {days > 0 && numberOf(days, 'days')}
            {numberOf(hours, 'hours')}
            {numberOf(minutes, 'mins')}
            {numberOf(seconds, 'secs')}
          </div>
        </div>
      )
    }
  }
  return (
    <ReactCountdown zeroPadTime={2} date={Number(date)} renderer={renderer} />
  )
}

export default Countdown
