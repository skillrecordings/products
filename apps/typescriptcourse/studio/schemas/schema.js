// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// We import object and document schemas
import article from './documents/article'
import tag from './documents/tag'

//documents
import cta from './documents/cta'
import module from './documents/module'
import explainer from './documents/explainer'
import videoResource from './documents/videoResource'
import lesson from './documents/lesson'

// podcast
import podcast from './documents/podcast'
import episode from './objects/resources/podcastEpisode'
import season from './objects/resources/podcastSeason'

// objects
import body from './objects/body'
import bodyImage from './objects/bodyImage'
import callout from './objects/callout'
import divider from './objects/divider'
import externalImage from './objects/externalImage'
import mediaCaption from './objects/mediaCaption'
import twitter from './objects/twitter'
import muxVideo from './objects/resources/muxVideo'
import github from './objects/github'

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
    cta,
    module,
    explainer,
    videoResource,
    lesson,
    // podcast
    podcast,
    episode,
    season,
    // objects
    body,
    bodyImage,
    callout,
    divider,
    externalImage,
    mediaCaption,
    twitter,
    muxVideo,
    github,
  ]),
})
