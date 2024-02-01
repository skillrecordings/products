import React from 'react'

export default {
  name: 'bodyImage',
  type: 'object',
  title: 'Image',
  fields: [
    {
      type: 'cloudinary.asset',
      name: 'image',
      description: 'This asset is served from Cloudinary',
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'mediaCaption',
    },
  ],
  preview: {
    select: {image: 'image', alt: 'alt', caption: 'caption'},
    component: ({value}) => {
      const {alt, caption, image} = value
      return image ? (
        <>
          <div>
            <img width="100%" height="auto" src={image.url} alt={alt} />
          </div>
          {alt && <b>{alt}</b>} {caption && <i>caption: {caption}</i>}
        </>
      ) : (
        <div>⚠️ missing image</div>
      )
    },
  },
}
