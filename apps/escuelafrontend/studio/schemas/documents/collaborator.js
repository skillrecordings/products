import {MdGroup as icon} from 'react-icons/md'
import React from 'react'

export default {
  name: 'collaborator',
  title: 'Collaborator',
  type: 'document',
  icon: icon,
  fields: [
    {
      name: 'department',
      title: 'Department',
      type: 'string',
      description: 'Most likely Escuela Frontend',
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
    },
    {
      name: 'person',
      title: 'Person',
      type: 'reference',
      to: [{type: 'person'}],
    },

    {
      name: 'externalId',
      title: 'External ID',
      type: 'number',
    },
  ],
  preview: {
    select: {
      role: 'role',
      name: 'person.name',
      department: 'department',
      media: 'person.image.url',
    },
    prepare(selection) {
      const {name, department, media, role} = selection
      return {
        title: `${name}`,
        subtitle: `${role}${department ? ` • ${department}` : ''}`,
        media: <img src={media} alt={`${name}`} />,
      }
    },
  },
}
