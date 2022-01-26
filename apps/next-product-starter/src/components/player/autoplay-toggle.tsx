import React from 'react'
import {getPlayerPrefs, savePlayerPrefs} from '@skillrecordings/player'
import Tippy from '@tippyjs/react'
import classNames from 'classnames'

const AutoplayToggle = () => {
  const [autoplayState, setAutoplayState] = React.useState<boolean>(false)
  const {autoplayPref} = getPlayerPrefs()

  React.useEffect(() => {
    setAutoplayState(autoplayPref)
  }, [])

  return (
    <div className="w-full bg-player-bg bg-opacity-80">
      {/* <Tippy
        interactive={true}
        content={
          <div className="text-xs bg-gray-600 px-2 py-1 rounded-sm bg-opacity-50">
            Autoplay is {autoplay ? 'on' : 'off'}
          </div>
        }
        hideOnClick={false}
        trigger="mouseenter focus"
      > */}
      <button
        onClick={() => {
          savePlayerPrefs({autoplay: !autoplayPref})
          setAutoplayState(!autoplayState)
        }}
        type="button"
        role="switch"
        aria-checked={autoplayState}
        className="px-3 py-2 flex items-center w-full group"
      >
        <span className="text-xs pr-2 font-mono uppercase">
          Autoplay{' '}
          <span className="sr-only">is {autoplayState ? 'on' : 'off'}</span>
        </span>
        <div
          className={`${classNames({
            'bg-indigo-500': autoplayState,
            'bg-gray-200 dark:bg-gray-600 group-hover:bg-indigo-200 group-hover:bg-opacity-60 bg-opacity-100 transition':
              !autoplayState,
          })} scale-90 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <span
            className={`${classNames({
              'translate-x-0': !autoplayState,
              'translate-x-5': autoplayState,
            })} pointer-events-none inline-flex h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 text-indigo-500 text-[0.5rem] tracking-tight font-mono uppercase font-bold items-center justify-center leading-none`}
            aria-hidden="true"
          >
            {autoplayState ? (
              <>on</>
            ) : (
              <span className="group-hover:opacity-40 text-black opacity-0 transition">
                off
              </span>
            )}
          </span>
        </div>
      </button>
      {/* </Tippy> */}
    </div>
  )
}

export {AutoplayToggle}
