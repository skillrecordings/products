import React from 'react'
import {selectAutoplay} from '../selectors'
import {useVideo} from '../context/video-context'
import {useSelector} from '@xstate/react'
import Tippy from '@tippyjs/react'
import classNames from 'classnames'

const AutoplayToggle = () => {
  const videoService = useVideo()
  const autoplay = useSelector(videoService, selectAutoplay)

  return (
    <div>
      <Tippy
        interactive={true}
        inertia={true}
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
            videoService.send('TOGGLE_AUTOPLAY')
          }}
          type="button"
          className={`cueplayer-react-autoplay-control ${classNames({
            'cueplayer-react-autoplay-control-enabled': autoplay,
          })}`}
          role="switch"
          aria-checked={autoplay}
        >
          <span className="sr-only">Autoplay</span>
          <span aria-hidden="true" />
        </button>
      </Tippy>
    </div>
  )
}

export {AutoplayToggle}
