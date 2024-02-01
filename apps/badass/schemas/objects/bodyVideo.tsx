import React from 'react'
import {defineType, defineField} from 'sanity'
import ReactHlsPlayer from 'react-hls-player'

export default defineType({
  name: 'bodyVideo',
  type: 'object',
  title: 'Video',
  fields: [
    // TODO
    // defineField({
    //   name: 'video',
    //   type: 'mux.video',
    //   title: 'Video',
    // }),
    defineField({
      name: 'url',
      type: 'url',
      title: 'HLS URL',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Transcript',
      type: 'mediaCaption',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {url: 'url', title: 'title', transcript: 'caption'},
  },
  components: {
    preview: (props: any) => {
      const {url, transcript, title} = props
      const poster =
        url &&
        url
          .replace('stream.mux.com', 'image.mux.com')
          .replace('.m3u8', '/thumbnail.png?width=800&height=500&fit_mode=pad')
      return (
        <div>
          <details>
            <summary>
              <b>🎥 {title}</b>
            </summary>
            {/* TODO */}
            {/* {url && (
              // @ts-ignore
              <ReactHlsPlayer
                poster={poster}
                src={url}
                autoPlay={false}
                controls={true}
                width="400px"
                height="250px"
              />
            )} */}
            {url && (
              <video
                width="320"
                height="240"
                autoPlay={true}
                loop={true}
                controls={true}
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
