import * as React from 'react'
import classNames from 'classnames'
import Tippy from '@tippyjs/react'
import CodeBlock from './code-block'
import {useVideo} from '../context/video-context'
import {useSelector} from '@xstate/react'
import {selectDuration, selectViewer} from '../selectors'
import {useCue} from '../hooks/use-cue'
import {ElementType} from 'react'
import ReactMarkdown from 'react-markdown'
import {useMetadataCues} from '../hooks/use-metadata-cues'
import {convertTimeWithTitles} from '@skillrecordings/time'

export const CueBar: React.FC<React.PropsWithChildren<any>> = ({
  className,
  disableCompletely,
  player,
  actions,
}) => {
  const videoService = useVideo()
  const duration = useSelector(videoService, selectDuration)
  const cues = useMetadataCues()

  return disableCompletely ? null : (
    <div className={classNames('cueplayer-react-cue-bar', className)}>
      {cues.map((noteCue: any, i: number) => {
        return (
          <NoteCue
            key={`${noteCue.text}-${i}`}
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

const NoteCue: React.FC<React.PropsWithChildren<any>> = ({
  cue,
  duration,
  className,
}) => {
  const videoService = useVideo()
  const viewer = useSelector(videoService, selectViewer)

  useCue(cue)

  const clickOpen = () => {
    // if we seek to the correct time, the note is displayed
    videoService.send('PAUSE')
    videoService.send({
      type: 'SEEKING',
      seekingTime: Number(cue.startTime),
      source: 'cue',
    })
    videoService.send('END_SEEKING')
    // track('opened cue', {cue: cue.text})
  }

  const startPosition = `${(cue.startTime / duration) * 100}%`

  let note: {text: string; type?: string; image?: string}

  try {
    note = JSON.parse(cue.text)
  } catch (e) {
    note = {text: cue.text}
  }

  const customRenderers: {[nodeType: string]: ElementType} = {
    code: (props: any) => {
      return <CodeBlock {...props} />
    },
  }

  return (
    <Tippy
      placement="top"
      maxWidth={300}
      appendTo="parent"
      offset={[0, 12]}
      interactive={true}
      duration={400}
      trigger="mouseenter focus"
      delay={20}
      inertia={true}
      content={
        <div id={cue.startTime} className="cueplayer-react-cue-popup-content">
          <div className="cueplayer-react-cue-popup-body">
            <ReactMarkdown renderers={customRenderers}>
              {note.text}
            </ReactMarkdown>
          </div>
        </div>
      }
    >
      <button
        aria-label={`jump to note at ${convertTimeWithTitles(cue.startTime, {
          showSeconds: true,
          longForm: true,
        })}`}
        aria-describedby={cue.startTime}
        type="button"
        onClick={clickOpen}
        className={classNames(
          `${
            note.type === 'learner'
              ? 'cueplayer-react-cue-note-learner'
              : 'cueplayer-react-cue-note'
          }`,
          className,
        )}
        style={{
          left: startPosition,
          backgroundImage: `url(${note.image || viewer.avatar_url})`,
          backgroundColor: note.image ? 'transparent' : `#b8c1cf`,
          border: '1px solid #20222b',
          // border: note.image ? 'none' : '1px solid #20222b',
          backgroundSize: 'contain',
        }}
      />
    </Tippy>
  )
}
