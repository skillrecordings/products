import React from 'react'
import {defineType, defineField, defineArrayMember} from 'sanity'
import {FiTwitter, FiUser} from 'react-icons/fi'

export default defineType({
  name: 'bodyGrid',
  type: 'object',
  title: 'Grid',
  fields: [
    defineField({
      title: 'Grid Items',
      type: 'array',
      name: 'items',
      of: [
        defineArrayMember({type: 'bodyContributorProfile'}),
        defineArrayMember({type: 'bodyClientProfile'}),
        defineArrayMember({type: 'tweet'}),
      ],
    }),
  ],
  preview: {
    select: {items: 'items'},
  },
  components: {
    preview: (props: any) => {
      const {items} = props
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
})
