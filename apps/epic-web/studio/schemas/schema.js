// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'
// —— documents
import page from './documents/page'
import article from './documents/article'
import exercise from './documents/exercise'
import module from './documents/module'
import section from './documents/section'
import explainer from './documents/explainer'
import lesson from './documents/lesson'

// —— objects
// body
import body from './objects/body'
import bodyVideo from './objects/bodyVideo'
import bodyImage from './objects/bodyImage'
import callout from './objects/callout'
import divider from './objects/divider'
import externalImage from './objects/externalImage'
import mediaCaption from './objects/mediaCaption'
import videoOptions from './objects/videoOptions'
import grid from './objects/grid'
import gridItem from './objects/gridItem'
import tweet from './objects/tweet'
import tip from './documents/tip'
import videoResource from './documents/videoResource'
import muxAsset from './objects/muxAsset'
import castingwordsTranscript from './objects/castingwordsTranscript'
import solution from './objects/resources/solution'
import muxVideo from './objects/resources/muxVideo'
import github from './objects/resources/github'
import gitpod from './objects/resources/gitpod'
import product from './objects/resources/product'
import githubRepo from './objects/github-repo'
import feature from './objects/feature'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // documents
    page,
    article,
    tip,
    videoResource,
    exercise,
    module,
    section,
    explainer,
    lesson,
    // objects
    body,
    feature,
    bodyVideo,
    bodyImage,
    callout,
    divider,
    externalImage,
    mediaCaption,
    videoOptions,
    grid,
    gridItem,
    tweet,
    muxAsset,
    castingwordsTranscript,
    solution,
    muxVideo,
    github,
    product,
    gitpod,
    githubRepo,
  ]),
})
