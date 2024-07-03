import * as React from 'react'
import Demo from './how-react-uses-closures-to-avoid-bugs'
import PodcastTranscript from './podcast-transcript'
import CodeBlock from './code'

type MDXComponents = {
  [key: string]: React.ComponentType<any>
}

const mdxComponents: MDXComponents = {
  pre: ({children}: {children: React.ReactNode}) => {
    const child = React.Children.only(children) as React.ReactElement
    return <CodeBlock {...child.props} />
  },
  Demo: Demo,
  PodcastTranscript: ({children}: {children: React.ReactNode}) => (
    <PodcastTranscript>{children}</PodcastTranscript>
  ),
}

export default mdxComponents
