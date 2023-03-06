import React from 'react'

export default {
  name: 'bodyClientProfile',
  type: 'object',
  title: 'Client Profile',
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
    select: {
      name: 'name',
      image: 'image.asset.url',
      description: 'description',
    },
    component: ({value}) => {
      const {name, image, description} = value
      return name ? (
        <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
          {image && (
            <img
              src={image}
              width={70}
              height={70}
              style={{borderRadius: 35}}
            />
          )}
          <div>
            <strong>{name}</strong>
            {description && (
              <small>
                <br />
                {description}
              </small>
            )}
          </div>
        </div>
      ) : null
    },
  },
}
