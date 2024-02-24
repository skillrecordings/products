import Demo from './how-react-uses-closures-to-avoid-bugs'
import PodcastTranscript from './podcast-transcript'

const mdxComponents = {
  Demo: () => <Demo />,
  PodcastTranscript: ({children}: {children: React.ReactNode}) => (
    <PodcastTranscript>{children}</PodcastTranscript>
  ),
}

export default mdxComponents
