import * as React from 'react'

import Layout from 'components/app/layout'
import {useRouter} from 'next/router'

const YouTube = () => {
  const router = useRouter()
  const {query} = router

  return (
    <Layout footer={null} meta={{title: 'YouTube on Total TypeScript'}}>
      <div className="video-responsive mt-16 sm:mt-40">
        <iframe
          width="853"
          height="480"
          src={`https://www.youtube.com/embed/${query.id}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
    </Layout>
  )
}

export default YouTube
