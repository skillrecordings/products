import React from 'react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'bodyVideo',
  type: 'object',
  title: 'Video',
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'Video URL',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'videoOptions',
      type: 'videoOptions',
      title: 'Video Options',
    }),
    defineField({
      name: 'caption',
      title: 'Transcript',
      type: 'mediaCaption',
    }),
  ],
  preview: {
    select: {
      url: 'url',
      title: 'title',
      transcript: 'caption',
      videoOptions: 'videoOptions',
    },
  },
  components: {
    preview: (selection: any) => {
      const {url, transcript, title, videoOptions} = selection
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
})
