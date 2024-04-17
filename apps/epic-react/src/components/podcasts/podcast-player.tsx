import * as React from 'react'
import {useTheme} from 'next-themes'
import {motion} from 'framer-motion'

const PodcastPlayer = ({episodeId}: {episodeId: string}) => {
  const {theme} = useTheme()
  const [state, setState] = React.useState({loading: true})
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)

  React.useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `https://player.simplecast.com/${episodeId}?dark=${
        theme === 'dark'
      }&color=${theme === 'dark' ? '162238' : 'FFFFFF'}`
    }
    iframeRef.current?.addEventListener('load', () =>
      setState({loading: false}),
    )
    return () => {
      iframeRef.current?.removeEventListener('load', () =>
        setState({loading: false}),
      )
    }
  }, [theme, episodeId])
  return (
    <div className="relative my-8 overflow-hidden rounded-sm">
      {state.loading && (
        <motion.div
          animate={{
            opacity: [0.1, 1, 0.1],
          }}
          transition={{duration: 2, repeat: Infinity, repeatType: 'loop'}}
          className="absolute top-0 w-full overflow-hidden rounded-sm bg-[#222f44]"
          style={{height: 200}}
        >
          <motion.div
            className="absolute h-full w-40 rounded-full bg-[#384357]"
            animate={{left: ['0%', '100%']}}
            transition={{duration: 2, repeat: Infinity, repeatType: 'loop'}}
            style={{filter: 'blur(80px)'}}
          />
        </motion.div>
      )}

      <iframe ref={iframeRef} height="200px" width="100%" seamless />
    </div>
  )
}

export default PodcastPlayer
