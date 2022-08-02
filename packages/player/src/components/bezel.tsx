import * as React from 'react'
import cx from 'classnames'
import {useVideo, VideoContext} from '../context/video-context'

type BezelProps = {
  className?: string
}

/**
 * Flashes an icon on the screen when a shortcut key is used
 *
 * Currently only 'play' and 'pause' are implemented
 * @param className
 * @constructor
 */
export const Bezel: React.FC<React.PropsWithChildren<BezelProps>> = ({
  className,
}) => {
  const videoService = useVideo()
  const [count, setCount] = React.useState(0)
  const [action, setAction] = React.useState('')
  const [hidden, setHidden] = React.useState(true)
  const timerRef = React.useRef<NodeJS.Timeout>()

  const style = hidden
    ? {
        display: 'none',
      }
    : undefined

  React.useEffect(() => {
    const subscription = videoService.subscribe((state) => {
      if (
        (state.event.type === 'PLAY' || state.event.type === 'PAUSE') &&
        state.event.source === 'shortcut'
      ) {
        setAction(state.event.type.toLowerCase())
        if (timerRef.current) {
          // previous animation is not finished
          clearTimeout(timerRef.current) // cancel it
          timerRef.current = undefined
        }

        setCount((prevCount) => prevCount + 1)

        setHidden(false)

        // hide it after 0.5s
        timerRef.current = setTimeout(() => {
          setHidden(true)
          timerRef.current = undefined
        }, 500)
      }
    })

    return subscription.unsubscribe
  }, [videoService])

  return (
    <div
      className={cx(
        {
          'cueplayer-react-bezel': true,
          'cueplayer-react-bezel-animation': count % 2 === 0,
          'cueplayer-react-bezel-animation-alt': count % 2 === 1,
        },
        className,
      )}
      style={style}
      role="status"
    >
      <div
        className={cx(
          'cueplayer-react-bezel-icon',
          `cueplayer-react-bezel-icon-${action}`,
        )}
      />
    </div>
  )
}
