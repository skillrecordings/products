// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// We import object and document schemas
import blockContent from './documents/blockContent'
import category from './documents/category'
import post from './documents/post'
import author from './documents/author'
import module from './documents/module'
import pricing from './documents/pricing'
import product from './documents/product'
// objects
import bodyVideo from './objects/bodyVideo'
import bodyImage from './objects/bodyImage'
import mediaCaption from './objects/mediaCaption'
import body from './objects/body'
import feature from './objects/feature'
import externalImage from './objects/externalImage'
import callout from './objects/callout'
import divider from './objects/divider'
import videoResource from './documents/videoResource'
import internalLink from './objects/internalLink'
import externalLink from './objects/externalLink'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio.
    pricing,
    product,
    post,
    author,
    category,
    module,
    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
    blockContent,
    // objects
    body,
    bodyVideo,
    bodyImage,
    mediaCaption,
    externalImage,
    feature,
    callout,
    divider,
    externalLink,
    internalLink,
    videoResource,
  ]),
})
