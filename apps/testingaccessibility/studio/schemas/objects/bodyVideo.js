import React from 'react'
import ReactHlsPlayer from 'react-hls-player'
// import ReactMarkdown from 'react-markdown'

export default {
  name: 'bodyVideo',
  type: 'object',
  title: 'Video',
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'HLS URL',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Transcript',
      type: 'mediaCaption',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {url: 'url', title: 'title', transcript: 'caption'},
    component: ({value}) => {
      const {url, transcript, title} = value
      const poster = url
        .replace('stream.mux.com', 'image.mux.com')
        .replace('.m3u8', '/thumbnail.png?width=800&height=500&fit_mode=pad')
      return (
        <div>
          <details>
            <summary>
              <b>🎥 {title}</b>
            </summary>
            {url && (
              <ReactHlsPlayer
                poster={poster}
                src={url}
                autoPlay={false}
                controls={true}
                width="400px"
                height="250px"
              />
            )}
          </details>
          {transcript && (
            <details>
              <summary>Transcript</summary>
              <p>{transcript}</p>
            </details>
          )}
        </div>
      )
    },
  },
}
