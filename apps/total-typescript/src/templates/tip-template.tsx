import React from 'react'
import Layout from 'components/app/layout'
import {PortableText} from '@portabletext/react'
import {TipPageProps} from 'pages/tips/[tip]'
import {useMuxPlayer, VideoProvider} from 'hooks/use-mux-player'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import {Tip} from 'lib/tips'

const path = '/tips'

const TipTemplate: React.FC<TipPageProps> = ({tip}) => {
  const muxPlayerRef = React.useRef<HTMLDivElement>()

  return (
    <VideoProvider lesson={tip as Tip} muxPlayerRef={muxPlayerRef} path={path}>
      <Layout>
        <main className="py-20 max-w-screen-lg w-full mx-auto">
          <Video ref={muxPlayerRef} />
          <article className="prose max-w-none">
            <h1 className="text-2xl font-medium">{tip.title}</h1>
            <PortableText value={tip.body} />
          </article>
        </main>
      </Layout>
    </VideoProvider>
  )
}

const Video: React.FC<any> = React.forwardRef(({}, ref: any) => {
  const {muxPlayerProps} = useMuxPlayer()
  return <MuxPlayer ref={ref} {...(muxPlayerProps as MuxPlayerProps)} />
})

export default TipTemplate
