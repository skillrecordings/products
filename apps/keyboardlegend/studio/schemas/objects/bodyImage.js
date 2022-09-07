import React from 'react'

export default {
  name: 'bodyImage',
  type: 'object',
  title: 'Image',
  fields: [
    {
      name: 'src',
      title: 'Image url',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'width',
      title: 'Image width',
      type: 'string',
    },
    {
      name: 'height',
      title: 'Image height',
      type: 'string',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'mediaCaption',
    },
    {
      name: 'href',
      title: 'External link',
      type: 'url',
    },
  ],
  preview: {
    select: {
      src: 'src',
      alt: 'alt',
      caption: 'caption',
      width: 'width',
      height: 'height',
    },
    component: ({value}) => {
      const {alt, caption, src, width, height} = value
      return src ? (
        <>
          <div>
            <img
              width={width || '100%'}
              height={height || 'auto'}
              src={src}
              alt={alt}
            />
          </div>
          {alt && <b>{alt}</b>} {caption && <i>caption: {caption}</i>}
        </>
      ) : (
        <div>⚠️ missing image</div>
      )
    },
  },
}
