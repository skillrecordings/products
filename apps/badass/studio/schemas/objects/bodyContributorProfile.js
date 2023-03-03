import React from 'react'

export default {
  name: 'bodyContributorProfile',
  type: 'object',
  title: 'Contributor Profile',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
  ],
  preview: {
    select: {name: 'name'},
    component: ({value}) => {
      const {name} = value
      return name ? <div>client: {name}</div> : null
    },
  },
}
