import * as React from 'react'
import {isEmpty} from 'lodash'
import {track} from '@skillrecordings/analytics'
import queryString from 'query-string'
import cx from 'classnames'

import {
  Player,
  VideoProvider,
  HLSSource,
  useVideo,
  selectWithSidePanel,
  selectIsFullscreen,
} from '@skillrecordings/player'
import {useSelector} from '@xstate/react'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'

const Kexp: React.FC = () => {
  const [mounted, setMounted] = React.useState<boolean>(true)
  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)
  const videoService = useVideo()
  // @ts-ignore
  const withSidePanel = useSelector(videoService, selectWithSidePanel)
  // @ts-ignore

  // @ts-ignore
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  return (
    <div
      className={cx('w-full space-y-6 lg:grid lg:grid-cols-12 lg:space-y-0', {
        'absolute top-0': isFullscreen,
        relative: !isFullscreen,
      })}
      ref={fullscreenWrapperRef}
    >
      <div
        className={cx(
          'relative before:float-left after:clear-both after:table',
          withSidePanel ? 'col-span-9' : 'col-span-12',
        )}
      >
        {mounted && (
          <Player
            className="font-sans"
            container={fullscreenWrapperRef.current || undefined}
          >
            <HLSSource src="https://stream.mux.com/KQucn4VsDJFGqFjIpyuj7tsEG9p9b8bYPTFxL4v6798.m3u8" />
          </Player>
        )}
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <div>
      <VideoProvider
        services={{
          loadResource:
            (_context: VideoStateContext, _event: VideoEvent) => async () => {
              return {}
            },
          loadViewer:
            (_context: VideoStateContext, _event: VideoEvent) => async () => {
              return {}
            },
        }}
      >
        <Kexp />
      </VideoProvider>
    </div>
  )
}

export default Page
