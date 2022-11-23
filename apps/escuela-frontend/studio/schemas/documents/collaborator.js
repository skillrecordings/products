import UserIcon from 'part:@sanity/base/user-icon'
import React from 'react'

export default {
  name: 'collaborator',
  title: 'Collaborator',
  type: 'document',
  icon: UserIcon,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Please use "Firstname Lastname" format',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image URL',
      type: 'externalImage',
      description: 'Add url for the collaborator profile picture',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'twitter',
      title: 'Twitter',
      type: 'url',
      description: 'Add url for the collaborator twitter profile',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image.url',
    },
    prepare(selection) {
      const {media, title} = selection
      return {
        title: title,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
}
