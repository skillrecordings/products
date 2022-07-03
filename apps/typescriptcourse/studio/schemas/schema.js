// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// We import object and document schemas
import article from './documents/article'
import tag from './documents/tag'

// objects
import body from './objects/body'
import bodyImage from './objects/bodyImage'
import callout from './objects/callout'
import divider from './objects/divider'
import externalImage from './objects/externalImage'
import mediaCaption from './objects/mediaCaption'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /* Your types here! */
    // documents
    article,
    tag,
    // objects
    body,
    bodyImage,
    callout,
    divider,
    externalImage,
    mediaCaption,
  ]),
})
