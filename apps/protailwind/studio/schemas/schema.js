// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'
// documents
import article from './documents/article'
import tip from './documents/tip'
import videoResource from './documents/videoResource'
import cta from './documents/cta'
import exercise from './documents/exercise'
import module from './documents/module'
import testimonial from './documents/testimonial'
import section from './documents/section'
import explainer from './documents/explainer'
import product from './documents/product'
import bundle from './documents/bundle'
// objects
import bodyVideo from './objects/bodyVideo'
import bodyImage from './objects/bodyImage'
import body from './objects/body'
import callout from './objects/callout'
import divider from './objects/divider'
import externalImage from './objects/externalImage'
import mediaCaption from './objects/mediaCaption'
import videoOptions from './objects/videoOptions'
import tweet from './objects/tweet'
import muxAsset from './objects/muxAsset'
import castingwordsTranscript from './objects/castingwordsTranscript'
import solution from './objects/resources/solution'
import muxVideo from './objects/resources/muxVideo'
import stackblitz from './objects/stackblitz'
import codeFile from './objects/code-file'
import sandpack from './objects/resources/sandpack'
import github from './objects/github'
import figma from './objects/resources/figma'
import feature from './objects/feature'

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
    tip,
    videoResource,
    cta,
    exercise,
    module,
    testimonial,
    section,
    explainer,
    product,
    bundle,
    //objects
    body,
    bodyVideo,
    bodyImage,
    callout,
    divider,
    externalImage,
    mediaCaption,
    videoOptions,
    tweet,
    muxAsset,
    castingwordsTranscript,
    solution,
    muxVideo,
    stackblitz,
    sandpack,
    codeFile,
    github,
    figma,
    feature,
    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
  ]),
})
