import React from 'react'
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'bodyImage',
  type: 'object',
  title: 'Image',
  fields: [
    defineField({
      type: 'cloudinary.asset',
      name: 'image',
      description: 'This asset is served from Cloudinary',
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'mediaCaption',
    }),
  ],
  preview: {
    select: {image: 'image', alt: 'alt', caption: 'caption'},
  },
  components: {
    preview: (props: any) => {
      const {alt, caption, image} = props
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
})
