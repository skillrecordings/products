// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'
import richDate from 'part:@sanity/form-builder/input/rich-date/schema'

// We import object and document schemas
import workshop from './documents/workshop'
import article from './documents/article'
import videoResource from './documents/videoResource'
// product
import product from './documents/product'
import module from './documents/module'
import section from './documents/section'
import lesson from './documents/lesson'
import tag from './documents/tag'
// podcast
import podcast from './documents/podcast'
import episode from './documents/podcastEpisode'
import season from './documents/podcastSeason'
// objects
import bodyVideo from './objects/bodyVideo'
import bodyImage from './objects/bodyImage'
import mediaCaption from './objects/mediaCaption'
import body from './objects/body'
import feature from './objects/feature'
import externalImage from './objects/externalImage'
import callout from './objects/callout'
import divider from './objects/divider'
import linkListItem from './objects/linkListItem'
import schedule from './objects/schedule'
import muxAsset from './objects/muxAsset'
import castingwordsTranscript from './objects/castingwordsTranscript'

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
    article,
    videoResource,
    // product
    product,
    module,
    section,
    lesson,
    tag,
    // podcast
    podcast,
    episode,
    season,
    // objects
    body,
    bodyVideo,
    bodyImage,
    mediaCaption,
    externalImage,
    feature,
    callout,
    divider,
    linkListItem,
    schedule,
    muxAsset,
    castingwordsTranscript,
    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
    richDate,
  ]),
})
