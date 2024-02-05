import {defineArrayMember, defineType} from 'sanity'

export default defineType({
  title: 'Media Caption',
  name: 'mediaCaption',
  type: 'array',
  of: [defineArrayMember({type: 'block'})],
})
