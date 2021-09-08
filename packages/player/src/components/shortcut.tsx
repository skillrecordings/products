import * as React from 'react'
import {useVideo} from '../context/video-context'
import {useSelector} from '@xstate/react'

import {
  selectCurrentTime,
  selectDuration,
  selectHasStarted,
  selectIsActive,
  selectIsPaused,
  selectPlaybackRate,
  selectReadyState,
  selectRootElem,
  selectVolume,
} from '../selectors'

type ShortcutProps = {
  clickable?: boolean
  dblclickable?: boolean
  shortcuts?: any[]
}

const useShortcutState = () => {
  const videoService = useVideo()
  const hasStarted = useSelector(videoService, selectHasStarted)
  const isActive = useSelector(videoService, selectIsActive)
  const paused = useSelector(videoService, selectIsPaused)

  const duration = useSelector(videoService, selectDuration)
  const currentTime = useSelector(videoService, selectCurrentTime)
  const playbackRate = useSelector(videoService, selectPlaybackRate)
  const rootElem = useSelector(videoService, selectRootElem)
  const readyState = useSelector(videoService, selectReadyState)
  const volume = useSelector(videoService, selectVolume)

  return {
    videoService,
    hasStarted,
    duration,
    currentTime,
    playbackRate,
    rootElem,
    isActive,
    readyState,
    volume,
    paused,
  }
}

/**
 * defines keyboard shortcuts for the video player
 * @param clickable
 * @param dblclickable
 * @param props
 * @constructor
 */
export const Shortcut: React.FC<ShortcutProps> = ({
  clickable = false,
  dblclickable = false,
  ...props
}) => {
  const {
    videoService,
    hasStarted,
    duration,
    currentTime,
    playbackRate,
    rootElem,
    isActive,
    readyState,
    volume,
    paused,
  } = useShortcutState()

  const shortCutsRef = React.useRef<any[]>([])

  const togglePlay = React.useCallback(() => {
    if (paused) {
      videoService.send({type: 'PLAY', source: 'shortcut'})
    } else {
      videoService.send({type: 'PAUSE', source: 'shortcut'})
    }
  }, [paused, videoService])

  const mergeShortcuts = React.useCallback(() => {
    const standardShortcuts = [
      {
        keyCode: 32, // spacebar
        handle: () => togglePlay(),
      },
      {
        keyCode: 75, // k
        handle: () => togglePlay(),
      },
      {
        keyCode: 70, // f
        handle: () =>
          videoService.send({type: 'TOGGLE_FULLSCREEN', element: rootElem}),
      },
      {
        keyCode: 37, // Left arrow
        handle: () => {
          if (!hasStarted) {
            return
          }
          const seekingTime = currentTime - 5
          videoService.send({
            type: 'SEEKING',
            seekingTime: seekingTime > 0 ? seekingTime : 0,
            source: 'shortcut',
          })
        },
      },
      {
        keyCode: 74, // j
        handle: () => {
          if (!hasStarted) {
            return
          }
          const seekingTime = currentTime - 10
          videoService.send({
            type: 'SEEKING',
            seekingTime: seekingTime > 0 ? seekingTime : 0,
            source: 'shortcut',
          })
        },
      },
      {
        keyCode: 39, // Right arrow
        handle: () => {
          if (!hasStarted) {
            return
          }
          const seekingTime = currentTime + 5
          videoService.send({
            type: 'SEEKING',
            seekingTime: seekingTime < duration ? seekingTime : duration,
            source: 'shortcut',
          })
        },
      },
      {
        keyCode: 76, // l
        handle: () => {
          if (!hasStarted) {
            return
          }
          const seekingTime = currentTime + 10
          videoService.send({
            type: 'SEEKING',
            seekingTime: seekingTime < duration ? seekingTime : duration,
            source: 'shortcut',
          })
        },
      },
      {
        keyCode: 36, // Home
        handle: () => {
          if (!hasStarted) {
            return
          }
          videoService.send({
            type: 'SEEKING',
            seekingTime: 0,
            source: 'shortcut',
          })
        },
      },
      {
        keyCode: 35, // End
        handle: () => {
          if (!hasStarted) {
            return
          }
          // Go to end of video
          videoService.send({
            type: 'SEEKING',
            seekingTime: duration,
            source: 'shortcut',
          })
        },
      },
      {
        keyCode: 38, // Up arrow
        handle: () => {
          // Increase volume 5%
          let v = volume + 0.05
          if (v > 1) {
            v = 1
          }
          videoService.send({
            type: 'VOLUME_CHANGE',
            volume: v < 1.0 ? v : 1.0,
            source: 'shortcut',
          })
        },
      },
      {
        keyCode: 40, // Down arrow
        handle: () => {
          // Decrease volume 5%
          let v = volume - 0.05
          if (v < 0) {
            v = 0
          }
          //TODO difference between volume down and volume off actions
          videoService.send({
            type: 'VOLUME_CHANGE',
            volume: v > 0 ? v : 0,
            source: 'shortcut',
          })
        },
      },
      {
        keyCode: 190, // Shift + >
        shift: true,
        handle: () => {
          // Increase speed
          let newPlaybackRate = playbackRate
          if (playbackRate >= 1.5) {
            newPlaybackRate = 2
          } else if (playbackRate >= 1.25) {
            newPlaybackRate = 1.5
          } else if (playbackRate >= 1.0) {
            newPlaybackRate = 1.25
          } else if (playbackRate >= 0.5) {
            newPlaybackRate = 1.0
          } else if (playbackRate >= 0.25) {
            newPlaybackRate = 0.5
          } else if (playbackRate >= 0) {
            newPlaybackRate = 0.25
          }

          videoService.send({
            type: 'PLAYBACKRATE_CHANGE',
            playbackRate: newPlaybackRate,
            source: 'shortcut',
          })
        },
      },
      {
        keyCode: 188, // Shift + <
        shift: true,
        handle: () => {
          // Decrease speed
          let newPlaybackRate = playbackRate
          if (playbackRate <= 0.5) {
            newPlaybackRate = 0.25
          } else if (playbackRate <= 1.0) {
            newPlaybackRate = 0.5
          } else if (playbackRate <= 1.25) {
            newPlaybackRate = 1.0
          } else if (playbackRate <= 1.5) {
            newPlaybackRate = 1.25
          } else if (playbackRate <= 2) {
            newPlaybackRate = 1.5
          }
          videoService.send({
            type: 'PLAYBACKRATE_CHANGE',
            playbackRate: newPlaybackRate,
            source: 'shortcut',
          })
        },
      },
    ]

    const getShortcutKey = ({
      keyCode = 0,
      ctrl = false,
      shift = false,
      alt = false,
    }) => `${keyCode}:${ctrl}:${shift}:${alt}`
    const defaultShortcuts = standardShortcuts.reduce(
      (shortcuts: any, shortcut: any) =>
        Object.assign(shortcuts, {
          [getShortcutKey(shortcut)]: shortcut,
        }),
      {},
    )
    const mergedShortcuts = (props.shortcuts || []).reduce(
      (shortcuts: any, shortcut: any) => {
        const {keyCode, handle} = shortcut
        if (keyCode && typeof handle === 'function') {
          return Object.assign(shortcuts, {
            [getShortcutKey(shortcut)]: shortcut,
          })
        }
        return shortcuts
      },
      defaultShortcuts,
    )

    const gradeShortcut = (s: any) => {
      let score = 0
      const ps = ['ctrl', 'shift', 'alt']
      ps.forEach((key) => {
        if (s[key]) {
          score++
        }
      })
      return score
    }

    return Object.keys(mergedShortcuts)
      .map((key) => mergedShortcuts[key])
      .sort((a, b) => gradeShortcut(b) - gradeShortcut(a))
  }, [
    currentTime,
    duration,
    hasStarted,
    playbackRate,
    props.shortcuts,
    rootElem,
    togglePlay,
    videoService,
    volume,
  ])

  const handleKeyPress = React.useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) {
        return
      }
      if (
        document.activeElement &&
        (hasClass(document.activeElement, 'cueplayer-react-control') ||
          hasClass(
            document.activeElement,
            'cueplayer-react-menu-button-active',
          ) ||
          // || hasClass(document.activeElement, 'cueplayer-react-slider')
          hasClass(document.activeElement, 'cueplayer-react-big-play-button'))
      ) {
        return
      }

      const keyCode = e.keyCode || e.which
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      const alt = e.altKey

      const shortcut = shortCutsRef.current.filter((s) => {
        if (!s.keyCode || s.keyCode - keyCode !== 0) {
          return false
        }
        return !(
          (s.ctrl !== undefined && s.ctrl !== ctrl) ||
          (s.shift !== undefined && s.shift !== shift) ||
          (s.alt !== undefined && s.alt !== alt)
        )
      })[0]

      if (shortcut) {
        shortcut.handle()
        e.preventDefault()
      }
    },
    [isActive],
  )

  // only if player is active and player is ready
  const canBeClicked = React.useCallback(
    (e: Event) => {
      const target = e.target as Element
      return !(!isActive || target.nodeName !== 'VIDEO' || readyState !== 4)
    },
    [isActive, readyState],
  )

  const handleClick = React.useCallback(
    (e: Event) => {
      if (!canBeClicked(e) || !clickable) {
        return
      }
      togglePlay()
      // e.preventDefault();
    },
    [canBeClicked, clickable, togglePlay],
  )

  const handleDoubleClick = React.useCallback(
    (e: Event) => {
      if (!canBeClicked(e) || !dblclickable) {
        return
      }
      // this.toggleFullscreen()
      // e.preventDefault();
    },
    [canBeClicked, dblclickable],
  )

  React.useEffect(() => {
    shortCutsRef.current = mergeShortcuts()
    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('click', handleClick)
    document.addEventListener('dblclick', handleDoubleClick)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [handleClick, handleDoubleClick, handleKeyPress, mergeShortcuts])

  return null
}

// check if an element has a class name
export function hasClass(elm: any, cls: any) {
  const classes = elm.className.split(' ')
  for (let i = 0; i < classes.length; i++) {
    if (classes[i].toLowerCase() === cls.toLowerCase()) {
      return true
    }
  }
  return false
}
