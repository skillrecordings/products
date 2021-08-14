import * as React from 'react'
import VideoTemplate from 'templates/video'
import Layout from 'layouts'

const resource = {
  title: 'Title',
  slug: 'video',
  description:
    'Consectetur dolor ultricies ante dignissim nascetur dapibus habitasse sem, integer hendrerit neque proin fringilla rutrum iaculis volutpat, sagittis sociis eu metus donec dis taciti. Varius pellentesque convallis vulputate elementum fusce fames imperdiet metus cum, nunc nisl erat tortor tempor pharetra netus cras vestibulum, ipsum nostra congue hendrerit et morbi iaculis luctus. Vestibulum habitasse nisl nostra senectus quisque at imperdiet pellentesque, aliquam class dolor interdum est cursus eu sem magnis, ac varius velit condimentum mus ridiculus iaculis.',
}

const VideoPage = () => {
  return (
    <Layout>
      <VideoTemplate resource={resource} />
    </Layout>
  )
}

export default VideoPage
