import * as React from 'react'
import {FiFigma} from 'react-icons/fi'

export default {
  name: 'figma',
  type: 'object',
  title: 'Figma',
  icon: FiFigma,
  fields: [
    {
      name: 'url',
      title: 'Project URL',
      type: 'url',
    },
  ],
}
