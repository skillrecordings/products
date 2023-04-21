import {MuxPlayerRefAttributes} from '@mux/mux-player-react/*'
import {hmsToSeconds} from '@skillrecordings/time'
import {RefObject} from 'react'
import ReactMarkdown, {Components} from 'react-markdown'

const getMarkdownComponents = ({
  muxPlayerRef,
  handlePlay,
}: {
  muxPlayerRef: RefObject<MuxPlayerRefAttributes | null>
  handlePlay: () => void
}) => {
  return {
    p: ({children}: any) => {
      const text = children.toString()
      const timestampRegex = /\[(\d+:\d+)\]/
      const matches = text.match(timestampRegex)
      if (matches) {
        const timestamp = matches[1]
        const link = `https://www.youtube.com/watch?v=<VIDEO_ID>&t=${timestamp}`
        const beforeText = text.split(matches[0])[0]
        const afterText = text.split(matches[0])[1]
        return (
          <p>
            {beforeText}
            <button
              className="after:content-[' '] inline-block underline after:inline-block"
              onClick={() => {
                if (muxPlayerRef.current) {
                  muxPlayerRef.current.currentTime = hmsToSeconds(timestamp)
                  handlePlay()
                  window.scrollTo({top: 0})
                }
              }}
            >
              {timestamp}
            </button>
            {afterText}
          </p>
        )
      }
      return <p>{text}</p>
    },
  }
}

export {getMarkdownComponents}
