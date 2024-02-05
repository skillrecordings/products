import React from 'react'
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'bodyContributorProfile',
  type: 'object',
  title: 'Contributor Profile',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
  ],
  preview: {
    select: {name: 'name'},
  },
  components: {
    preview: (props: any) => {
      const {name} = props
      return name ? <div>contributor: {name}</div> : null
    },
  },
})
