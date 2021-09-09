import * as React from 'react'
import classNames from 'classnames'
import {isEmpty} from 'lodash'
import Tippy from '@tippyjs/react'
import {scroller} from 'react-scroll'
import {track} from '@skillrecordings/analytics'
import {useNotesCues} from '../../hooks/use-notes-cues'
import CodeBlock from '@skillrecordings/react/dist/components/code-block'
import {useVideo} from '../../context/video-context'
import {useSelector} from '@xstate/react'
import {selectDuration, selectVideo} from '../../selectors'
import {useCue} from '../../hooks/use-cue'
import {ElementType} from 'react'
import ReactMarkdown from 'react-markdown'

export const CueBar: React.FC<any> = ({
  className,
  disableCompletely,
  player,
  actions,
}) => {
  const videoService = useVideo()
  const duration = useSelector(videoService, selectDuration)

  const cues = useNotesCues()

  return disableCompletely || isEmpty(cues) ? null : (
    <div className={classNames('cueplayer-react-cue-bar', className)}>
      {cues.map((noteCue: any) => {
        return (
          <NoteCue
            key={noteCue.text}
            cue={noteCue}
            duration={duration}
            player={player}
            actions={actions}
          />
        )
      })}
    </div>
  )
}

const MutePopupButton: React.FC<any> = () => {
  const muteNotes = false
  //TODO: Persist note muting
  return (
    <button
      className="text-gray-400 rounded flex-nowrap flex items-center text-xs"
      onClick={() => {
        track('muted note popup')
        //TODO: Actually mute it
      }}
    >
      {muteNotes ? (
        <>
          <span className="pr-1">unmute notes</span>
          <IconVolumeOff />
        </>
      ) : (
        <>
          <span className="pr-1">mute notes</span>
          <IconVolumeOn />
        </>
      )}
    </button>
  )
}

const NoteCue: React.FC<any> = ({cue, duration, className}) => {
  const [visible, setVisible] = React.useState(false)
  const [clickedOpen, setClickedOpen] = React.useState(false)
  const videoService = useVideo()
  const video = useSelector(videoService, selectVideo)
  const muteNotes = false
  const activeSidebarTab = 1

  const scrollToActiveNote = () => {
    scroller.scrollTo('active-note', {
      duration: 0,
      delay: 0,
      offset: -16,
      containerId: 'notes-tab-scroll-container',
    })
  }

  useCue(cue)

  const clickOpen = () => {
    setVisible(true)
    setClickedOpen(true)
    // if we seek to the correct time, the note is displayed
    // actions.seek(cue.startTime)
    // actions.pause()
    //TODO: Activate and do stuff
    track('opened cue', {cue: cue.text})
    // !muteNotes && setPlayerPrefs({activeSidebarTab: 1})
    if (activeSidebarTab === 1) {
      scrollToActiveNote()
    }
  }

  const clickClose = () => {
    setClickedOpen(false)
    setVisible(false)
  }

  const cueActive = false //player.activeMetadataTrackCues.includes(cue)
  const seeking = video?.seeking
  const playerReadyEnough = (video?.readyState ?? 0) > 0

  React.useEffect(() => {
    const isVisible = !muteNotes && cueActive && !seeking && playerReadyEnough
    if (!clickedOpen) {
      setVisible(isVisible)
    }
  }, [clickedOpen, cueActive, seeking, muteNotes, playerReadyEnough])

  // added seeking to the list here but getting some janky perf issues

  const startPosition = `${(cue.startTime / duration) * 100}%`

  let note: {text: string; type?: string}

  try {
    note = JSON.parse(cue.text)
  } catch (e) {
    note = {text: cue.text}
  }

  React.useEffect(() => {
    if (visible && activeSidebarTab === 1) {
      scrollToActiveNote()
    }
  }, [visible])

  const customRenderers: {[nodeType: string]: ElementType} = {
    code: (props: any) => {
      return <CodeBlock {...props} />
    },
  }

  return (
    <Tippy
      placement="top"
      theme="light"
      maxWidth={300}
      appendTo="parent"
      offset={[0, 30]}
      interactive={true}
      content={
        <div className="py-1">
          <div className="flex justify-end space-x-2">
            <MutePopupButton />
            <button
              className="text-gray-400 rounded flex-nowrap flex items-center text-xs"
              onClick={clickClose}
            >
              <IconX />
            </button>
          </div>
          <div className="line-clamp-6 prose-sm prose leading-normal">
            {/* @ts-ignore */}
            <ReactMarkdown renderers={customRenderers}>
              {note.text}
            </ReactMarkdown>
          </div>
        </div>
      }
      visible={visible}
      onClickOutside={clickClose}
    >
      <div
        onClick={clickOpen}
        className={classNames(
          `${
            note.type === 'learner'
              ? 'cueplayer-react-cue-note-learner'
              : 'cueplayer-react-cue-note'
          }`,
          {
            'cueplayer-react-cue-note-active': visible,
            'cueplayer-react-cue-note-inactive': !visible,
          },
          className,
        )}
        style={{left: startPosition}}
      />
    </Tippy>
  )
}

const IconVolumeOff: React.FC<any> = ({className}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={`w-4 h-4 ${className ?? ''}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        clipRule="evenodd"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
      />
    </svg>
  )
}

const IconVolumeOn: React.FC<any> = ({className}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={`w-4 h-4 ${className ?? ''}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
    </svg>
  )
}

const IconX: React.FC<any> = ({className}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 ${className ?? ''}`}
  >
    <g fill="none">
      <path
        d="M6 18L18 6M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)
