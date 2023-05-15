import React from 'react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'bodyTestimonial',
  type: 'object',
  title: 'Testimonial',
  fields: [
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'reference',
      to: [
        {
          type: 'testimonial',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      testimonial: 'testimonial.body',
      externalUrl: 'testimonial?.external_url',
      authorName: 'testimonial.author.name',
      authorImage: 'testimonial.author.image.asset.url',
    },
  },
  components: {
    preview: (value: any) => {
      const {testimonial, authorName, authorImage, externalUrl} = value

      return (
        <div>
          <p style={{fontStyle: 'italic'}}>{testimonial}</p>
          {authorName && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {authorImage && (
                <img
                  width={40}
                  height={40}
                  style={{borderRadius: 20}}
                  src={authorImage}
                  alt={authorName}
                />
              )}
              <span style={{fontWeight: 500}}>{authorName}</span>
              {externalUrl && (
                <a href={externalUrl} target="_blank" rel="noreferrer">
                  Source
                </a>
              )}
            </div>
          )}
        </div>
      )
    },
  },
})
