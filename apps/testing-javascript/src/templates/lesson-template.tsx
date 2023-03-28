import * as React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {PortableText} from '@portabletext/react'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {MuxPlayerRefAttributes} from '@mux/mux-player-react/*'

import Layout from 'components/layout'
import PortableTextComponents from 'components/portable-text'

const WorkshopTemplate: React.FC<any> = ({lesson, module, transcript}) => {
  const router = useRouter()
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  return (
    // <VideoProvider
    //   muxPlayerRef={muxPlayerRef}
    //   path="/workshops"
    //   exerciseSlug={router.query.lesson as string}
    // >
    <Layout>
      <main className="relative z-10 flex flex-col items-center justify-center py-20">
        <div className="container">
          <h1 className="text-4xl mb-4 text-primary-500 font-bold">
            {lesson.title}
          </h1>
          <article className="prose w-full max-w-none pb-10 text-gray-900 lg:max-w-xl mb-4">
            <PortableText
              value={lesson.body}
              components={PortableTextComponents}
            />
          </article>
        </div>
      </main>
    </Layout>
    // </VideoProvider>
  )
}

export default WorkshopTemplate
