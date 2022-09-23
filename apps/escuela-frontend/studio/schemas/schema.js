// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'
// documents
import article from './documents/article'
import module from './documents/module'
import section from './documents/section'
import lesson from './documents/lesson'
// objects
import bodyVideo from './objects/bodyVideo'
import bodyImage from './objects/bodyImage'
import body from './objects/body'
import callout from './objects/callout'
import divider from './objects/divider'
import externalImage from './objects/externalImage'
import mediaCaption from './objects/mediaCaption'
import videoOptions from './objects/videoOptions'
import github from './objects/github'
import muxAsset from './objects/muxAsset'
import stackblitz from './objects/stackblitz'
import muxVideo from './objects/muxVideo'
import exercise from './objects/resources/exercise'
import solution from './objects/resources/solution'
import talk from './objects/resources/talk'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio.

    // documents
    article,
    module,
    section,
    lesson,
    //objects
    body,
    bodyVideo,
    bodyImage,
    callout,
    divider,
    externalImage,
    mediaCaption,
    videoOptions,
    github,
    muxAsset,
    muxVideo,
    stackblitz,
    solution,
    exercise,
    talk,
    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
  ]),
})
