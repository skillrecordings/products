import React from 'react'
import {FiTwitter, FiUser} from 'react-icons/fi'

export default {
  name: 'bodyGrid',
  type: 'object',
  title: 'Grid',
  fields: [
    {
      title: 'Grid Items',
      type: 'array',
      name: 'items',
      of: [
        {type: 'bodyContributorProfile'},
        {type: 'bodyClientProfile'},
        {type: 'tweet'},
      ],
    },
  ],
  preview: {
    select: {items: 'items'},
    component: ({value}) => {
      const {items} = value
      return items ? (
        <div
          style={{display: 'grid', gridAutoFlow: 'column', overflowX: 'auto'}}
        >
          {items.map(({_type, ...props}) => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  padding: '20px 0',
                }}
              >
                {_type === 'tweet' && (
                  <>
                    <strong
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FiTwitter /> Tweet
                    </strong>
                    <small>({props.tweetId})</small>
                  </>
                )}
                {_type === 'bodyContributorProfile' && (
                  <>
                    <strong
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FiUser /> {props.name}
                    </strong>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ) : null
    },
  },
}
