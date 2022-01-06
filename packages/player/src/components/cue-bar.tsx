import * as React from 'react'
import classNames from 'classnames'
import {isEmpty} from 'lodash'
import Tippy from '@tippyjs/react'
import {track} from '@skillrecordings/analytics'
import CodeBlock from './code-block'
import {useVideo} from '../context/video-context'
import {useSelector} from '@xstate/react'
import {selectDuration} from '../selectors'
import {useCue} from '../hooks/use-cue'
import {ElementType} from 'react'
import ReactMarkdown from 'react-markdown'
import {useMetadataCues} from '../hooks/use-metadata-cues'

export const CueBar: React.FC<any> = ({
  className,
  disableCompletely,
  player,
  actions,
}) => {
  const videoService = useVideo()
  const duration = useSelector(videoService, selectDuration)
  const cues = useMetadataCues()

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

const NoteCue: React.FC<any> = ({cue, duration, className}) => {
  const [visible, setVisible] = React.useState(false)
  const [mouseOverTippy, setMouseOverTippy] = React.useState(false)
  const videoService = useVideo()

  useCue(cue)

  const clickOpen = () => {
    // if we seek to the correct time, the note is displayed
    videoService.send({
      type: 'SEEKING',
      seekingTime: Number(cue.startTime),
      source: 'cue',
    })
    videoService.send('END_SEEKING')
    videoService.send('PAUSE')

    track('opened cue', {cue: cue.text})
  }

  const startPosition = `${(cue.startTime / duration) * 100}%`

  let note: {text: string; type?: string}

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
      theme="light"
      maxWidth={300}
      appendTo="parent"
      offset={[0, 30]}
      interactive={true}
      visible={visible || mouseOverTippy}
      content={
        <div
          onMouseMove={() => setMouseOverTippy(true)}
          onMouseLeave={() => setTimeout(() => setMouseOverTippy(false), 300)}
          className="cueplayer-react-cue-popup-content"
        >
          <div className="cueplayer-react-cue-popup-header">header here</div>
          <div className="prose cueplayer-react-cue-popup-body">
            {/* @ts-ignore */}
            <ReactMarkdown renderers={customRenderers}>
              {note.text}
            </ReactMarkdown>
          </div>
        </div>
      }
    >
      <div
        onClick={clickOpen}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setTimeout(() => setVisible(false), 300)}
        className={classNames(
          `${
            note.type === 'learner'
              ? 'cueplayer-react-cue-note-learner'
              : 'cueplayer-react-cue-note'
          }`,
          className,
        )}
        style={{left: startPosition}}
      />
    </Tippy>
  )
}
