// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'
import richDate from 'part:@sanity/form-builder/input/rich-date/schema'

// We import object and document schemas
import workshop from './documents/workshop'
import review from './documents/review'
// product
import package_ from './documents/package'
import module from './documents/module'
import section from './documents/section'
import lesson from './documents/lesson'
// objects
import bodyVideo from './objects/bodyVideo'
import bodyImage from './objects/bodyImage'
import mediaCaption from './objects/mediaCaption'
import body from './objects/body'
import feature from './objects/feature'
import externalImage from './objects/externalImage'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio.
    workshop,
    review,
    // product
    package_,
    module,
    section,
    lesson,
    // objects
    body,
    bodyVideo,
    bodyImage,
    mediaCaption,
    externalImage,
    feature,
    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
    richDate,
  ]),
})
