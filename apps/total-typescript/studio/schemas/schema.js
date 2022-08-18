// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'
// —— documents
import page from './documents/page'
import mail from './documents/mail'
import quiz from './documents/quiz'
import question from './documents/question'
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
// emailBody
import emailBody from './objects/email/body'
import emailImage from './objects/email/image'
import emailButton from './objects/email/button'
import emailQuizQuestion from './objects/email/quiz-question'
// quiz
import choice from './objects/quiz/choice'
import codeFile from './objects/quiz/code-file'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // documents
    page,
    mail,
    quiz,
    question,
    // objects
    body,
    emailBody,
    emailImage,
    emailButton,
    emailQuizQuestion,
    bodyVideo,
    bodyImage,
    callout,
    divider,
    externalImage,
    mediaCaption,
    videoOptions,
    grid,
    gridItem,
    choice,
    codeFile,
  ]),
})
