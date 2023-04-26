import React from 'react'

export default {
  name: 'bodyVideo',
  type: 'object',
  title: 'Video',
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'Video URL',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'videoOptions',
      type: 'videoOptions',
      title: 'Video Options',
    },
    {
      name: 'caption',
      title: 'Transcript',
      type: 'mediaCaption',
    },
  ],
  preview: {
    select: {
      url: 'url',
      title: 'title',
      transcript: 'caption',
      videoOptions: 'videoOptions',
    },
    component: ({value}) => {
      const {url, transcript, title, videoOptions} = value
      const {autoPlay, loop, controls} = videoOptions

      return (
        <div>
          <details>
            <summary>
              <b>🎥 {title ? title : ''}</b>
            </summary>
            {url && (
              <video
                width="320"
                height="240"
                autoPlay={autoPlay}
                loop={loop}
                controls={controls}
              >
                <source src={url} type="video/mp4" />
              </video>
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
