import React from 'react'
import {getPlayerPrefs, savePlayerPrefs} from '@skillrecordings/player'
import Tippy from '@tippyjs/react'
import classNames from 'classnames'

const AutoplayToggle = () => {
  const [autoplay, setAutoplay] = React.useState<boolean>(false)

  React.useEffect(() => {
    setAutoplay(getPlayerPrefs().autoplay)
  }, [])

  return (
    <div>
      <Tippy
        interactive={true}
        content={
          <div className="cueplayer-react-autoplay-control-tooltip">
            Autoplay is {autoplay ? 'on' : 'off'}
          </div>
        }
        hideOnClick={false}
        trigger="mouseenter focus"
      >
        <button
          onClick={() => {
            savePlayerPrefs({autoplay: !getPlayerPrefs().autoplay})
            setAutoplay(!autoplay)
          }}
          type="button"
          className={`${classNames({
            'bg-blue-500': autoplay,
            'bg-gray-200': !autoplay,
          })} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          role="switch"
          aria-checked={autoplay}
        >
          <span className="sr-only">Autoplay</span>
          <span
            className={`${classNames({
              'translate-x-0': !autoplay,
              'translate-x-5': autoplay,
            })} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
            aria-hidden="true"
          />
        </button>
      </Tippy>
    </div>
  )
}

export {AutoplayToggle}
